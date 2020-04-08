const BaseValidator = require("./baseValidator");

class CollectionValidator extends BaseValidator {

	/**
	 * Function validate incoming request data for user availability details against appropriate schema.
	 *
	 * @param {*} data Request body data
	 */
    validateUserAvailability(data) {
		try {
			super.prepareValidationErrorObj(data);
		} catch (error) {
			throw error;
		}
	}
}

module.exports = CollectionValidator;