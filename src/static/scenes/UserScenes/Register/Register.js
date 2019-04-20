// React imports
import React, { Component } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

// Redux imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// Components
import StatusBlock from "components/StatusBlock/StatusBlock";
import { Title } from "bloomer";

// Helpers
import t from "tcomb-form";
// import t from "tcomb-form/lib";
// import en from "tcomb-form/lib/i18n/en";
// This is local version currently
// https://github.com/dom-devel/tcomb-form-templates-bootstrap
import templates from "tcomb-form-templates-bulma";

// Local helpers
import { registerRequest } from "services/auth/authActions";
import { extractRedirectOrDefault } from "utils/utils";

const Form = t.form.Form;
// t.form.Form.i18n = en;
t.form.Form.templates = templates;

const Register = t.struct({
	name: t.String,
	email: t.String,
	password: t.String
});

const RegisterFormOptions = {
	auto: "placeholders",
	// help: <i>Register and recieve all the things</i>,
	fields: {
		password: {
			type: "password",
			error: "This is required."
		},
		email: {
			error: "This is required."
		},
		name: {
			error: "This is required."
		}
	},
	i18n: {
		required: "*" // suffix added to required fields
	}
};

class RegisterView extends Component {
	static propTypes = {
		// From mapState
		sendingRequest: PropTypes.bool.isRequired,
		statusText: PropTypes.shape([]),
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
		statusText: [],
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
			<div>
				<Title tag="h1" isSize={3}>
					Register
				</Title>
				<StatusBlock statusTextMessages={this.props.statusText} />
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
						className="button is-link is-fullwidth"
					>
						Submit
					</button>
				</form>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		loggedIn: state.auth.loggedIn,
		sendingRequest: state.auth.sendingRequest,
		statusText: state.message.statusText
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

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RegisterView);
export { RegisterView as RegisterViewNotConnected };
