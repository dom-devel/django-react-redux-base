// React imports
import React from "react";
import PropTypes from "prop-types";

// Redux imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// Components
import StatusBlock from "components/StatusBlock/StatusBlock";
import { Title } from "bloomer";

// Helpers
import t from "tcomb-form";
import templates from "tcomb-form-templates-bulma";

// Local imports
import { loginRequest } from "services/auth/authActions";
import { extractRedirectOrDefault } from "utils/utils";

// Create a form
const Form = t.form.Form;
t.form.Form.templates = templates;

const Login = t.struct({
    email: t.String,
    password: t.String
});

const LoginFormOptions = {
    auto: "placeholders",
    fields: {
        password: {
            type: "password",
            error: "This is required."
        },
        email: {
            error: "This is required."
        }
    }
};

class LoginView extends React.Component {
    static propTypes = {
        // From mapState
        loggedIn: PropTypes.bool.isRequired,
        sendingRequest: PropTypes.bool.isRequired,
        statusText: PropTypes.array,
        // From mapDispatch
        actions: PropTypes.shape({
            loginRequest: PropTypes.func.isRequired
        }).isRequired,
        // From redux connect
        location: PropTypes.shape({
            search: PropTypes.string.isRequired
        })
    };

    // ES6 syntax for setting default props on component
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
                password: ""
            },
            redirectTo: redirectRoute
        };
    }

    // Store form values dyanmically in the state
    onFormChange = (value, path) => {
        // Validation component
        this.loginForm.getComponent(path).validate();

        // Set the value of the form in state.
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
            this.props.actions.loginRequest({
                email: value.email,
                password: value.password,
                redirectTo: this.state.redirectTo
            });
        }
    };

    // Get the redirect from the URL -- should probably
    // be in utilities

    render() {
        // Check if user is logged-in or sending request
        let disableSubmit = false;
        if (this.props.loggedIn || this.props.sendingRequest) {
            disableSubmit = true;
        }

        return (
            <div>
                <Title tag="h1" isSize={3}>
                    Login
                </Title>
                <StatusBlock statusTextMessages={this.props.statusText} />
                <form onSubmit={this.onFormSubmit} data-testid="loginForm">
                    <Form
                        // ref, options and type are
                        // all specific to tcomb forms??
                        //
                        // loginForm here is the name
                        // where we're saving the form
                        ref={ref => {
                            this.loginForm = ref;
                        }}
                        type={Login}
                        options={LoginFormOptions}
                        value={this.state.formValues}
                        onChange={this.onFormChange}
                    />
                    <button
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

// This allows us to dispatch actions to the store.
const mapDispatchToProps = dispatch => {
    return {
        // this adds this.props.dispatch back in
        dispatch,
        // This wraps each of the object properties in
        // a dispatch call. This means we can now call them
        // directly and they will dispatch an action to the
        // store where it can be intercepted by saga.
        actions: bindActionCreators({ loginRequest }, dispatch)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginView);
// Export non connected view for unit testing without redux
// store connection.
export { LoginView as LoginViewNotConnected };
