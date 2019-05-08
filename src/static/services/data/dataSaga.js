// Redux imports
import { push } from "connected-react-router";
import { take, call, put } from "redux-saga/effects";

// Import local
import allActions from "services/allActions";
import * as dataConstants from "services/data/dataConstants";
import backendJSONDataRequest from "services/data/data";

/**
 * Data request saga
 *
 */
export default function* dataRequestFlow() {
	// Because sagas are generators, doing `while (true)` doesn't block our program
	// Basically here we say "this saga is always listening for actions"
	while (true) {
		// And we're listening for `LOGIN_REQUEST` actions and destructuring its payload
		const request = yield take(dataConstants.DATA_REQUEST);

		const { serviceType, url, requestType, payload, output } = request.data;

		yield put(allActions[serviceType].sendingRequest(true));

		// Lets make the request and handle error states
		try {
			const response = yield call(
				backendJSONDataRequest,
				url,
				requestType,
				payload
			);

			yield put(output(response.data));
		} catch (error) {
			// The only way to tell if axios has found network errors is as follows
			// https://github.com/axios/axios/issues/383
			let errorData;
			if (!error.response) {
				// network error
				errorData = {
					non_field_errors: [
						"There are problems with our server. Please try again later."
					]
				};
			} else {
				errorData = error.response.data;
			}

			// If we get an error we send Redux the appropriate action and return
			yield put(allActions[serviceType].requestError());

			yield put(
				allActions[serviceType].setMessage({
					message: errorData,
					statusLevel: "error"
				})
			);

			return false;
		} finally {
			// When done, we tell Redux we're not in the middle of a request any more
			yield put(allActions[serviceType].sendingRequest(false));
		}
	}
}
