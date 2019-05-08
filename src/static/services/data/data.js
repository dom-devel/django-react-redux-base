// Import utils
import axios from "axios";

// Import local helpers
import { SERVER_URL } from "utils/config";

let localStorage;
// NBED: Remove local storage testing polyfill into more generic tooling
// If we're testing, use a local storage polyfill
if (global.process && process.env.NODE_ENV === "test") {
	localStorage = require("localStorage");
} else {
	// If not, use the browser one
	localStorage = global.window.localStorage;
}

function backendJSONDataRequest(url, requestType, payload) {
	// We're about to use token to auth the request, if not logged in
	// this request should fail.

	const axiosConfig = {
		method: requestType,
		url: `${SERVER_URL}${url}`,
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		data: payload
	};

	// If we're logged in then send our auth token
	console.log(localStorage);
	if (localStorage.auth_token) {
		axiosConfig.headers.Authorization = `Token: ${localStorage.auth_token}`;
	}

	console.log(axiosConfig);

	// Return the axios promise (which the saga should evaluate?)
	return axios(axiosConfig);
}

export default backendJSONDataRequest;
