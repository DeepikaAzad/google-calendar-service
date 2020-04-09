const UserAvailabilitBiz = require("../biz/userAvailability.biz");
const UnauthenticatedException = require("../exception/unauthenticated.exception");
const Helpers = require("../util");

class UserController {

    register(app) {
        app.route("/availability")
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
                    const userAvailabilityBizObj = new UserAvailabilitBiz();
                    const userAvialiblityResponse = await userAvailabilityBizObj.getUserAvailability(request.session.user);
                    return response.json(userAvialiblityResponse);
                } catch (error) {
                    next(error);
                }
            })
            .post(async (request, response, next) => {
                try {
                    const userAvailabilityBizObj = new UserAvailabilitBiz();
                    const userAvialiblityResponse = await userAvailabilityBizObj.createUserAvailability(request.body);
                    return response.json(userAvialiblityResponse);
                } catch (error) {
                    next(error);
                }
            });
    }
}

module.exports = UserController;