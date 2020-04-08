const BaseException = require("./base.exception");

class DuplicateError extends BaseException {

    constructor(message) {
        super(message, "DUP_ERR");
    }
}

module.exports = DuplicateError;