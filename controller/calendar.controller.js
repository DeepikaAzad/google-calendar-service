const { google } = require("googleapis");

const CalendarBiz = require("../biz/calendar.biz");

const Helpers = require("../util");

class CalendarController {

    register(app) {
        app.route("/events")
            .all(async (request, response, next) => {
                try {
                    if (Helpers.isObjectEmpty(request.session.user)) {
                        throw new UnauthenticatedException("Unauthenticated user.");
                    }
                    next();
                } catch (error) {
                    next(error);
                }
            })
            .get(async (request, response, next) => {
                try {
                    // get oauth2 client
                    const oauth2Client = new google.auth.OAuth2();
                    oauth2Client.setCredentials({
                        access_token: request.session.user.accessToken
                    });

                    const calendarBizObj = new CalendarBiz();
                    const calendarEventList = await calendarBizObj.getCalendarEvents(oauth2Client);
                    return response.json(calendarEventList);
                } catch (error) {
                    next(error);
                }
            })
        app.route("/:publisher/event")
            .post(async (request, response, next) => {
                try {
                    const calendarBizObj = new CalendarBiz();
                    const calendarEventList = await calendarBizObj.createEvent(request.body, request.params.publisher);
                    return response.json(calendarEventList);
                } catch (error) {
                    next(error);
                }
            });
    }
}

module.exports = CalendarController;