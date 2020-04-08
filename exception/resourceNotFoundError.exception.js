const BaseException = require("./base.exception");

class ResourceNotFoundError extends BaseException {

    constructor(message) {
        super(message, "RES_NOT_FND_ERR");
    }
}

module.exports = ResourceNotFoundError;