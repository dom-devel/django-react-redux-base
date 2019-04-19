import React from "react";
import { Provider } from "react-redux";

// Import react testing library helpers
import {
	render,
	// fireEvent,
	cleanup,
	waitForElement
} from "react-testing-library";

// Import the navbar component
import Restricted from "scenes/Restricted/Restricted";

import history from "utils/history";
import configureStore from "store/configureStore";

let store;
beforeEach(() => {
	const initialState = {};

	// Create the store
	store = configureStore(initialState, history);
});

// automatically unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

test("Check that restricted page redirects to login for unlogged in.", async () => {
	// Render navbar
	const { getByText } = render(
		<Provider store={store}>
			<Restricted />
		</Provider>
	);

	// Act
	await waitForElement(() => getByText(/Login/i));
});
