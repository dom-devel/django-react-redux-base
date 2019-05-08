import {
	SET_MESSAGE,
	CLEAR_MESSAGE
} from "services/generalStatus/generalStatusConstants";

// The initial application state
const initialState = {
	statusText: [],
	sendingRequest: false,
	isLoading: true
};

// Takes care of changing the application state
function reducer(state = initialState, action) {
	let newMessage;
	switch (action.type) {
		case SET_MESSAGE:
			newMessage = state.statusText.concat({
				message: action.statusText.message,
				statusLevel: action.statusText.statusLevel
			});
			return {
				...state,
				statusText: newMessage
			};
		case CLEAR_MESSAGE:
			return { ...state, statusText: [] };
		default:
			return state;
	}
}

export default reducer;
