const { google } = require("googleapis");

const UserBiz = require("../biz/user.biz");
const UserAvailability = require("../biz/userAvailability.biz");

const EventRepo = require("../repository/event.repository");

const EventValidator = require("../validator/event.validator");

const EventAvailabilityException = require("../exception/eventAvailability.exception");

const ResourceNotFoundError = require("../exception/resourceNotFoundError.exception");

class Calendar {

    /**
     * Function to get calendar evnets from Google calendar.
     *
     * @param {*} auth 
     * @param {*} timeMin 
     * @param {*} timeMax 
     */
    async getCalendarEvents(auth, timeMin = null, timeMax = null) {
        try {
            const date = new Date();
            timeMin = timeMin || (new Date(date.getFullYear(), date.getMonth())).toISOString();
            timeMax = timeMax || (new Date(date.getFullYear(), date.getMonth() + 1)).toISOString();
            const calendar = google.calendar({ version: "v3", auth });
            const calendarResponse = await calendar.events.list({
                calendarId: "primary",
                timeMin: timeMin,
                timeMax: timeMax,
                maxResults: 31,
                singleEvents: true,
                orderBy: "startTime"
            });
            const events = calendarResponse.data.items;
            return events;
        } catch (error) {
            throw error;
        }
    }

    /**
     * This Method books timeslot with organizer
     * Check if timeslot is available and not booked.
     *  
     * @param {*} event
     * @param {*} publisher  
     */
    async createEvent(event, publisher) {
        try {
            const publisherEmail = publisher + "@gmail.com";
            const userBiz = new UserBiz();
            const isUserExist = await userBiz.isUserExist(publisherEmail);
            if (publisher != null && !isUserExist) {
                throw new ResourceNotFoundError("The page you are looking for could not be found.")
            }
            // Validate event request
            const eventValidator = new EventValidator();
            eventValidator.validateEventObj(event);

            const availabilityObj = new UserAvailability();
            const userEmailId = publisherEmail;
            const timeAndWeekday = this.getWeekDayAndTime(event.start.dateTime, event.end.dateTime);

            const startTime = timeAndWeekday.start_time;
            const endTime = timeAndWeekday.end_time;
            const weekDay = timeAndWeekday.week_day;

            const isTimeSlotAvailable = await availabilityObj.isTimeSlotAvailable(userEmailId, startTime, endTime, weekDay);
            const eventRepo = new EventRepo();
            if (!isTimeSlotAvailable) {
                throw new EventAvailabilityException("Time slot is not avialable.");
            } else {
                const isEventBooked = await this.isEventBooked(userEmailId, event.start.dateTime, event.end.dateTime);
                if (isEventBooked) {
                    throw new EventAvailabilityException("Time slot is already booked.");
                }
            }
            // Insert event 
            await eventRepo.updateOrCreateEvent(event, publisherEmail);
            return {
                "success" : true,
                "message" : "Event Booked Successfully"
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Is User request for the same already.
     * 
     * @param {*} userEmailId 
     * @param {*} startDateTime 
     * @param {*} endDateTime 
     */
    async isEventBooked(userEmailId, startDateTime, endDateTime) {
        const eventRepo = new EventRepo();
        const event = await eventRepo.getUserEvent(userEmailId, startDateTime, endDateTime);
        return event != null ? true : false;
    }

    /**
     * Returns start and end time and weekday.
     * 
     * @param {*} startDateTime 
     * @param {*} endDateTime 
     * @returns {Object} {"start_time","end_time","week_day"}
     */
    getWeekDayAndTime(startDateTime, endDateTime) {
        try {
            const weekDays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
            const startDate = new Date(startDateTime);
            const endDate = new Date(endDateTime);
            const startTime = startDate.getHours() + ":" + startDate.getMinutes();
            const endTime = endDate.getHours() + ":" + endDate.getMinutes();
            const weekDay = weekDays[startDate.getDay()];
            return {
                "start_time": startTime,
                "end_time": endTime,
                "week_day": weekDay
            }
        } catch (error) {
            throw error;
        }
    }

    async saveEvent(user) {
        try {
            const auth = new google.auth.OAuth2();
            auth.setCredentials({
                access_token: user.accessToken
            });
            const eventRepoObj = new EventRepo();
            const events = await eventRepoObj.getNewEventOfUser(user.email);
            if (Array.isArray(events) && events.length == 0) {
                return;
            }
            // Insert into google event.
            const calendar = google.calendar({ version: "v3", auth });
            const existingEvents = await this.getCalendarEvents(auth);
            await Promise.all(events.map(async event => {
                // convert time into ytc
                const isDuplicate = await this.isDuplicateEvent(existingEvents, event);
                if (!isDuplicate) {
                    await calendar.events.insert({
                        auth: auth,
                        calendarId: "primary",
                        resource: event,
                    });
                    await eventRepoObj.updateEventStatus(user.email);
                }
            })).catch((error) => {
                throw error;
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * This method check if coming event already exist in google calendar of user.
     * 
     * @param {*} existingEvents 
     * @param {*} event 
     * @returns {Boolean}
     */
    async isDuplicateEvent(existingEvents, event) {
        try {
            let isDuplicate = false;
            if (existingEvents.length != 0) {
                const eventStartTime = this.converToIsoString(event.start.dateTime);
                const eventEndTime = this.converToIsoString(event.end.dateTime);
                console.log(eventStartTime + "  " + eventEndTime);
                for (let i = 0; i < existingEvents.length; i++) {
                    if ((this.converToIsoString(existingEvents[i].start.dateTime) <= eventStartTime
                        && eventStartTime <= this.converToIsoString(existingEvents[i].end.dateTime))
                        || (this.converToIsoString(existingEvents[i].end.dateTime) >= eventEndTime
                            && eventEndTime >= this.converToIsoString(existingEvents[i].start.dateTime))) {
                        isDuplicate = true;
                        break;
                    }
                }
            }
            return isDuplicate;
        } catch (error) {
            throw error;
        }
    }

    converToIsoString(dateTime) {
        return new Date(new Date(dateTime).toISOString()).getTime();
    }
}

module.exports = Calendar;