const BaseException = require("./base.exception");

class UnauthenticatedException extends BaseException {

    constructor(message) {
        super(message, "AUTH_ERR");
    }
}

module.exports = UnauthenticatedException;