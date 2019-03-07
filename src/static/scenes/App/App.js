import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "styles/main.scss";

// Import local components
import Navbar from "components/Navbar/Navbar";
import { ConnAuthBarrier } from "components/AuthBarrier";

class App extends React.Component {
    static propTypes = {
        children: PropTypes.shape().isRequired
    };

    static defaultProps = {
        location: undefined
    };

    render() {
        return (
            <div>
                <div className="app">
                    <Navbar />
                    <ConnAuthBarrier>
                        <div>{this.props.children}</div>
                    </ConnAuthBarrier>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        location: state.router.location
    };
};

export default connect(mapStateToProps)(App);
export { App as AppNotConnected };