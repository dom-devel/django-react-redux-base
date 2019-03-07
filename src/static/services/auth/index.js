import fetch from "isomorphic-fetch";
import { push } from "connected-react-router";
import { SERVER_URL } from "utils/config";
import { checkHttpStatus, parseJSON } from "utils/utils";
import {
    AUTH_LOGIN_USER_REQUEST,
    AUTH_LOGIN_USER_FAILURE,
    AUTH_LOGIN_USER_SUCCESS,
    AUTH_LOGOUT_USER
} from "constants";

export function authLoginUserSuccess(token, user) {
    /* This function takes a django returned user and a login
    token and stores them both into local storage. 

    Returns: A javascript object
    */
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(user));
    return {
        type: AUTH_LOGIN_USER_SUCCESS,
        payload: {
            token,
            user
        }
    };
}

export function authLoginUserFailure(error, message) {
    sessionStorage.removeItem("token");
    return {
        type: AUTH_LOGIN_USER_FAILURE,
        payload: {
            status: error,
            statusText: message
        }
    };
}

export function authLoginUserRequest() {
    return {
        type: AUTH_LOGIN_USER_REQUEST
    };
}

export function authLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    return {
        type: AUTH_LOGOUT_USER
    };
}

export function authLogoutAndRedirect() {
    return (dispatch, state) => {
        dispatch(authLogout());
        dispatch(push("/login"));
        return Promise.resolve(); // TODO: we need a promise here because of the tests, find a better way
    };
}

export function authLoginUser(email, password, redirect = "/") {
    /* This function does the actual work of authenticating. 

    It takes an email, passowrd and a redirect location to redirect to 
    after the login is complete.
    */
    return dispatch => {
        dispatch(authLoginUserRequest());
        // Encodes a string in Base64
        const auth = btoa(`${email}:${password}`);

        // Make a call to the server with the user login details
        return (
            fetch(`${SERVER_URL}/api/v1/accounts/login/`, {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Basic ${auth}`
                }
            })
                // Check if status code is a 200
                // if this fails then the login has failed
                .then(checkHttpStatus)
                .then(parseJSON)
                .then(response => {
                    dispatch(
                        authLoginUserSuccess(response.token, response.user)
                    );
                    dispatch(push(redirect));
                })
                .catch(error => {
                    if (
                        error &&
                        typeof error.response !== "undefined" &&
                        error.response.status === 401
                    ) {
                        // Invalid authentication credentials
                        return error.response.json().then(data => {
                            dispatch(
                                authLoginUserFailure(
                                    401,
                                    data.non_field_errors[0]
                                )
                            );
                        });
                    } else if (
                        error &&
                        typeof error.response !== "undefined" &&
                        error.response.status >= 500
                    ) {
                        // Server side error
                        dispatch(
                            authLoginUserFailure(
                                500,
                                "A server error occurred while sending your data!"
                            )
                        );
                    } else {
                        // Most likely connection issues
                        dispatch(
                            authLoginUserFailure(
                                "Connection Error",
                                "An error occurred while sending your data!"
                            )
                        );
                    }

                    return Promise.resolve(); // TODO: we need a promise here because of the tests, find a better way
                })
        );
    };
}
