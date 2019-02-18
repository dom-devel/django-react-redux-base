import React from "react";
import ReactDOM from "react-dom";

import history from "utils/history";
import { authLoginUserSuccess } from "services/auth";
import Root from "scenes/Root/Root";
import configureStore from "store/configureStore";

// Store begins empty
const initialState = {};

// Create the store
const store = configureStore(initialState, history);

// Create the root component. We do that separately
// because it allows us to insert react dev tools
const node = <Root store={store} history={history} />;

// Now we check if the user is logged in and update the
// store if they are. Sessions are stored in local storage.
const token = sessionStorage.getItem("token");
let user = {};
try {
	user = JSON.parse(sessionStorage.getItem("user"));
} catch (e) {
	// Failed to parse
}

if (token !== null) {
	store.dispatch(authLoginUserSuccess(token, user));
}

// Finally create the react app
const target = document.getElementById("root");
ReactDOM.render(node, target);
