const BaseException = require("./base.exception");

class SchemaValidationException extends BaseException {
	constructor(message, errors) {
		super(message, "BAD_REQUEST");
		this.error = message;
		this.errorFields = errors;
	}
}

module.exports = SchemaValidationException;