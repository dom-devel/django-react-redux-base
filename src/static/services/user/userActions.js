import { CURRENT_USER } from "services/user/userConstants";

/**
 * Gets user data
 * @param  {object} user                    The user we're requesting data about.
 * @param  {object} user.name               The full name of the user.
 * @param  {string} user.email              The email of the user
 */
export function currentUser(data) {
	return { type: CURRENT_USER, data };
}

/**
 * Gets user data
 * @param  {object} user                    The user we're requesting data about.
 * @param  {object} user.name               The full name of the user.
 * @param  {string} user.email              The email of the user
 */
// export function updateUser(data) {
// 	return { type: UPDATE_USER, data };
// }
