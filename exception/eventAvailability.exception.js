const BaseException = require("./base.exception");

class EventAvailabilityException extends BaseException {
	constructor(message) {
		super(message, "BAD_REQUEST");
		this.error = message;
	}
}

module.exports = EventAvailabilityException;