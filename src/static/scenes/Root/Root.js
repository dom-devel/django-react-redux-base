import React from "react";
import { Provider } from "react-redux";

import PropTypes from "prop-types";

import App from "scenes/App/App";

// Import bulma styling
// import "bulma/css/bulma.css";

const Root = ({ store, history }) => {
	return (
		<Provider store={store}>
			<App history={history} />
		</Provider>
	);
};

Root.propTypes = {
	store: PropTypes.shape().isRequired,
	history: PropTypes.shape().isRequired
};

export default Root;
