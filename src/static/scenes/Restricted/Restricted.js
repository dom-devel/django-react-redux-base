import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";

// Local imports
import { connEnsureAuth } from "components/AuthBarrier";

const RestrictedPage = () => {
	return (
		<div>
			<h1>This content is TOP SECRET</h1>
			<p>Also this worked</p>
		</div>
	);
};

RestrictedPage.displayName = "RestrictedPage";

// const mapStateToProps = state => {
// 	return {
// 		isAuthenticated: state.auth.isAuthenticated,
// 		isAuthenticating: state.auth.isAuthenticating,
// 		statusText: state.auth.statusText
// 	};
// };

// This WORKS
// // Stringing together HOCs
// // https://medium.com/practo-engineering/connected-higher-order-component-hoc-93ee63c91526
// const composedRestrictedPage = compose(
// 	// These are both single-argument HOCs
// 	connect(
// 		mapStateToProps,
// 		null
// 	),
// 	EnsureAuthenticatedConnector
// );

// const AuthRestrictedPage = connEnsureAuth(RestrictedPage);

export default RestrictedPage;
