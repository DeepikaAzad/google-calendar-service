const mongoose = require("mongoose");

const UserSchema = mongoose.model("userSchema");
const UserAvailabilitySchema = mongoose.model("userAvailabilitySchema");

const UserAvailabilityRepo = require("../repository/user_availability.repository");

const UserValidator = require("../validator/user.validator");

const Helpers = require("../util");

class User {

    /**
     * Function to save user.
     * @param {*} user 
     */
    async saveUser(user) {
        try {
            // Update if already exist otherwise insert new user
            const userResponse = await UserSchema.findOneAndUpdate({ id: user.id }, user, {
                new: true,
                upsert: true // Make this update into an upsert
            }).exec();
            return userResponse;
        } catch (error) {
            return reject(error);
        }
    }

    /**
     * Get loggedin user available time slots.
     * 
     * @param {*} user 
     * @return {array}
     */
    async getUserAvailability(user) {
        try {
            return await UserAvailabilitySchema.find({ emailId: user.email }).exec();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Function to save/update the availability time of the user.
     *
     * @param {*} availabilityObj 
     */
    async createUserAvailability(availabilityObj) {
        try {
            const userValidator = new UserValidator();
            userValidator.validateUserAvailability(availabilityObj);

            const userAvailabilityRepo = new UserAvailabilityRepo();
            const userAvailabilityObj = await UserAvailabilitySchema.findOne({ emailId: availabilityObj.emailId }).exec();
            if (Helpers.isObjectEmpty(userAvailabilityObj)) {
                return userAvailabilityRepo.createUserAvailability(availabilityObj);
            }

            // Duplicate events check.
            this.checkDuplicateEvents(userAvailabilityObj, availabilityObj);

            if (Helpers.isPropNullOrEmpty(availabilityObj.timeSlot.key) && Helpers.isPropNullOrEmpty(availabilityObj.timeSlot.intervalKey)) {
                return userAvailabilityRepo.createTimeSlot(availabilityObj);
            }

            if (!Helpers.isPropNullOrEmpty(availabilityObj.timeSlot.key) && Helpers.isPropNullOrEmpty(availabilityObj.timeSlot.intervalKey)) {
                for (let i = 0; i < userAvailabilityObj.timeSlot.length; i++) {
                    const timeSlotObj = userAvailabilityObj.timeSlot[i];
                    if (timeSlotObj.key == availabilityObj.timeSlot.key) {
                        if (timeSlotObj.weekDay != availabilityObj.weekDay) {
                            throw new Error("Too many changes in one request. Please change either weekDay or add new intervalSlot");
                        }
                        return userAvailabilityRepo.createIntervalSlot(availabilityObj, timeSlotObj);
                    }
                }
            }

            if (!Helpers.isPropNullOrEmpty(availabilityObj.timeSlot.key) && !Helpers.isPropNullOrEmpty(availabilityObj.timeSlot.intervalKey)) {
                for (let i = 0; i < userAvailabilityObj.timeSlot.length; i++) {
                    const timeSlotObj = userAvailabilityObj.timeSlot[i];
                    if (timeSlotObj.key == availabilityObj.timeSlot.key) {
                        for (let j = 0; j < timeSlotObj.interval.length; j++) {
                            const intervalObj = timeSlotObj.interval[j];
                            if (intervalObj.key == availabilityObj.timeSlot.intervalKey) {
                                if (timeSlotObj.weekDay != availabilityObj.timeSlot.weekDay) {
                                    throw new Error("Too many changes in one request. Please change either weekDay or update intervalSlot");
                                }
                                return userAvailabilityRepo.updateIntervalSlot(availabilityObj, timeSlotObj);
                            }
                        }
                    }
                }
            }
            throw new Error("Invalid State");
        } catch (error) {
            throw error;
        }
    }

    /**
     * Function to check if duplicate events exist in DB.
     *
     * @param {*} userAvailabilityObj 
     * @param {*} availabilityObj 
     */
    checkDuplicateEvents(userAvailabilityObj, availabilityObj) {
        try {
            for (let i = 0; i < userAvailabilityObj.timeSlot.length; i++) {
                const timeSlotObj = userAvailabilityObj.timeSlot[i];
                const isTimeSlotIsAvailable = this.checkTimeSlotIsAvailable(timeSlotObj, availabilityObj);
                if (!isTimeSlotIsAvailable) {
                    // Duplicate event
                    throw new Error("Duplicate event detected");
                }
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Function to check if duplicate timeSlotObj is already present in DB.
     *
     * @param {*} timeSlotObj 
     * @param {*} availabilityObj 
     */
    checkTimeSlotIsAvailable(timeSlotObj, availabilityObj) {
        try {
            const isIntervalAvailable = this.checkIntervalSlotIsAvailable(timeSlotObj.interval, availabilityObj.timeSlot.startTime);
            // if (!isIntervalAvailable) return isIntervalAvailable;
            if (!isIntervalAvailable && timeSlotObj.slotType == availabilityObj.timeSlot.slotType &&
                timeSlotObj.weekDay == availabilityObj.timeSlot.weekDay) {
                // Duplicate slot detected.
                return false;
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Function to check if duplicate intervalSlotObj is already present in DB.
     *
     * @param {*} intervals 
     * @param {*} startTime 
     */
    checkIntervalSlotIsAvailable(intervals, startTime) {
        try {
            for (let i = 0; i < intervals.length; i++) {
                const interval = intervals[i];
                if (interval.startTime == startTime) {
                    return false;
                }
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Find user exist or not.
     * 
     * @param {*} publisher 
     */
    async isUserExist(publisher) {
        try {
            return await UserSchema.findOne({ email: publisher + "@gmail.com" }).exists();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;