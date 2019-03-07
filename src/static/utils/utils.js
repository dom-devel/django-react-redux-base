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
