import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "styles/main.scss";

// Import local components
import { NavBar } from "components/Navbar/Navbar";

class App extends React.Component {
    static propTypes = {
        children: PropTypes.shape().isRequired
    };

    static defaultProps = {
        location: undefined
    };

    render() {
        return (
            <div className="app">
                <NavBar />
                <div>{this.props.children}</div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loggedIn: state.auth.loggedIn,
        location: state.router.location
    };
};

export default connect(mapStateToProps)(App);
export { App as AppNotConnected };
