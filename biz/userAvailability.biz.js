const UserAvailabilityRepo = require("../repository/userAvailability.repository");

const Helpers = require("../util");

const UserValidator = require("../validator/user.validator");

const DuplicateError = require("../exception/duplicateDataError.exception");

class UserAvailability {

    /**
     * Create user Availablity
     * * 1. Check if user exist -> NO -- save input req
     * * YES -> get existing object 
     * * 2. Check what type (consider only weekday) -- weekday
     * * 3. Is weekday Found -- NO -- push req in array of interval
     * * YES -> 
     * * Check if interval exit if not then push
     * @param {*} availabilityObj 
     */
    async createUserAvailability(availabilityObj) {
        try {
            const userValidator = new UserValidator();
            userValidator.validateUserAvailability(availabilityObj);

            const userAvailabilityRepo = new UserAvailabilityRepo();
            const userAvailability = await userAvailabilityRepo.findUserAvailabilityByEmail(availabilityObj.emailId);

            if (!Helpers.isObjectEmpty(userAvailability)) {
                const ETimeSlots = userAvailability.timeSlot;
                const ETimeSlotWDay = this.getMatchedWeekday(ETimeSlots, availabilityObj.timeSlot);
                if (ETimeSlotWDay != undefined && ETimeSlotWDay.length != 0) {
                    const array = availabilityObj.timeSlot.interval.filter(this.comparer(ETimeSlotWDay.interval));
                    if (array.length != 0) {
                        throw new DuplicateError("Duplicate Interval " + JSON.stringify(array));
                    } else {
                        userAvailability.timeSlot = this.updateMatchedWDayInterval(userAvailability.timeSlot, ETimeSlotWDay, availabilityObj.timeSlot.interval);
                        await userAvailabilityRepo.findOneAndUpdateObj(availabilityObj, userAvailability);
                    }
                } else {
                    // push into interval
                    (userAvailability.timeSlot).push(availabilityObj.timeSlot);
                    await userAvailabilityRepo.findOneAndUpdateObj(availabilityObj.emailId, userAvailability);
                }
            } else {
                const availabilityArr = [];
                availabilityArr.push(availabilityObj.timeSlot);
                availabilityObj.timeSlot = availabilityArr;
                userAvailabilityRepo.createUserAvailability(availabilityObj);
            }
            return {
                "success": true,
                "message": "Successfully Updated"
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * 
     * @param {*} otherArray 
     */
    comparer(otherArray) {
        return function (current) {
            return otherArray.filter(function (other) {
                return (other.from <= current.from && current.from <= other.to) || (other.to >= current.to && current.to >= other.from)
            }).length != 0;
        }
    }

    /**
     * 
     * @param {*} array 
     * @param {*} object 
     */
    getMatchedWeekday(array, object) {
        try {
            for (let i = 0; i < array.length; i++) {
                if (array[i].weekDay == object.weekDay)
                    return array[i];
            }
            return [];
        } catch (error) {
            throw error;
        }
    }

    /**
     * 
     * @param {*} array 
     * @param {*} object 
     * @param {*} interval 
     */
    updateMatchedWDayInterval(array, object, interval) {
        try {
            for (let i = 0; i < array.length; i++) {
                if (array[i].weekDay == object.weekDay) {
                    array[i].interval = (array[i].interval).toObject().concat(interval);
                    console.log(array.toObject());
                    return array;
                }
            }
            return [];
        } catch (error) {
            throw error;
        }
    }

    /**
     * Function to check if time slot is available for a given user.
     *
     * @param {*} userEmailId 
     * @param {*} startTime 
     * @param {*} endTime 
     * @param {*} weekDay 
     */
    async isTimeSlotAvailable(userEmailId, startTime, endTime, weekDay) {
        try {
            const userAvailabilityRepo = new UserAvailabilityRepo();
            const result = await userAvailabilityRepo.getSlotInfo(userEmailId, startTime, endTime, weekDay);
            return result != null ? false : true
        } catch (error) {
            throw error;
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
            const userAvailabilityRepo = new UserAvailabilityRepo();
            return userAvailabilityRepo.getAllSlots(user.email);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserAvailability;