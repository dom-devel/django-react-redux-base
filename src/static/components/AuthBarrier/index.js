import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { push } from "connected-react-router";

const accessDenied = {};

/**
 * This is a higher order component which will throw an access
 * denied error if the user isn't logged in.
 *
 * This function takes a react compenent and returns a function
 * that takes
 * */

const EnsureAuthenticatedConnector = ComposedComponent => props => {
	if (!props.isAuthenticated) {
		// This fires twice only when you throw an
		// error. perhaps its to do with the nested
		// arrow function?
		console.log("This console fires twice");
		throw accessDenied;
	}
	return <ComposedComponent {...props} />;
};

EnsureAuthenticatedConnector.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired
};

// We connect our function to the store, because it needs
// to pull auth from there.
const mapStateToPropsEnsureAuth = state => {
	return {
		isAuthenticated: state.auth.isAuthenticated
	};
};

/**
 * This component will catch any access denied errors inside
 * it and redirect the user to the login page.
 *
 * https://github.com/reactjs/reactjs.org/issues/960
 */

class AuthBarrier extends Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		children: PropTypes.node.isRequired
	};

	constructor(props) {
		super(props);
		this.state = {
			hasError: false
		};
	}

	componentDidCatch(error) {
		if (error === accessDenied) {
			// Why on earth does adding this line in
			// make the app work?
			this.setState({ hasError: true });
			this.props.dispatch(push("/login"));
			// this.props.history.replace("/login");
		}
	}
	render() {
		// We do nothing clever if a non-authentication
		// error is thrown, just render the children.
		return this.props.children;
	}
}

/**
 * Solution source:
 *
 * https://medium.com/practo-engineering/connected-higher-order-component-hoc-93ee63c91526
 * Both connect & EnsureAuthenticatedConnector are expecting a
 * a react component, but while we'll pass a component into our HOC
 * we pass a function to connect.
 *
 * Compose runs bottom (right) to top (left) and takes the output of one
 * and shunts it into the next. Each function can only have one
 * input/output except the bottom one, so we take in a wrapped component, then
 * return another wrapped component to connect.
 *
 * Because both my HOC & connect are expecting react components. Both
 * output components, but are actually functions so we need one to run and pass
 * the output to the next (hence using connect).
 * EnsureAuthenticatedConnector must go first, because it's the component that
 * need to be connected to the store.
 */

const connEnsureAuth = compose(
	// These are both single-argument HOCs
	connect(
		mapStateToPropsEnsureAuth,
		null
	),
	EnsureAuthenticatedConnector
);

const ConnAuthBarrier = connect()(AuthBarrier);

export { ConnAuthBarrier, connEnsureAuth };
