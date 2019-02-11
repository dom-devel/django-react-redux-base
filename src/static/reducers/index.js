import { combineReducers } from "redux";
import { routerReducer } from "connected-react-router";
import authReducer from "./auth";
import dataReducer from "./data";

export default combineReducers({
	auth: authReducer,
	data: dataReducer,
	router: routerReducer
});
