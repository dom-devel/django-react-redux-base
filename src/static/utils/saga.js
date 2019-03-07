function* workerSaga() {}

function getAPIDataSaga() {
	takeLast(DATA.GET);
}

function* makeFetchRequest(request_made_action, succeed_action, fail_action) {
	yield put({ type: request_made_action, data });
	try {
		const data = yield call(Api.fetchUser, action.payload.url);
		yield put({ type: succeed_action, data });
	} catch (error) {
		yield put({ type: fail_action, error });
	}
}

function* rootSaga() {}
