import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

// Local imports
import { convertFormValidationToParagraph, isEmptyObject } from "utils/utils";

/**
 * Takes the an object of field validations from the server
 * and renders them into status messages to appear above a form.
 * @param  {[object]} 	An object where the keys are fields and values
 *                      are the arrays of errors associated with each
 *                      value.
 * @return {[jsx]}  	Returns a JSX component
 */
const StatusBlock = ({ statusText }) => {
	// Easy way to check for specific errors rather than
	// looping through multiple arrays
	const singleStringStatus = convertFormValidationToParagraph(statusText);

	const statusTextClassNames = classNames({
		alert: true,
		"alert-danger":
			singleStringStatus.indexOf("Authentication Error") === 0,
		"alert-warning": singleStringStatus.indexOf("required") === 0,
		"alert-success":
			singleStringStatus.indexOf("Authentication Error") !== 0
	});

	let messageDiv = <div />;
	if (!isEmptyObject(statusText)) {
		messageDiv = (
			<div className="row">
				<div className="col-sm-12">
					<div className={statusTextClassNames}>
						<StatusMessages feedbackObject={statusText} />
					</div>
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
	statusText: PropTypes.shape({})
};

/**
 *  Used to take errors from a form and convert them into a
 *  paragraph for printing to the user for validation.
 *
 * Currently does nothing with the labels of the object.
 *
 * @param  {[object]}           A JS object.
 * @return {[string]}       	A string.
 */
const StatusMessages = ({ feedbackObject }) => {
	const entries = Object.entries(feedbackObject);

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
	feedbackObject: PropTypes.shape({}).isRequired
};

export default StatusBlock;
