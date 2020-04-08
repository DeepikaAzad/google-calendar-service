const SchemaValidationException = require("../exception/schema.exception");
const ResourceNotFoundError = require("../exception/resourceNotFoundError.exception");
const EventAvailabilityException = require("../exception/eventAvailability.exception");
const DuplicateError = require("../exception/duplicateDataError.exception");

/**
 * Error Handling middleware
 */
// eslint-disable-next-line no-unused-vars
exports.errorHandler = async (error, request, response, next) => {
    try {
        if (error instanceof SchemaValidationException) {
            return response.status(400).json({
                error: {
                    code: error.code,
                    message: error.message,
                    errorFields: error.errorFields || null
                },
                success: false
            });
        } else if (error instanceof ResourceNotFoundError
            || error instanceof EventAvailabilityException
        || error instanceof DuplicateError) {
            return response.status(400).json({
                error: {
                    code: error.code,
                    message: error.message
                },
                success: false
            });
        } 

        return response.status(500).json({
            error: {
                code: "INT_SERVER_CODE",
                message: "Oops! Something went wrong",
                error: error.stack
            },
            success: false
        });
    } catch (error) {
        return response.status(500).json({
            error: {
                code: "INT_SERVER_CODE",
                message: "Oops! Something went wrong"
            },
            success: false
        });
    }
};