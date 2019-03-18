/**
 * Create the store with dynamic reducers
 */

import { createStore, applyMiddleware, compose } from "redux";
import { routerMiddleware } from "connected-react-router";
import createSagaMiddleware from "redux-saga";
import createReducer from "store/reducer";

// Local imports
// import authReducer from "services/auth/authReducer";
import authSaga from "services/auth/authSaga";
// import dataReducer from "services/data/reducer";

// console.log(authSaga);

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState = {}, history) {
	// Create the store with two middlewares
	// 1. sagaMiddleware: Makes redux-sagas work
	// 2. routerMiddleware: Syncs the location/URL path to the state
	const middlewares = [sagaMiddleware, routerMiddleware(history)];

	const enhancers = [applyMiddleware(...middlewares)];

	// If Redux DevTools Extension is installed use it, otherwise use Redux compose
	/* eslint-disable no-underscore-dangle, indent */
	const composeEnhancers =
		process.env.NODE_ENV !== "production" &&
		typeof window === "object" &&
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
			? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
			: compose;
	/* eslint-enable */

	const store = createStore(
		// Reducers are all inserted in the primary reducer file
		createReducer(),
		initialState,
		composeEnhancers(...enhancers)
	);
	// Extensions
	store.runSaga = sagaMiddleware.run(authSaga);

	// NBED: Dynamically injecting the reducers and sagas
	// in order to make them hot reloadable, was failing
	// miserably. Unsure why.

	// store.injectedReducers = {
	// 	auth: authReducer
	// 	data: dataReducer
	// }; // Reducer registry
	// store.injectedSagas = {
	// 	authSaga
	// }; // Saga registry

	// Make reducers hot reloadable, see http://mxs.is/googmo
	/* istanbul ignore next */
	if (module.hot) {
		module.hot.accept("./reducers", () => {
			store.replaceReducer(createReducer(store.injectedReducers));
		});
	}

	return store;
}
