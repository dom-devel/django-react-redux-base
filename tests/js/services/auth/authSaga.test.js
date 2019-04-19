// Local imports for testing & mocking
import {
	loginFlow,
	logoutFlow,
	__RewireAPI__ as authSagaRewire
} from "services/auth/authSaga";
import { loginRequest, logoutRequest } from "services/auth/authActions";
import {
	IS_USER_LOGGED_IN,
	LOGOUT,
	REQUEST_ERROR
} from "services/auth/authConstants";
import auth from "services/auth/auth";

// Helper libs
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// Saga testing
import SagaTester from "redux-saga-tester";

beforeEach(() => {
	jest.resetAllMocks();
});

const initialState = {
	userName: "",
	token: "",
	statusText: {},
	sendingRequest: false,
	loggedIn: false
};

describe("test login saga", () => {
	let sagaTester = null;
	let mockAxios;

	beforeEach(() => {
		// Set-up saga testing helpers
		sagaTester = new SagaTester({ initialState });
		sagaTester.start(loginFlow);

		// Set-up axios mocks
		mockAxios = new MockAdapter(axios);
		localStorage.clear();
	});

	afterEach(() => {
		// We need to clear mocks to prevent
		// us from staying logged in
		mockAxios.restore();
	});

	test("Check successful login on successful auth", async () => {
		// Use rewire to allow mocking of single function
		authSagaRewire.__Rewire__("authorize", function* mock() {
			return true;
		});

		// Our test (Actions is our standard redux action component). Start the saga with the START action
		sagaTester.dispatch(
			loginRequest({
				email: "test@example.com",
				password: "123",
				redirectTo: "/"
			})
		);

		// Wait for the logged in action
		await sagaTester.waitFor(IS_USER_LOGGED_IN);

		// console.log(sagaTester.getLatestCalledAction());
		// console.log(sagaTester.getCalledActions());
	});

	test("Hitting logout after submitting login, should log you out", () => {
		// Use rewire to allow mocking of single function
		authSagaRewire.__Rewire__(
			"authorize",
			() =>
				new Promise((resolve, reject) => {
					// Unresolved promise won't fire
				})
		);

		// Our test (Actions is our standard redux action component). Start the saga with the START action
		sagaTester.dispatch(
			loginRequest({
				email: "test@example.com",
				password: "123",
				redirectTo: "/"
			})
		);

		sagaTester.dispatch(logoutRequest());

		// Wait for the logged in action
		sagaTester.waitFor(LOGOUT);
	});

	test("Check login fails on server error", () => {
		// Mock axios so it returns a server error on login call
		mockAxios.onPost().reply(500);

		// Our test (Actions is our standard redux action component). Start the saga with the START action
		sagaTester.dispatch(
			loginRequest({
				email: "test@example.com",
				password: "123",
				redirectTo: "/"
			})
		);

		// Wait for the logged in action
		sagaTester.waitFor(REQUEST_ERROR);
	});

	test("Check login fails on failed authorisation", () => {
		// Mock axios so it returns a server error on login call
		mockAxios.onPost().reply(403);

		// Our test (Actions is our standard redux action component). Start the saga with the START action
		sagaTester.dispatch(
			loginRequest({
				email: "test@example.com",
				password: "123",
				redirectTo: "/"
			})
		);

		// Wait for the logged in action
		sagaTester.waitFor(REQUEST_ERROR);
	});
});

describe("test logout saga", () => {
	let sagaTester = null;
	let mockAxios;

	beforeEach(() => {
		// Set-up saga testing helpers
		sagaTester = new SagaTester({ initialState });
		sagaTester.start(logoutFlow);

		// Set-up axios mocks
		mockAxios = new MockAdapter(axios);
		localStorage.clear();
	});

	afterEach(() => {
		// We need to clear mocks to prevent
		// us from staying logged in
		mockAxios.restore();
	});

	test("Logout if already logged out", async () => {
		// Simlulate logged in
		const authLoggedInMock = jest
			.spyOn(auth, "loggedIn")
			.mockImplementation(() => {
				return false;
			});
		// Our test (Actions is our standard redux action component).
		// Start the saga with the START action
		sagaTester.dispatch(logoutRequest());

		// Wait for the logged in action
		const userLoginStatus = sagaTester.waitFor(IS_USER_LOGGED_IN);

		// Reset jest mock
		authLoggedInMock.mockRestore();
	});

	test("Logout successful if logged in with valid token", async () => {
		// Simlulate logged in
		const authLoggedInMock = jest
			.spyOn(auth, "loggedIn")
			.mockImplementation(() => {
				return true;
			});

		// Mock logout so it returns a 200
		mockAxios.onPost().reply(200);

		// Our test (Actions is our standard redux action component).
		// Start the saga with the START action
		sagaTester.dispatch(logoutRequest());

		// Wait for logout
		// NBED check status
		sagaTester.waitFor(IS_USER_LOGGED_IN);

		// Reset jest mock
		authLoggedInMock.mockRestore();
	});

	test("Delete token if attempting to logout with invalid token", async () => {
		// Simlulate logged in
		const authLoggedInMock = jest
			.spyOn(auth, "loggedIn")
			.mockImplementation(() => {
				return true;
			});

		localStorage.auth_token = "skj23232";

		// Mock logout so it returns a 200
		mockAxios.onPost().reply(403, { non_field_errors: ["Invalid Token."] });

		// Our test (Actions is our standard redux action component).
		// Start the saga with the START action
		sagaTester.dispatch(logoutRequest());

		// Wait for logout
		await sagaTester.waitFor("SET_MESSAGE");
		console.log(sagaTester.getCalledActions());
		// await sagaTester.waitFor(REQUEST_ERROR);

		// Check if saga has set user to logged out
		expect(sagaTester.getCalledActions()).toContainEqual(
			expect.objectContaining({
				type: IS_USER_LOGGED_IN,
				newAuthState: false
			})
		);

		// Check token was deleted.
		expect(localStorage.auth_token).toBeUndefined();

		// Reset jest mock
		authLoggedInMock.mockRestore();
	});

	test("If server fails on logout, user isn't logged out", async () => {
		// Simlulate logged in
		const authLoggedInMock = jest
			.spyOn(auth, "loggedIn")
			.mockImplementation(() => {
				return true;
			});

		// Store auth token
		localStorage.auth_token = "skj23232";

		// Mock logout so it returns a 200
		mockAxios.onPost().reply(504, { non_field_errors: ["Server fail."] });

		// Our test (Actions is our standard redux action component).
		// Start the saga with the START action
		sagaTester.dispatch(logoutRequest());

		// Wait for error then check value
		await sagaTester.waitFor(REQUEST_ERROR);

		// Check if saga contains field with server error
		expect(sagaTester.getCalledActions()).toContainEqual(
			expect.objectContaining({
				type: REQUEST_ERROR
			})
		);

		// Check it also contains set message
		expect(sagaTester.getCalledActions()).toContainEqual(
			expect.objectContaining({
				type: "SET_MESSAGE",
				statusText: {
					message: { non_field_errors: ["Server fail."] },
					statusLevel: "error"
				}
			})
		);

		// Check token wan't deleted.
		expect(localStorage.auth_token).toBe("skj23232");

		// Reset jest mock
		authLoggedInMock.mockRestore();
	});
});
