import { runSaga } from "redux-saga";

/**
 * https://dev.to/phil/the-best-way-to-test-redux-sagas-4hib
 *
 * [recordSaga description]
 * @param  {[type]} saga          [description]
 * @param  {[type]} initialAction [description]
 * @return {[type]}               [description]
 */
async function recordSaga(saga, initialAction) {
	const dispatched = [];

	// https://redux-saga.js.org/docs/api/#runsagaoptions-saga-args
	await runSaga(
		{
			// When a put is fired add it to a list
			// to be returned at the end
			dispatch: action => dispatched.push(action)
		},
		saga,
		initialAction
	).done;

	return dispatched;
}

export default recordSaga;
