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
	AccountView,
	FormMed,
	FormSmall
} from "scenes";
// To save on space here we
import auth from "services/auth/auth";
import * as urls from "routesConstants";
import testPrivateRouteHOC from "services/auth/authRouteHelpers";

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

// function privateRouteHOC(WrappedComponent) {
// 	// ...and returns another component...
// 	return class extends React.Component {
// 		render() {
// 			return auth.loggedIn === true ? (
// 				<WrappedComponent />
// 			) : (
// 				<Redirect to={urls.AUTH_LOGIN} />
// 			);
// 		}
// 	};
// }

// PrivateRoute.propTypes = {
// 	component: PropTypes.func.isRequired
// };

/*
 * Layout information from: https://simonsmith.io/reusing-layouts-in-react-router-4
 */
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
		<Route
			path={urls.EXAMPLE_RESTRICTED}
			component={testPrivateRouteHOC(RestrictedView, true)}
		/>
		<Route
			path={urls.ACCOUNT}
			component={testPrivateRouteHOC(AccountView, true)}
		/>
		<Route path="*" component={NotFoundView} />
	</Switch>
);
