import {
	CHANGE_FORM,
	IS_USER_LOGGED_IN,
	SENDING_REQUEST,
	REQUEST_ERROR
} from "services/auth/authConstants";

import auth from "services/auth/auth";

// The initial application state
const initialState = {
	userName: "",
	token: "",
	sendingRequest: false,
	loggedIn: auth.loggedIn()
};

// Takes care of changing the application state
function reducer(state = initialState, action) {
	switch (action.type) {
		case CHANGE_FORM:
			return { ...state, formState: action.newFormState };
		case IS_USER_LOGGED_IN:
			return { ...state, loggedIn: action.newAuthState };
		case SENDING_REQUEST:
			return { ...state, sendingRequest: action.sending };
		case REQUEST_ERROR:
			return {
				...state,
				sendingRequest: false
			};
		default:
			return state;
	}
}

export default reducer;
