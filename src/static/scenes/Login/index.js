import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import classNames from "classnames";
import { push } from "connected-react-router";
import t from "tcomb-form";
import PropTypes from "prop-types";

import * as actionCreators from "services/auth";

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
        dispatch: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool.isRequired,
        isAuthenticating: PropTypes.bool.isRequired,
        statusText: PropTypes.string,
        actions: PropTypes.shape({
            authLoginUser: PropTypes.func.isRequired
        }).isRequired,
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

        const redirectRoute = this.props.location
            ? this.extractRedirect(this.props.location.search) || "/"
            : "/";

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

    // This catches a user if they're not authenticated
    // we're going to switch that to an error boundary
    componentWillMount() {
        if (this.props.isAuthenticated) {
            this.props.dispatch(push("/"));
        }
    }

    // Store form values dyanmically in the state
    onFormChange = value => {
        this.setState({ formValues: value });
    };

    // Get the redirect from the URL -- should probably
    // be in utilities
    extractRedirect = string => {
        const match = string.match(/next=(.*)/);
        return match ? match[1] : "/";
    };

    login = e => {
        e.preventDefault();
        // This is tcomb fun that gets the values from
        // the form
        const value = this.loginForm.getValue();
        if (value) {
            this.props.actions.authLoginUser(
                value.email,
                value.password,
                this.state.redirectTo
            );
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
                <h1 className="text-center">Login</h1>
                <div className="login-container margin-top-medium">
                    {statusText}
                    <form onSubmit={this.login}>
                        <Form
                            ref={ref => {
                                this.loginForm = ref;
                            }}
                            type={Login}
                            options={LoginFormOptions}
                            value={this.state.formValues}
                            onChange={this.onFormChange}
                        />
                        <button
                            disabled={this.props.isAuthenticating}
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
        isAuthenticated: state.auth.isAuthenticated,
        isAuthenticating: state.auth.isAuthenticating,
        statusText: state.auth.statusText
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // this adds this.props.dispatch back in
        dispatch,
        // This then is a custom action
        actions: bindActionCreators(actionCreators, dispatch)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginView);
export { LoginView as LoginViewNotConnected };
