const { google } = require('googleapis');

class Calendar {

    async getCalendarEvents(auth) {
        try {
            const calendar = google.calendar({ version: 'v3', auth });
            const calendarResponse = await calendar.events.list({
                calendarId: 'primary',
                timeMin: (new Date()).toISOString(),
                maxResults: 10,
                singleEvents: true,
                orderBy: 'startTime'
            });
            const events = calendarResponse.data.items;
            return events;
        } catch (error) {
            throw error;
        }
    }

    async createEvent(auth, event) {
        try {
            const calendar = google.calendar({ version: 'v3', auth });
            await calendar.events.insert({
                auth: auth,
                calendarId: "primary",
                resource: event,
            }, function (err, event) {
                if (err) {
                    console.log("There was an error contacting the Calendar service: " + err);
                    return;
                }
                console.log("Event created: %s", event.htmlLink);
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Calendar;