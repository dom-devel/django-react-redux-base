// React imports
import React, { Component } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

// Redux imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { push } from "connected-react-router";

// Helpers
import t from "tcomb-form";

// Local helpers
import { registerRequest } from "services/auth/authActions";
import { extractRedirectOrDefault } from "utils/utils";

const Form = t.form.Form;

const Register = t.struct({
	first_name: t.String,
	last_name: t.String,
	email: t.String,
	password: t.String
});

const RegisterFormOptions = {
	auto: "placeholders",
	help: <i>Register and recieve all the things</i>,
	fields: {
		password: {
			type: "password"
		}
	}
};

class RegisterView extends Component {
	static propTypes = {
		// From mapState
		sendingRequest: PropTypes.bool.isRequired,
		statusText: PropTypes.string,
		loggedIn: PropTypes.bool.isRequired,
		// From mapDispatch
		actions: PropTypes.shape({
			registerRequest: PropTypes.func.isRequired
		}).isRequired,
		// From connect
		location: PropTypes.shape({
			search: PropTypes.string.isRequired
		})
	};

	static defaultProps = {
		statusText: "",
		location: null
	};

	constructor(props) {
		super(props);

		const redirectRoute = extractRedirectOrDefault(
			this.props.location.search
		);

		// We store the form values and the redirect location post
		// login in the state
		this.state = {
			formValues: {
				email: "",
				password: "",
				first_name: "",
				last_name: ""
			},
			redirectTo: redirectRoute
		};
	}

	// Store form values dyanmically in the state
	onFormChange = value => {
		this.setState({ formValues: value });
	};

	onFormSubmit = e => {
		e.preventDefault();
		// This is tcomb fun that gets the values from
		// the form
		const value = this.loginForm.getValue();
		if (value) {
			// Pass through as object for easier
			// unpacking later
			this.props.actions.registerRequest({
				first_name: value.first_name,
				last_name: value.last_name,
				email: value.email,
				password: value.password,
				redirectTo: this.state.redirectTo
			});
		}
	};

	render() {
		let statusText = null;
		if (this.props.statusText) {
			const statusTextClassNames = classNames({
				alert: true,
				"alert-danger":
					this.props.statusText.indexOf("Authentication Error") === 0,
				"alert-success":
					this.props.statusText.indexOf("Authentication Error") !== 0
			});

			statusText = (
				<div className="row">
					<div className="col-sm-12">
						<div className={statusTextClassNames}>
							{this.props.statusText}
						</div>
					</div>
				</div>
			);
		}

		return (
			<div className="container login">
				<h1 className="text-center">Register</h1>
				<div className="login-container margin-top-medium">
					{statusText}
					<form onSubmit={this.onFormSubmit}>
						<Form
							ref={ref => {
								this.registerForm = ref;
							}}
							type={Register}
							options={RegisterFormOptions}
							value={this.state.formValues}
							onChange={this.onFormChange}
						/>
						<button
							// NBED if sending request true,
							// this should also change status
							disabled={this.props.loggedIn}
							type="submit"
							className="btn btn-default btn-block"
						>
							Submit
						</button>
					</form>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		loggedIn: state.auth.loggedIn,
		sendingRequest: state.auth.sendingRequest,
		statusText: state.auth.statusText
	};
};

const mapDispatchToProps = dispatch => {
	return {
		// this adds this.props.dispatch back in
		dispatch,
		// This then is a custom action. Presumably if you import
		// an entire module (actionCreators), each function is keyed in an object
		// Not 100% sure this needs them?
		actions: bindActionCreators({ registerRequest }, dispatch)
	};
};

export default RegisterView;
