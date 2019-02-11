import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import PropTypes from "prop-types";

import routes from "routes";
import App from "scenes/App";

const Root = ({ store, history }) => {
	return (
		<div>
			<Provider store={store}>
				<div>
					<App>
						<ConnectedRouter history={history}>
							{routes}
						</ConnectedRouter>
					</App>
				</div>
			</Provider>
		</div>
	);
};

Root.propTypes = {
	store: PropTypes.shape().isRequired,
	history: PropTypes.shape().isRequired
};

export default Root;
