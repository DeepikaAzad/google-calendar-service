const mongoose = require("mongoose");
const UserAvailabilitySchema = mongoose.model("userAvailabilitySchema");

class UserAvailability {

    /**
     * Function to return user availability by emailId.
     *
     * @param {*} emailId 
     */
    async findUserAvailabilityByEmail(emailId) {
        try {
            return UserAvailabilitySchema.findOne({ emailId: emailId }).exec()
        } catch (error) {
            throw error;
        }
    }

    /**
     * Find one and update the document for the given emailId.
     *
     * @param {*} availablityObj 
     * @param {*} userAvailability 
     */
    async findOneAndUpdateObj(availablityObj, userAvailability) {
        try {
            return UserAvailabilitySchema.findOneAndUpdate({
                emailId: availablityObj.emailId
            }, userAvailability).exec();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Create user availability.
     *
     * @param {*} availabilityObj 
     */
    async createUserAvailability(availabilityObj) {
        try {
            return UserAvailabilitySchema.create(availabilityObj);
        } catch (error) {
            throw error;
        }
    }

    /**
     * This method check if for given user time slot us already booked.
     *
     * @param {*} userEmailId 
     * @param {*} startTime 
     * @param {*} endTime 
     * @param {*} weekDay
     * @return {boolean} 
     */
    async getSlotInfo(userEmailId, startTime, endTime, weekDay) {
        try {
            return UserAvailabilitySchema.findOne({
                emailId: userEmailId,
                weekDay: weekDay,
                timeSlot: {
                    $elemMatch: {
                        startTime: startTime,
                        endTime: endTime
                    }
                }
            }).exec();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Function to retrieve timeslots for a given user.
     * 
     * @param {*} emailId 
     */
    async getAllSlots(emailId) {
        try {
            return UserAvailabilitySchema.find({ emailId: emailId }).exec();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserAvailability;