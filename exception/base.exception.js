class BaseException extends Error {
    constructor(message, code = 500) {
        if (!message) {
            message = "Oops!!! Something went wrong";
        }
        super(message);
        this.code = code;
    }
}

module.exports = BaseException;