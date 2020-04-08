const UserAvailabilitBiz = require("../biz/user_availability.biz");

class UserController {

    register(app) {
        app.route("/availability")
            .all(async (request, response, next) => {
                // next();
                if (!Helpers.isObjectEmpty(request.session.user)) {
                    // get oauth2 client
                    const oauth2Client = new google.auth.OAuth2();
                    oauth2Client.setCredentials({
                        access_token: request.session.user.accessToken
                    });
                    request.oauth = oauth2Client;
                    next();
                } else {
                    response.redirect("/auth/login")
                }
            })
            .get(async (request, response, next) => {
                try {
                    const userBizObj = new UserBiz();
                    const userAvialiblityResponse = await userBizObj.getUserAvailability(request.session.user);
                    return response.json(userAvialiblityResponse);
                } catch (error) {
                    next(error);
                }
            })
            .post(async (request, response, next) => {
                try {
                    const userBizObj = new UserAvailabilitBiz();
                    const userAvialiblityResponse = await userBizObj.createUserAvailability(request.body);
                    return response.json(userAvialiblityResponse);
                } catch (error) {
                    next(error);
                }
            });
    }
}

module.exports = UserController;