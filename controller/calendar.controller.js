const { google } = require('googleapis');

const CalendarBiz = require("../biz/calendar.biz");

const Helpers = require("../util");

class CalendarController {

    register(app) {
        app.route("/events")
            .all(async (request, response, next) => {
                if (!Helpers.isObjectEmpty(request.session.user)) {
                    // get oauth2 client
                    const oauth2Client = new google.auth.OAuth2();
                    oauth2Client.setCredentials({
                        access_token: request.session.user.accessToken
                    });
                    request.oauth = oauth2Client;
                    next();
                } else {
                    response.redirect('/auth/login')
                }
            })
            .get(async (request, response, next) => {
                try {
                    const calendarBizObj = new CalendarBiz();
                    const calendarEventList = await calendarBizObj.getCalendarEvents(request.oauth);
                    return response.json(calendarEventList);
                } catch (error) {
                    next(error);
                }
            })
            .post(async (request, response, next) => {
                try {
                    const calendarBizObj = new CalendarBiz();
                    const calendarEventList = await calendarBizObj.createEvent(request.oauth,request.body);
                    return response.json(calendarEventList);
                } catch (error) {
                    next(error);
                }
            });
    }
}

module.exports = CalendarController;