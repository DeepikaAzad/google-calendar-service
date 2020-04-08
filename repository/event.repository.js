const mongoose = require("mongoose");
const EventSchema = mongoose.model("eventSchema");

class Event {

    /**
     * Check if someone already booked for same time slot of given user.
     * 
     * @param {*} userEmailId 
     * @param {*} startDateTime 
     * @param {*} endDateTime 
     * @returns {boolean}
     */
    async isEventBooked(userEmailId, startDateTime, endDateTime) {
        return new Promise(async (resolve, reject) => {
            try {
                const event = await EventSchema.findOne({
                    start: {
                        dateTime: startDateTime
                    },
                    end: {
                        dateTime: endDateTime
                    },
                    organizer: {
                        email: userEmailId
                    }
                });
                const isAlreadyBooked = event != null ? true : false;
                return resolve(isAlreadyBooked);
            } catch (error) {
                return reject(error);
            }
        });
    }


    async updateOrCreateEvent(event, publisherEmail) {
        try {
            event.isNewEvent = true;
            // Update if already exist otherwise insert new user
            const userResponse = await EventSchema.findOneAndUpdate({
                start: {
                    dateTime: event.start.dateTime
                },
                end: {
                    dateTime: event.end.dateTime
                },
                publisherEmail: publisherEmail,
            }, event, {
                new: true, // return the document after update was applied.
                upsert: true // Make this update into an upsert
            }).exec();
            return userResponse;
        } catch (error) {
            throw error;
        }
    }

    /**
     * 
     * @param {*} userEmailId 
     */
    async getNewEventOfUser(userEmailId) {
        return await EventSchema.find({publisherEmail: userEmailId, isNewEvent: true}).exec();
    }

    /**
     * Find matching document and set is_new status false.
     * 
     * @param {*} userEmail 
     */
    async updateEventStatus(userEmail){
        try{
            await EventSchema.findOneAndUpdate({
                publisherEmail: userEmail
            }, {
                isNewEvent : false
            }).exec();
        }catch(error){
            throw error;
        }
    }
}

module.exports = Event;