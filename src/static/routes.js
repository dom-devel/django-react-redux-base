import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router";
import { Redirect } from "react-router-dom";
import {
	HomeView,
	LoginView,
	RegisterView,
	RestrictedView,
	PasswordResetView,
	NotFoundView,
	FormMed,
	FormSmall
} from "scenes";
// To save on space here we
import auth from "services/auth/auth";
import * as urls from "routesConstants";
// https://tylermcginnis.com/react-router-protected-routes-authentication/
const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			auth.loggedIn === true ? (
				<Component {...props} />
			) : (
				<Redirect to={urls.AUTH_LOGIN} />
			)
		}
	/>
);

PrivateRoute.propTypes = {
	component: PropTypes.node.isRequired
};

export default (
	<Switch>
		<Route exact path="/" component={HomeView} />
		{/*
			User auth URLs
		*/}
		<FormSmall path={urls.AUTH_LOGIN} component={LoginView} />
		<FormSmall path={urls.AUTH_REGISTER} component={RegisterView} />
		<FormSmall
			path={urls.AUTH_PASSWORD_RESET}
			component={PasswordResetView}
		/>
		{/*
			Other pages
		*/}
		<PrivateRoute
			path={urls.EXAMPLE_RESTRICTED}
			component={RestrictedView}
		/>
		<Route path="*" component={NotFoundView} />
	</Switch>
);
