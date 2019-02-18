import React from "react";
import { Route, Switch } from "react-router";
import {
	HomeView,
	LoginView,
	RestrictedView,
	ProtectedView,
	NotFoundView
} from "./scenes";
import requireAuthentication from "./utils/requireAuthentication";

export default (
	<Switch>
		<Route exact path="/" component={HomeView} />
		<Route path="/login" component={LoginView} />
		<Route path="/restricted" component={RestrictedView} />
		<Route
			path="/protected"
			component={requireAuthentication(ProtectedView)}
		/>
		<Route path="*" component={NotFoundView} />
	</Switch>
);
