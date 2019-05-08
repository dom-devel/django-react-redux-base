// React imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// Components
import StatusBlock from "components/StatusBlock/StatusBlock";
import { Title } from "bloomer";

// Helpers
import t from "tcomb-form";
import templates from "tcomb-form-templates-bulma";

// Create form
const Form = t.form.Form;
t.form.Form.templates = templates;

const PasswordReset = t.struct({
	email: t.String
});

class PasswordResetView extends Component {
	static propTypes = {
		// From mapState
		sendingRequest: PropTypes.bool.isRequired,
		statusText: PropTypes.shape({}),
		loggedIn: PropTypes.bool.isRequired,
		// From mapDispatch
		actions: PropTypes.shape({
			registerRequest: PropTypes.func.isRequired
		}).isRequired,
		// From redux connect
		location: PropTypes.shape({
			search: PropTypes.string.isRequired
		})
	};

	static defaultProps = {
		statusText: {},
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
				name: ""
			},
			hasFormValidated: false,
			redirectTo: redirectRoute
		};
	}

	// Store form values dyanmically in the state
	onFormChange = (value, path) => {
		// Form has validated once -- set validation
		// class for bootstrap 4
		this.setState({ hasFormValidated: true });
		// Validation component
		this.registerForm.getComponent(path).validate();
		// output = this.registerForm.getComponent(path).validate();
		// console.log(this.registerForm.getComponent(path));
		this.setState({ formValues: value });
	};

	onFormSubmit = e => {
		e.preventDefault();
		// In case user submits an empty form
		// we need to set this here.
		this.setState({ hasFormValidated: true });
		// This is tcomb fun that gets the values from
		// the form
		const value = this.registerForm.getValue();

		if (value) {
			// Pass through as object for easier
			// unpacking later
			this.props.actions.registerRequest({
				name: value.name,
				email: value.email,
				password: value.password,
				redirectTo: this.state.redirectTo
			});
		}
	};

	render() {
		let formValidationClass = [];

		if (this.state.hasFormValidated) {
			formValidationClass = classNames(["was-validated"]);
		}

		// Check if user is logged-in or sending request
		let disableSubmit = false;
		if (this.props.loggedIn || this.props.sendingRequest) {
			disableSubmit = true;
		}

		return (
			<div className="container login">
				<h1 className="text-center">Register</h1>
				<div className="login-container margin-top-medium">
					<StatusBlock statusText={this.props.statusText} />
					<form
						onSubmit={this.onFormSubmit}
						className={formValidationClass}
					>
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
							disabled={disableSubmit}
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
