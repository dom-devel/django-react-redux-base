import {
	SENDING_REQUEST,
	LOGIN_REQUEST,
	REGISTER_REQUEST,
	IS_USER_LOGGED_IN,
	LOGOUT,
	CHANGE_FORM,
	CLEAR_ERROR,
	REQUEST_ERROR
} from "services/auth/authConstants";

/**
 * Sets the form state
 * @param  {object} newFormState          The new state of the form
 * @param  {string} newFormState.username The new text of the username input field of the form
 * @param  {string} newFormState.password The new text of the password input field of the form
 */
export function changeForm(newFormState) {
	return { type: CHANGE_FORM, newFormState };
}

/**
 * Sets the authentication state of the application
 * @param  {boolean} newAuthState True means a user is logged in,
 *                                false means no user is logged in
 */
export function setAuthState(newAuthState) {
	return { type: IS_USER_LOGGED_IN, newAuthState };
}

/**
 * Sets the `currentlySending` state, which displays a loading indicator during requests
 * @param  {boolean} sending True means we're sending a request, false means we're not
 */
export function sendingRequest(sending) {
	return { type: SENDING_REQUEST, sending };
}

/**
 * Tells the app we want to log in a user
 * @param  {object} data          The data we're sending for log in
 * @param  {string} data.email The username of the user to log in
 * @param  {string} data.password The password of the user to log in
 * @param  {string} data.redirectTo The location to redirect after submitting the form
 */
export function loginRequest(data) {
	return { type: LOGIN_REQUEST, data };
}

/**
 * Tells the app we want to log out a user
 */
export function logoutRequest() {
	return { type: LOGOUT };
}

/**
 * Tells the app we want to register a user
 * @param  {object} data          	The data we're sending for registration
 * @param  {string} data.email 	  	The email of the user to register
 * @param  {string} data.password 	The password of the user to register
 * @param  {string} data.name       The name of the user to register
 * @param  {string} data.redirectTo The location to redirect after submitting the form
 */
export function registerRequest(data) {
	return { type: REGISTER_REQUEST, data };
}

/**
 * Sets the `error` state to the error received
 * @param  {object} statusText The error we got when trying to make the request
 */
export function requestError() {
	// console.log("ahah");
	return { type: REQUEST_ERROR };
}
