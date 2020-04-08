const mongoose = require("mongoose");
const UserAvailabilitySchema = mongoose.model("userAvailabilitySchema");

const Helpers = require("../util");

class UserAvailability {

    /**
     * This method check if for given user time slot us already booked.
     * @param {*} userEmailId 
     * @param {*} startTime 
     * @param {*} endTime 
     * @param {*} weekDay
     * @return {boolean} 
     */
    async isTimeSlotAvailable(userEmailId, startTime, endTime, weekDay) {
        try {
            const timeSlot = await UserAvailabilitySchema.findOne({
                emailId: userEmailId,
                weekDay: weekDay,
                timeSlot: {
                    $elemMatch: {
                        startTime: startTime,
                        endTime: endTime
                    }
                }
            }).exec()
            const isAvailable = timeSlot != null ? false : true;
            return isAvailable;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Function to create UserAvailability.
     *
     * @param {*} availabilityObj 
     */
    async createUserAvailability(availabilityObj) {
        try {
            return UserAvailabilitySchema.create({
                emailId: availabilityObj.emailId,
                timeSlot: [{
                    key: Helpers.uniqid(),
                    slotType: availabilityObj.timeSlot.slotType,
                    weekDay: availabilityObj.timeSlot.weekDay || null,
                    date: availabilityObj.timeSlot.date || null,
                    interval: [{
                        key: Helpers.uniqid(),
                        startTime: availabilityObj.timeSlot.startTime
                    }]
                }]
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Function to update the timeSlot array with new availability timeSlot.
     *
     * @param {*} availabilityObj 
     */
    async createTimeSlot(availabilityObj) {
        try {
            return UserAvailabilitySchema.findOneAndUpdate({
                emailId: availabilityObj.emailId
            }, {
                $addToSet: {
                    timeSlot: {
                        key: Helpers.uniqid(),
                        slotType: availabilityObj.timeSlot.slotType,
                        weekDay: availabilityObj.timeSlot.weekDay || null,
                        date: availabilityObj.timeSlot.date || null,
                        interval: [{
                            key: Helpers.uniqid(),
                            startTime: availabilityObj.timeSlot.startTime
                        }]
                    }
                }
            }).exec();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Function to update the timeSlot array with new availability interval.
     *
     * @param {*} availabilityObj 
     * @param {*} timeSlotKey 
     */
    async createIntervalSlot(availabilityObj, timeSlotObj) {
        try {
            const intervals = [];
            for (let i = 0; i < timeSlotObj.interval.length; i++) {
                intervals.push({
                    key: timeSlotObj.interval[i].key,
                    startTime: timeSlotObj.interval[i].startTime
                });
            }
            intervals.push({
                key: Helpers.uniqid(),
                startTime: availabilityObj.timeSlot.startTime
            })
            return UserAvailabilitySchema.findOneAndUpdate({ "timeSlot.key": timeSlotObj.key }, {
                $set: {
                    "timeSlot.$.slotType": timeSlotObj.slotType,
                    "timeSlot.$.weekDay": availabilityObj.timeSlot.weekDay,
                    "timeSlot.$.date": timeSlotObj.date,
                    "timeSlot.$.interval": intervals
                }
            }).exec();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Function to update the existing availability model for the existing timeSlot.
     *
     * @param {*} availabilityObj 
     * @param {*} timeSlotObj 
     */
    async updateIntervalSlot(availabilityObj, timeSlotObj) {
        try {
            const intervals = [];
            for (let i = 0; i < timeSlotObj.interval.length; i++) {
                const interval = timeSlotObj.interval[i];
                intervals.push({
                    key: interval.key,
                    startTime: interval.key == availabilityObj.timeSlot.intervalKey ? availabilityObj.timeSlot.startTime : interval.startTime
                });
            }
            return UserAvailabilitySchema.findOneAndUpdate({ "timeSlot.key": timeSlotObj.key }, {
                $set: {
                    "timeSlot.$.slotType": timeSlotObj.slotType,
                    "timeSlot.$.weekDay": availabilityObj.timeSlot.weekDay,
                    "timeSlot.$.date": timeSlotObj.date,
                    "timeSlot.$.interval": intervals
                }
            }).exec();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserAvailability;