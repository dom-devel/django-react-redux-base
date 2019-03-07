// React imports
import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

// Redux imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { push } from "connected-react-router";

// Helpers
import t from "tcomb-form";

// Local imports
import { loginRequest } from "services/auth/authActions";
import { extractRedirectOrDefault } from "utils/utils";

// Create a form
const Form = t.form.Form;

const Login = t.struct({
    email: t.String,
    password: t.String
});

const LoginFormOptions = {
    auto: "placeholders",
    help: <i>Hint: a@a.com / qw</i>,
    fields: {
        password: {
            type: "password"
        }
    }
};

class LoginView extends React.Component {
    static propTypes = {
        // From mapState
        dispatch: PropTypes.func.isRequired,
        loggedIn: PropTypes.bool.isRequired,
        sendingRequest: PropTypes.bool.isRequired,
        statusText: PropTypes.string,
        // From mapDispatch
        actions: PropTypes.shape({
            loginRequest: PropTypes.func.isRequired
        }).isRequired,
        // From connect
        location: PropTypes.shape({
            search: PropTypes.string.isRequired
        })
    };

    // ES6 syntax for setting default props on component
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
                password: ""
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
                <h1 className="text-center">Login</h1>
                <div className="login-container margin-top-medium">
                    {statusText}
                    <form onSubmit={this.onFormSubmit}>
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
        actions: bindActionCreators({ loginRequest }, dispatch)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginView);
export { LoginView as LoginViewNotConnected };
