import React from "react";
import { Provider } from "react-redux";
import "jest-dom/extend-expect";

// Import react testing library helpers
import {
	render,
	cleanup,
	fireEvent,
	waitForElement
} from "react-testing-library";

/**
 * We're going to create a clean store to test from.
 */

import history from "utils/history";
import configureStore from "store/configureStore";
import LoginView from "scenes/UserScenes/Login/Login";

let store;
beforeEach(() => {
	const initialState = {};

	// Create the store
	store = configureStore(initialState, history);
});

afterEach(cleanup);

test("Check the form exists", () => {
	// Render navbar
	const { getByTestId } = render(
		<Provider store={store}>
			<LoginView />
		</Provider>
	);

	expect(getByTestId(/loginForm/i)).toBeTruthy();
});

test("Check form has the correct fields", () => {
	// Render navbar
	const { getByPlaceholderText, getByLabelText } = render(
		<Provider store={store}>
			<LoginView />
		</Provider>
	);

	expect(getByPlaceholderText(/email/i)).toBeTruthy();
	expect(getByPlaceholderText(/password/i)).toBeTruthy();
});

test("Submit empty login form and get validation errors", async () => {
	// Render navbar
	const { getByTestId, getByText } = render(
		<Provider store={store}>
			<LoginView />
		</Provider>
	);

	// Wait for the form to load
	await waitForElement(() => getByTestId(/loginForm/i));

	// Submit the form
	fireEvent.click(getByText(/Submit/i));

	// Wait for form submit to fire and render
	await waitForElement(() => getByText(/Password is required/i));

	// Check messages exist.
	expect(getByText(/Email is required/i)).toBeTruthy();
});

test("Submit full login form and check handler is fired.", async () => {
	// Get the helprs we want from render
	const { getByTestId, getByText, getByPlaceholderText } = render(
		<Provider store={store}>
			<LoginView />
		</Provider>
	);

	// Wait for the form to load
	await waitForElement(() => getByTestId(/loginForm/i));

	// Set form values
	// https://github.com/testing-library/react-testing-library/pull/120
	const email = getByPlaceholderText(/email/i);
	const password = getByPlaceholderText(/password/i);

	// // https://github.com/testing-library/react-testing-library/issues/263
	fireEvent.change(email, { target: { value: "testexample.com" } });
	fireEvent.change(password, { target: { value: "password" } });

	// Submit the form
	fireEvent.click(getByText(/Submit/i));

	// Check missing field message exists
	await waitForElement(() =>
		getByText(/there are problems with our server/i)
	);
	// await waitForElement(() => getByText(/Email is required/i));
});
