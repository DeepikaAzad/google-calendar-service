const BaseValidator = require("./baseValidator");
const SchemaValidator = require("jsonschema").Validator;

const EventSchema = require("../model/schema/event.schema");

class EventValidator extends BaseValidator {

	/**
	 * Function validate incoming request data for user availability details against appropriate schema.
	 *
	 * @param {*} data Request body data
	 */
    validateEventObj(data) {
		try {
			const schemaValidator = new SchemaValidator();
			super.prepareValidationErrorObj(schemaValidator.validate(data, EventSchema.EventJsonSchema));
		} catch (error) {
			throw error;
		}
	}
}

module.exports = EventValidator;