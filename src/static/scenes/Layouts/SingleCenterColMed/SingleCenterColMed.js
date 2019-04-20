import React, { Component } from "react";

// function SingleCenterColMed({ children }) {
// 	return (
// 		<div className="columns">
// 			<div className="is-8 is-offset-2">{children}</div>
// 		</div>
// 	);
// }

class SingleCenterColMed extends Component {
	render() {
		return (
			<div className="columns">
				<div className="column is-8 is-offset-2">
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default SingleCenterColMed;
