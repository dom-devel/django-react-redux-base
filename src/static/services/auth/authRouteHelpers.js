// export default function privateRouteHOC(WrappedComponent) {
// 	// ...and returns another component...
// 	return class extends React.Component {
// 		static propTypes = {
// 			isAuthenticated: PropTypes.boolean,
// 			redirect: PropTypes.func.isRequired
// 		};
// 		render() {
// 			return auth.loggedIn === true ? (
// 				<WrappedComponent />
// 			) : (
// 				<Redirect to={urls.AUTH_LOGIN} />
// 			);
// 		}
// 	};

// 	const mapStateToProps = state => {
// 		return {
// 			isAuthenticated: state.auth.isAuthenticated
// 		};
// 	};
// }
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { push } from "connected-react-router";

export default function privateRouteHOC(ComposedComponent) {
	class Authenticate extends React.Component {
		static propTypes = {
			loggedIn: PropTypes.bool.isRequired,
			redirect: PropTypes.func.isRequired,
			actions: PropTypes.shape({
				redirect: PropTypes.func.isRequired
			}).isRequired
		};

		componentDidMount() {
			this.checkAndRedirect();
		}

		componentDidUpdate() {
			this.checkAndRedirect();
		}

		checkAndRedirect() {
			const { loggedIn } = this.props;

			if (!loggedIn) {
				this.props.actions.redirect();
			}
		}

		render() {
			console.log(this.props);
			return (
				<div>
					{this.props.loggedIn ? (
						<ComposedComponent {...this.props} />
					) : null}
				</div>
			);
		}
	}

	const mapStateToProps = state => {
		return {
			loggedIn: state.auth.loggedIn
		};
	};

	const mapDispatchToProps = dispatch => {
		return {
			actions: bindActionCreators(
				{
					redirect: () => push("/login/")
				},
				dispatch
			)
		};
	};

	// Authenticate.propTypes = propTypes;

	// Authenticate.propTypes = propTypes;

	return connect(
		mapStateToProps,
		mapDispatchToProps
	)(Authenticate);
}
