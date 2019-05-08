import {
	CLEAR_MESSAGE,
	SET_MESSAGE,
	SENDING_REQUEST,
	REQUEST_ERROR
} from "services/generalStatus/generalStatusConstants";

/**
 * Sets the `error` state as empty
 */
export function clearMessages() {
	return { type: CLEAR_MESSAGE };
}

/**
 * Tells the app we want to set a message
 * @param  {object} statusText.message        	The statusText we're sending to the form.
 * @param  {object} statusText.statusLevel      What error level is the problem.
 */
export function setMessage(statusText) {
	return { type: SET_MESSAGE, statusText };
}

/**
 * Sets the `currentlySending` state, which displays a loading indicator during requests
 * @param  {boolean} sending True means we're sending a request, false means we're not
 */
export function sendingRequest(sending) {
	return { type: SENDING_REQUEST, sending };
}

/**
 * Sets the `error` state to the error received
 * @param  {object} statusText The error we got when trying to make the request
 */
export function requestError() {
	return { type: REQUEST_ERROR };
}
