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
import { dataRequest } from "services/data/dataActions";
import { currentUser } from "services/user/userActions";
import { USER_RTE_UPD_API } from "routesConstants";

// Create a form
const Form = t.form.Form;
t.form.Form.templates = templates;

const Account = t.struct({
    email: t.String,
    name: t.String
});

const AccountFormOptions = {
    auto: "placeholders"
    // fields: {
    //     password: {
    //         type: "password",
    //         error: "Password is required."
    //     },
    //     email: {
    //         error: "Email is required."
    //     }
    // }
};

class AccountView extends React.Component {
    static propTypes = {
        // From mapState
        sendingRequest: PropTypes.bool.isRequired,
        statusText: PropTypes.array,
        // From mapDispatch
        actions: PropTypes.shape({
            dataRequest: PropTypes.func.isRequired
        }).isRequired,
        name: PropTypes.string,
        email: PropTypes.string
    };

    // ES6 syntax for setting default props on component
    static defaultProps = {
        statusText: [],
        name: "",
        email: ""
    };

    constructor(props) {
        super(props);

        this.state = {
            formValues: {
                name: this.props.name,
                email: this.props.email
            }
        };
    }

    componentDidMount() {
        this.props.actions.dataRequest({
            serviceType: "generalStatus",
            url: USER_RTE_UPD_API,
            requestType: "get",
            payload: {},
            output: currentUser
        });
    }

    // Store form values dyanmically in the state
    onFormChange = (value, path) => {
        // Validation component
        this.accountForm.getComponent(path).validate();

        // Set the value of the form in state.
        this.setState({ formValues: value });
    };

    onFormSubmit = e => {
        e.preventDefault();
        // This is tcomb fun that gets the values from
        // the form
        const value = this.accountForm.getValue();
        if (value) {
            // Pass through as object for easier
            // unpacking later
            // this.props.actions.dataRequest({
            //     email: value.email,
            //     password: value.password,
            //     redirectTo: this.state.redirectTo
            // });
        }
    };

    // Get the redirect from the URL -- should probably
    // be in utilities

    render() {
        // Check if user is logged-in or sending request
        let disableSubmit = false;
        if (this.props.sendingRequest) {
            disableSubmit = true;
        }

        return (
            <div>
                <Title tag="h1" isSize={3}>
                    User Account
                </Title>
                <StatusBlock statusTextMessages={this.props.statusText} />
                <form onSubmit={this.onFormSubmit} data-testid="accountForm">
                    <Form
                        // ref, options and type are
                        // all specific to tcomb forms??
                        //
                        // loginForm here is the name
                        // where we're saving the form
                        ref={ref => {
                            this.accountForm = ref;
                        }}
                        type={Account}
                        options={AccountFormOptions}
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
        loggedIn: state.generalStatus.sendingRequest,
        name: state.user.name,
        email: state.user.email
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
        actions: bindActionCreators({ dataRequest }, dispatch)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountView);
// Export non connected view for unit testing without redux
// store connection.
export { AccountView as AccountViewNotConnected };
