import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { ConnectedRouter } from "connected-react-router";
import routes from "routes";

import "styles/main.scss";

// Import local components
import { NavBar } from "components/Navbar/Navbar";

class App extends React.Component {
    static propTypes = {
        history: PropTypes.shape().isRequired
    };

    static defaultProps = {
        location: undefined
    };

    render() {
        return (
            <div className="app">
                <div className="container">
                    <NavBar />
                </div>
                <section className="section">
                    <div className="container">
                        <ConnectedRouter history={this.props.history}>
                            {routes}
                        </ConnectedRouter>
                    </div>
                </section>
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
