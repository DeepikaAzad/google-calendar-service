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

/**
 * This is a unique key generation function.
 * @param length unique id length.
 */
exports.uniqid = function (length) {
	if (!length) length = 13;
	const ts = Math.round((new Date()).getTime() / 1000);
	// the below line generates 11 chars random string.
	let code = ts.toString(16).substring(0, 8);

	if (length <= code.length) {
		return code.substring(code.length - length);
	}

	const extraLength = length - code.length;
	// generating random two chars.
	const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < extraLength; i++) {
		code += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return code;
}