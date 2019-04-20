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
const FormSmall = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={matchProps => (
				<div className="columns">
					<div className="column is-4 is-offset-4">
						<Component {...matchProps} />
					</div>
				</div>
			)}
		/>
	);
};

export default FormSmall;
