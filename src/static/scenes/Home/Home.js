import React from "react";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Components
import StatusBlock from "components/StatusBlock/StatusBlock";

import "./Home.scss";
import reactLogo from "./images/react-logo.png";
import reduxLogo from "./images/redux-logo.png";

class HomeView extends React.Component {
    static propTypes = {
        statusText: PropTypes.shape({}),
        userName: PropTypes.string,
        dispatch: PropTypes.func.isRequired
    };

    static defaultProps = {
        statusText: {},
        userName: ""
    };

    goToProtected = () => {
        this.props.dispatch(push("/protected"));
    };

    render() {
        return (
            <div className="container">
                <div className="margin-top-medium text-center">
                    <img
                        className="page-logo margin-bottom-medium"
                        src={reactLogo}
                        alt="ReactJs"
                    />
                    <img
                        className="page-logo margin-bottom-medium"
                        src={reduxLogo}
                        alt="Redux"
                    />
                </div>
                <div className="text-center">
                    <h1>Django React Redux Demo</h1>
                    <h4>Hello, {this.props.userName || "guest"}.</h4>
                </div>
                <div className="margin-top-medium text-center">
                    <p>
                        Attempt to access some{" "}
                        <a onClick={this.goToProtected}>
                            <b>protected content</b>
                        </a>
                        .
                    </p>
                </div>
                <div className="margin-top-medium">
                    <StatusBlock statusText={this.props.statusText} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userName: state.auth.userName,
        statusText: state.auth.statusText
    };
};

export default connect(mapStateToProps)(HomeView);
// Export non connected view for unit testing without redux
// store connection.
export { HomeView as HomeViewNotConnected };
