/**
 * Function to check and return if the propery is undefined or empty.
 * @param propertyValue Property
 */
exports.isPropNullOrEmpty = function isPropNullOrEmpty(propertyValue) {
	try {
		if (propertyValue == undefined || propertyValue == "") {
			return true;
		}
		return false;
	} catch (error) {
		throw error;
	}
}

/**
 * Checks if given object is empty.
 * @param obj
 */
exports.isObjectEmpty = function isObjectEmpty(obj) {
	try {
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				return false;
			}
		}
		return true;
	} catch (error) {
		throw error;
	}
}