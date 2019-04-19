import { CLEAR_MESSAGE, SET_MESSAGE } from "services/message/messageConstants";

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
