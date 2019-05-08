// This is used to import all the actions into a single file.

// They can then all be imported into the generic data file to allow
// for a generic API saga.

import * as authActions from "services/auth/authActions";
import * as dataActions from "services/data/dataActions";
import * as generalStatusActions from "services/generalStatus/generalStatusActions";

const allActions = {
	auth: authActions,
	data: dataActions,
	generalStatus: generalStatusActions
};

export default allActions;
