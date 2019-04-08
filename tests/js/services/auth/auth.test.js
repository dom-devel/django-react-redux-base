// Local imports
import auth from "services/auth/auth";
import { SERVER_URL } from "utils/config";

// Helper libs
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// Local storage polyfill
// if (global.process && process.env.NODE_ENV === "test") {
// 	localStorage = require("localStorage");
// }

describe("login function", () => {
	let mock;

	beforeEach(() => {
		mock = new MockAdapter(axios);
		localStorage.clear();
	});

	afterEach(() => {
		// We need to clear mocks to prevent
		// us from staying logged in
		mock.restore();
	});

	test("If user is already logged in, return true", () => {
		// Mock loggedin function
		// We're using spyOn because it means we can restore the
		// mock implementation later
		const authLoggedInMock = jest
			.spyOn(auth, "loggedIn")
			.mockImplementation(() => {
				return true;
			});

		// Check that we're immediately logged in
		auth.login("test@example.com", "pass").then(value => {
			expect(value).toBe(true);
		});

		// Reset jest mock
		authLoggedInMock.mockRestore();
	});

	test("Check that login successfully saves token", () => {
		// Mock loggedin function
		mock.onPost().reply(200, {
			token: "slkdjflkjoi232oi32o3inoi23n"
		});

		auth.login("test@example.com", "pass").then(value => {
			// Check promise returns true
			expect(value).toBe(true);
			// And token stored in storage
			expect(localStorage.auth_token).toBe("slkdjflkjoi232oi32o3inoi23n");
		});
	});

	// NBED -- This seems to be impossible. I want errors to bubble up to
	// saga level. That means I need to not catch them at the axios level.

	// However for some reason, the server error at this level doesn't actually
	// return anything. It doesn't even return an unresolved promise it just
	// seems to do nothing.

	// However currently my login code works and it's caught by the saga
	// try catch. I'm fucking baffled as to why.
	// test("Check that exception thrown on server error", () => {
	// 	// Mock loggedin function to throw error
	// 	mock.onPost().reply(500);
	// 	// Test that error is uncaught.
	// 	// expect(() => {
	// 	// 	auth.login("test@example.com", "pass").then(value => {
	// 	// 		console.log(value);
	// 	// 	});
	// 	// }).toThrow();

	// 	auth.login("test@example.com", "pass").then(value => {
	// 		console.log(value);
	// 	});
	// });
});
