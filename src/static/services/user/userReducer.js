import { CURRENT_USER } from "services/user/userConstants";

// The initial application state
const initialState = {
	name: "",
	email: ""
};

// Takes care of changing the application state
function reducer(state = initialState, action) {
	switch (action.type) {
		case CURRENT_USER:
			return {
				...state,
				name: action.name,
				email: action.email
			};
		default:
			return state;
	}
}

export default reducer;
