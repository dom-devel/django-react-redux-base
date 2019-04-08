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
import Navbar from "components/Navbar/Navbar";

/**
 * General note on testing components here. We could at this point
 * test with our without the store. We could also test with a mock
 * store or using our actual store. I've documented all options here.
 *
 * The choice is yours. I think I prefer the sligtly more intergration
 * approach of using store.
 */

/**
 * Option 1: Create the actual store to test from.
 */

import history from "utils/history";
import configureStore from "store/configureStore";

let store;
beforeEach(() => {
	const initialState = {};

	// Create the store
	store = configureStore(initialState, history);
});

/**
 * Option 2: Mock a redux store.
 */

// Import mock for store
// import configureStore from "redux-mock-store";

// let mockStore
// beforeEach(() => {
// 	const middlewares = [];
// 	mockStore = configureStore(middlewares);
// 	store = mockStore({ auth: { loggedIn: false }, router: { location: "/" } });
// });

/**
 * On with the actual tests.
 */

// automatically unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

test("Check that home link exists", async () => {
	// Render navbar
	const { getByText } = render(
		<Provider store={store}>
			<Navbar />
		</Provider>
	);

	// Act
	await waitForElement(() => getByText(/Home/i));
});
