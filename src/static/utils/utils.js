const queryString = require("query-string");

export function checkHttpStatus(response) {
	/* Check if  the status code is a 2xx. Otherwise
	throw an error.
	*/
	if (response.status >= 200 && response.status < 300) {
		return response;
	}

	const error = new Error(response.statusText);
	error.response = response;
	throw error;
}

/**
 *  Used to take errors from a form and convert them into a
 *  paragraph for printing to the user for validation.
 *
 * Currently does nothing with the labels of the object.
 *
 * @param  {[object]}           A JS object.
 * @return {[string]}       	A string.
 */
export function convertFormValidationToParagraph(feedbackObject) {
	let outputString = "";
	const entries = Object.entries(feedbackObject);

	entries.forEach(errorArray => {
		const fieldTitle = errorArray[0];
		const errorList = errorArray[1].join("<br />");
		outputString += `${fieldTitle}: ${errorList}<br />`;
	});
	return outputString;
}

export function parseJSON(response) {
	return response.json();
}
/**
 * This function takes a query string and extracts the next
 * place to redirect to. It defaults to home.
 *
 * @param  {[string]} 			querystring -- A query string
 * @return {[string]}       	The contents of the parameter "next" or default
 *                              value of "/"
 */
export function extractRedirectOrDefault(querystring) {
	let redirectTo = "/";

	if (querystring) {
		const parsedQuery = queryString.parse(querystring);
		const next = parsedQuery.next;
		redirectTo = next ? next[1] : "/";
	}

	return redirectTo;
}

/**
 * This function takes an object and checks if
 * it is empty.
 * @param  {[type]} obj    Takes any object
 * @return {[boolean]}     Returns true if the object is {}
 */
export function isEmptyObject(obj) {
	return (
		Object.getOwnPropertyNames(obj).length === 0 &&
		Object.getOwnPropertySymbols(obj).length === 0 &&
		Object.getPrototypeOf(obj) === Object.prototype
	);
}
