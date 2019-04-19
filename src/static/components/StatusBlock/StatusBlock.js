import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

// Local imports
import { isEmptyObject } from "utils/utils";

/**
 * Takes the an object of field validations from the server
 * and renders them into status messages to appear above a form.
 *
 * Sidenote: Because the object is passed in here, it comes in as an object. 
 * If this was being pulled from the store, then it would just be the array.
 *
 * NBED -- This currently re-renders everytime state changes. (well at least it calls)
 * the convert form valiation to paragraph. Should probably attempt to prevent that.
 *
 * @param  {[object]} 	An object which contains a list of objects. Each object
 						in the list represents one set of messages. In the message object 
 						the keys are fields and values are the arrays of errors
 						associated with each value.
 * @return {[jsx]}  	Returns a JSX component
 */
const StatusBlock = ({ statusTextMessages }) => {
	// Easy way to check for specific errors rather than
	// looping through multiple arrays

	console.log(statusTextMessages);

	let messageDiv = <div />;
	if (statusTextMessages.length !== 0) {
		messageDiv = (
			<div className="row">
				<div className="col-sm-12">
					{statusTextMessages.map((item, index) => (
						<div
							className={getBootstrapErrorClass(item.statusLevel)}
						>
							<StatusMessages statusTextObject={item.message} />
						</div>
					))}
				</div>
			</div>
		);
	}

	return messageDiv;
};

StatusBlock.displayName = "StatusBlock";

StatusBlock.propTypes = {
	// We don't actually know the shape of the validation object
	// (because the fields will change both key & number)
	// so unsure how to validate this. We use shape, not object
	// to appease eslint.
	statusTextMessages: PropTypes.array
};

/**
 * @param  {[object]} 	Take a status level and return the correct bootstrap class.
 */
function getBootstrapErrorClass(statusLevel) {
	let bootstrapClass;
	if (statusLevel === "error") {
		bootstrapClass = "alert-danger";
	} else if (statusLevel === "warning") {
		bootstrapClass = "alert-warning";
	} else {
		bootstrapClass = "alert-success";
	}
	return bootstrapClass + " alert";
}

/**
 *  Used to take errors from a form and convert them into a
 *  paragraph for printing to the user for validation.
 *
 * Currently does nothing with the labels of the object.
 *
 * @param  {[object]}           A list of JS objects.
 * @return {[string]}       	A string.
 */
const StatusMessages = ({ statusTextObject }) => {
	const entries = Object.entries(statusTextObject);
	// We can use i for key as messages are static
	const listItems = entries.map((errorArray, i) => {
		const fieldLabel = errorArray[0];
		let output = "";

		// We get two different types of errors:
		// non fields specific errors and field specific
		// errors from django. They should be dealt with
		// differently.
		if (fieldLabel === "non_field_errors") {
			output = errorArray[1].map(error => <p key={i}>{error}</p>); // eslint-disable-line
		} else {
			output = (
				// eslint-disable-next-line
				<p key={i}>
					{errorArray[0]}
					{errorArray[1].map(error => (
						<span>: {error}</span>
					))}
					<br />
				</p>
			);
		}
		return output;
	});

	return <div>{listItems}</div>;
};

StatusMessages.displayName = "StatusMessages";

StatusMessages.propTypes = {
	statusTextObject: PropTypes.shape({}).isRequired
};

export default StatusBlock;
