import {
	SENDING_REQUEST,
	REQUEST_ERROR,
	DATA_REQUEST
} from "services/data/dataConstants";

/**
 * Gets data from an API
 * @param  {object} data                  The data we're sending about the request.
 * @param  {object} data.serviceType      The service which is asking for data. This will be used
 									      to select correct action to send the  
 * @param  {string} data.url              The URL we're requesting data from
 * @param  {string} data.requestType      The type of request (PUT, GET, UPDATE)
 * @param  {string} data.payload          The data being sent with the request
 * @param  {string} data.output           The action to fire with the server data response
 */
export function dataRequest(data) {
	return { type: DATA_REQUEST, data };
}
