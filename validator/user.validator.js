const BaseValidator = require("./baseValidator");
const SchemaValidator = require("jsonschema").Validator;

const UserSchema = require("../model/schema/user.schema");

class UserValidator extends BaseValidator {

	/**
	 * Function validate incoming request data for user availability details against appropriate schema.
	 *
	 * @param {*} data Request body data
	 */
    validateUserAvailability(data) {
		try {
			const schemaValidator = new SchemaValidator();
			super.prepareValidationErrorObj(schemaValidator.validate(data, UserSchema.UserAvailablitySchema));
		} catch (error) {
			throw error;
		}
	}
}

module.exports = UserValidator;