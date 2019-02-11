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
