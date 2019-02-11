import React from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import classNames from "classnames";
import PropTypes from "prop-types";

import { authLogoutAndRedirect } from "services/auth";
import "styles/main.scss";

class App extends React.Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
        children: PropTypes.shape().isRequired,
        dispatch: PropTypes.func.isRequired,
        location: PropTypes.shape({
            pathname: PropTypes.string
        })
    };

    static defaultProps = {
        location: undefined
    };

    logout = () => {
        this.props.dispatch(authLogoutAndRedirect());
    };

    goToIndex = () => {
        this.props.dispatch(push("/"));
    };

    goToLogin = () => {
        this.props.dispatch(push("/login"));
    };

    goToProtected = () => {
        this.props.dispatch(push("/protected"));
    };

    render() {
        const homeClass = classNames({
            active: this.props.location && this.props.location.pathname === "/"
        });
        const protectedClass = classNames({
            active:
                this.props.location &&
                this.props.location.pathname === "/protected"
        });
        const loginClass = classNames({
            active:
                this.props.location && this.props.location.pathname === "/login"
        });

        return (
            <div className="app">
                <nav className="navbar navbar-light bg-light">
                    <a
                        className="navbar-brand"
                        onClick={this.goToIndex}
                        role="link"
                        tabIndex={0}
                    >
                        Django React Redux Demo
                    </a>
                    <button
                        type="button"
                        className="navbar-toggler collapsed"
                        data-toggle="collapse"
                        data-target="#top-navbar"
                        aria-expanded="false"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar">
                                <span className="icon-bar">
                                    <span className="icon-bar" />
                                </span>
                            </span>
                        </div>
                        <div
                            className="collapse navbar-collapse"
                            id="top-navbar"
                        >
                            {this.props.isAuthenticated ? (
                                <ul className="nav navbar-nav ml-auto">
                                    <li className={homeClass}>
                                        <a
                                            className="js-go-to-index-button"
                                            onClick={this.goToIndex}
                                            role="link"
                                            tabIndex={0}
                                        >
                                            <i className="fa fa-home"> Home</i>
                                        </a>
                                    </li>
                                    <li className={protectedClass}>
                                        <a
                                            className="js-go-to-protected-button"
                                            onClick={this.goToProtected}
                                            role="link"
                                            tabIndex={0}
                                        >
                                            <i className="fa fa-lock">
                                                Protected
                                            </i>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="js-logout-button"
                                            onClick={this.logout}
                                            role="link"
                                            tabIndex={0}
                                        >
                                            Logout
                                        </a>
                                    </li>
                                </ul>
                            ) : (
                                <ul className="nav navbar-nav ml-auto">
                                    <li className={homeClass}>
                                        <a
                                            className="js-go-to-index-button"
                                            onClick={this.goToIndex}
                                            role="link"
                                            tabIndex={0}
                                        >
                                            <i className="fa fa-home"> Home</i>
                                        </a>
                                    </li>
                                    <li className={loginClass}>
                                        <a
                                            className="js-login-button"
                                            onClick={this.goToLogin}
                                            role="link"
                                            tabIndex={0}
                                        >
                                            <i className="fa fa-home"> Login</i>
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                </nav>
                <div>{this.props.children}</div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        location: state.router.location
    };
};

export default connect(mapStateToProps)(App);
export { App as AppNotConnected };
