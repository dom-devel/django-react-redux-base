/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import authReducer from "services/auth/reducer";
import dataReducer from "services/data/reducer";
import history from "utils/history";

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducers = {}) {
	const rootReducer = combineReducers({
		auth: authReducer,
		data: dataReducer,
		// Had to manually set this. Doing the clever combine
		// below meant it was failing to set
		router: connectRouter(history),
		...injectedReducers
	});

	// Wrap the root reducer and return a new root reducer with router state
	// const mergeWithRouterState = connectRouter(history);
	return rootReducer;
}
