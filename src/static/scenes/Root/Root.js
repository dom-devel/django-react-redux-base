import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import PropTypes from "prop-types";

import routes from "routes";
import App from "scenes/App/App";

// Import bulma styling
// import "bulma/css/bulma.css";

const Root = ({ store, history }) => {
	return (
		<Provider store={store}>
			<App>
				<ConnectedRouter history={history}>{routes}</ConnectedRouter>
			</App>
		</Provider>
	);
};

Root.propTypes = {
	store: PropTypes.shape().isRequired,
	history: PropTypes.shape().isRequired
};

export default Root;
