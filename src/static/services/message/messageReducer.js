import { SET_MESSAGE, CLEAR_MESSAGE } from "services/message/messageConstants";

// The initial application state
const initialState = {
	statusText: []
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
			// if (Array.isArray(action.statusText)) {
			// 	newMessage = state.statusText.concat(action.statusText);
			// } else {
			// 	newMessage = state.statusText.push(action.statusText);
			// }
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
