import { fork } from "redux-saga/effects";

import * as authSaga from "services/auth/authSaga";
import dataRequestFlow from "services/data/dataSaga";

// The root saga is what we actually send to Redux's middleware. In here we fork
// each saga so that they are all "active" and listening.
// Sagas are fired once at the start of an app and can be thought of as processes running
// in the background, watching actions dispatched to the store.
export default function* root() {
	console.log(authSaga);
	console.log(authSaga.loginFlow);
	yield fork(authSaga.loginFlow);
	yield fork(authSaga.logoutFlow);
	yield fork(authSaga.registerFlow);
	yield fork(dataRequestFlow);
}
