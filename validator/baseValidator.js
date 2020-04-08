const SchemaValidationException = require("../exception/schema.exception");
const FieldError = require("../exception/validationError.exception");

const Helpers = require("../util");

class BaseValidator {

	/**
	 * Function to check if any schema validations
	 * @param validatorResult
	 */
	prepareValidationErrorObj(validatorResult) {
		try {
			if (!validatorResult.valid) {
				const errors = validatorResult.errors.map((error) => {
					let property = error.schema;
					if (typeof error.schema == "object") {
						property = error.property.replace(/instance\./, "");
					} else {
						property += "." + error.argument;
					}
					const errorSchema = error.schema;
					let errorMessage = error.message;
					if (!Helpers.isPropNullOrEmpty(errorSchema.anyOf) && Array.isArray(errorSchema.anyOf)) {
						for (let i = 0; i < errorSchema.anyOf.length; i++) {
							if (!Helpers.isPropNullOrEmpty(errorSchema.anyOf[i].enum)) {
								errorSchema.anyOf[i].type = errorSchema.anyOf[i].type + " of enum " + errorSchema.anyOf[i].enum;
							}
							errorMessage = errorMessage.replace("subschema " + i, errorSchema.anyOf[i].type || "null");
						}
					}
					return new FieldError(property, errorMessage);
				});
				throw new SchemaValidationException("Schema Validation Failed!", errors);
			}
		} catch (error) {
			throw error;
		}
	}
}

module.exports = BaseValidator;