const mongoose = require("mongoose");

const UserAvailabilitySchema = mongoose.model("userAvailabilitySchema");
const DuplicateError = require("../exception/duplicateDataError.exception");

const Helpers = require("../util");

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
            const userAvailability = await UserAvailabilitySchema.findOne({ emailId: availabilityObj.emailId }).exec();
            if (!Helpers.isObjectEmpty(userAvailability)) {
                const ETimeSlots = userAvailability.timeSlot;
                const ETimeSlotWDay = this.getMatchedWeekday(ETimeSlots, availabilityObj.timeSlot);
                if (ETimeSlotWDay != undefined && ETimeSlotWDay.length != 0) {
                    const array = availabilityObj.timeSlot.interval.filter(this.comparer(ETimeSlotWDay.interval));
                    if (array.length != 0) {
                        throw new DuplicateError("Duplicate Interval " + JSON.stringify(array));
                    } else {
                        userAvailability.timeSlot = this.updateMatchedWDayInterval(userAvailability.timeSlot,ETimeSlotWDay,availabilityObj.timeSlot.interval);
                        console.log(userAvailability.timeSlot.toObject());
                        const result = await UserAvailabilitySchema.findOneAndUpdate({
                            emailId: availabilityObj.emailId
                        },userAvailability).exec();
                        console.log(result);
                    }
                } else {
                    // push into interval
                    (userAvailability.timeSlot).push(availabilityObj.timeSlot);
                    const result = await UserAvailabilitySchema.findOneAndUpdate({
                        emailId: availabilityObj.emailId
                    },userAvailability).exec();
                    console.log(result);
                }
            } else {
                const temp = [];
                temp.push(availabilityObj.timeSlot);
                availabilityObj.timeSlot = temp;
                UserAvailabilitySchema.create(availabilityObj);
            }
            return {
                "success" : true,
                "message" : "Successfully Updated"
            }
        } catch (error) {
            throw error;
        }
    }

    comparer(otherArray) {
        return function (current) {
            return otherArray.filter(function (other) {
                return (other.from <= current.from && current.from <= other.to) || (other.to >= current.to && current.to >= other.from)
            }).length != 0;
        }
    }

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

    updateMatchedWDayInterval(array, object,interval) {
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
}

module.exports = UserAvailability;