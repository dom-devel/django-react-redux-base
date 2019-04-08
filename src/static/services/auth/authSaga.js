// This file contains the sagas used for async actions in our app. It's divided into
// "effects" that the sagas call (`authorize` and `logout`) and the actual sagas themselves,
// which listen for actions.

// Sagas help us gather all our side effects (network requests in this case) in one place

// Redux imports
import { push } from "connected-react-router";
import { take, call, put, fork, race } from "redux-saga/effects";

// Local imports
import auth from "services/auth/auth";
import catchInvalidToken from "utils/saga";

import {
	SENDING_REQUEST,
	LOGIN_REQUEST,
	REGISTER_REQUEST,
	IS_USER_LOGGED_IN,
	LOGOUT,
	CHANGE_FORM,
	REQUEST_ERROR
} from "services/auth/authConstants";

/**
 * Log in saga
 */
export function* loginFlow() {
	// Because sagas are generators, doing `while (true)` doesn't block our program
	// Basically here we say "this saga is always listening for actions"
	while (true) {
		// And we're listening for `LOGIN_REQUEST` actions and destructuring its payload
		const request = yield take(LOGIN_REQUEST);
		const { email, password, redirectTo } = request.data;

		// A `LOGOUT` action may happen while the `authorize` effect is going on, which may
		// lead to a race condition. This is unlikely, but just in case, we call `race` which
		// returns the "winner", i.e. the one that finished first
		const winner = yield race({
			auth: call(authorize, { email, password, isRegistering: false }),
			logout: take(LOGOUT)
		});

		// If `authorize` was the winner...
		if (winner.auth) {
			// ...we send Redux appropriate actions
			yield put({ type: IS_USER_LOGGED_IN, newAuthState: true }); // User is logged in (authorized)
			yield put({
				type: CHANGE_FORM,
				newFormState: { email: "", password: "" }
			}); // Clear form

			// Send new URL to react router
			yield put(push(redirectTo)); // Go to Home page
		}
		// 	else if (winner.logout) {
		// 	// console.log("sdsd");
		// }
	}
}

/**
 * Register saga
 * Very similar to log in saga!
 */
export function* registerFlow() {
	while (true) {
		// We always listen to `REGISTER_REQUEST` actions
		const request = yield take(REGISTER_REQUEST);

		const { firstName, lastName, email, password } = request.data;

		// We call the `authorize` task with the data, telling it that we are registering a user
		// This returns `true` if the registering was successful, `false` if not
		const wasSuccessful = yield call(authorize, {
			email,
			password,
			isRegistering: true,
			firstName,
			lastName
		});

		// If we could register a user, we send the appropriate actions
		if (wasSuccessful) {
			yield put({ type: IS_USER_LOGGED_IN, newAuthState: true }); // User is logged in (authorized) after being registered
			yield put({
				type: CHANGE_FORM,
				newFormState: { username: "", password: "" }
			}); // Clear form

			yield put(push("/"));
		}
	}
}

/**
 * Log out saga
 * This is basically the same as the `if (winner.logout)` of above, just written
 * as a saga that is always listening to `LOGOUT` actions
 */
export function* logoutFlow() {
	while (true) {
		yield take(LOGOUT);
		yield put({ type: SENDING_REQUEST, sending: true });

		// We're sending a request so it has to be exception wrapped
		try {
			yield call(auth.logout);
			yield put({ type: IS_USER_LOGGED_IN, newAuthState: false });
			yield put(push("/"));
		} catch (error) {
			// This block checks if token has expired when making
			// a request that needs authentication
			const tokenInvalid = yield call(isTokenInvalid, error.response);
			if (tokenInvalid) {
				yield call(redirectToHomeWithMessage);
			} else {
				yield put({
					type: REQUEST_ERROR,
					statusText: error.response.data
				});
			}
		} finally {
			yield put({ type: SENDING_REQUEST, sending: false });
		}
	}
}

/**
 * This is a saga which will catch failed requests with an invalid
 * token. If an 401 with invalid token message is thrown the user
 * will be automatically logged out with a message explaining
 * what happened.
 *
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
function* isTokenInvalid(response) {
	let tokenValid = false;
	if ("non_field_errors" in response.data) {
		if (
			response.data.non_field_errors.some(message =>
				message.match(/invalid token/gi)
			)
		) {
			yield call(auth.deleteInvalidToken);
			yield put({ type: IS_USER_LOGGED_IN, newAuthState: false });
			tokenValid = true;
		}
	}

	return tokenValid;
}

/**
 * Sets a message for the user that they've been logged out
 * and redirects to the home page.
 * @yield {[type]} [description]
 */
function* redirectToHomeWithMessage() {
	yield put(push("/"));
	yield put({
		type: REQUEST_ERROR,
		statusText: {
			non_field_errors: ["Your login has expired. Please sign back in."]
		}
	});
}

/**
 * Effect to handle authorization
 * @param  {string} username               The username of the user
 * @param  {string} password               The password of the user
 * @param  {object} options                Options
 * @param  {boolean} options.isRegistering Is this a register request?
 */
export function* authorize({
	email,
	password,
	isRegistering,
	firstName,
	lastName
}) {
	// We send an action that tells Redux we're sending a request
	yield put({ type: SENDING_REQUEST, sending: true });

	// We then try to register or log in the user, depending on the request
	try {
		let response;

		// For either log in or registering, we call the proper function in the `auth`
		// module, which is asynchronous. Because we're using generators, we can work
		// as if it's synchronous because we pause execution until the call is done
		// with `yield`!
		if (isRegistering) {
			response = yield call(
				auth.register,
				email,
				password,
				firstName,
				lastName
			);
		} else {
			response = yield call(auth.login, email, password);
		}

		return response;
	} catch (error) {
		// If we get an error we send Redux the appropriate action and return
		yield put({
			type: REQUEST_ERROR,
			statusText: error.response.data
		});

		return false;
	} finally {
		// When done, we tell Redux we're not in the middle of a request any more
		yield put({ type: SENDING_REQUEST, sending: false });
	}
}

// The root saga is what we actually send to Redux's middleware. In here we fork
// each saga so that they are all "active" and listening.
// Sagas are fired once at the start of an app and can be thought of as processes running
// in the background, watching actions dispatched to the store.
export default function* root() {
	yield fork(loginFlow);
	yield fork(logoutFlow);
	yield fork(registerFlow);
}
