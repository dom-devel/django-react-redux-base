// Import utils
import axios from "axios";

// Import local
import { SERVER_URL } from "utils/config";
import * as urls from "routesConstants";

let localStorage;

// If we're testing, use a local storage polyfill
if (global.process && process.env.NODE_ENV === "test") {
    localStorage = require("localStorage");
} else {
    // If not, use the browser one
    localStorage = global.window.localStorage;
}

const auth = {
    /**
     * Logs a user in, returning a promise with `true` when done
     *
     * All error catching happens at saga level.
     *
     * @param  {string} email The email of the user
     * @param  {string} password The password of the user
     */
    login(email, password) {
        if (auth.loggedIn()) return Promise.resolve(true);
        // const credentials = btoa(`${email}:${password}`);
        // Request to login
        return axios({
            method: "post",
            url: `${SERVER_URL}${urls.AUTH_LOGIN_API}`,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            data: {
                email,
                password
            }
        }).then(response => {
            // Save token to local storage
            if (response.data.auth_token) {
                localStorage.auth_token = response.data.auth_token;
            } else {
                throw "Local token wasn't returned";
            }
            //  NBED
            //  non_field_errors - somehow put this into the storage.
            return Promise.resolve(true);
        });
    },

    /**
     * Logs the current user out
     *
     * All error catching happens at saga level.
     */
    logout() {
        // If someon visits logout without a token, resolve true
        if (!auth.loggedIn()) return Promise.resolve(true);

        const authToken = localStorage.auth_token;
        // Send request to django and delete local token
        return axios({
            method: "post",
            url: `${SERVER_URL}${urls.AUTH_LOGOUT_API}`,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Token ${authToken}`
            }
        }).then(() => {
            // Delete it locally
            localStorage.removeItem("auth_token");
            return Promise.resolve(true);
        });
    },

    /**
     * Remove local token if invalid.
     */
    deleteInvalidToken() {
        localStorage.removeItem("auth_token");
    },

    /**
     * Checks if a user is logged in
     */
    loggedIn() {
        return !!localStorage.auth_token;
    },
    /**
     * Registers a user and then logs them in
     *
     * All error catching happens at saga level.
     *
     * @param  {string} username The username of the user
     * @param  {string} password The password of the user
     */
    register(email, password, name) {
        if (auth.loggedIn()) return Promise.resolve(true);

        return axios({
            method: "post",
            url: `${SERVER_URL}${urls.AUTH_REGISTER_API}`,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            data: {
                email,
                password,
                name
            }
        }).then(() => auth.login(email, password));
    }
};

export default auth;
