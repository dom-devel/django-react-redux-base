import React from "react";
import { Route } from "react-router";

// function SingleCenterColMed({ children }) {
// 	return (
// 		<div className="columns">
// 			<div className="is-8 is-offset-2">{children}</div>
// 		</div>
// 	);
// }

/**
 * https://simonsmith.io/reusing-layouts-in-react-router-4
 *
 * This function takes a component and renders
 */
const FormMed = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={matchProps => (
				<div className="columns">
					<div className="column is-8 is-offset-2">
						<Component {...matchProps} />
					</div>
				</div>
			)}
		/>
	);
};

export default FormMed;
