// Default react imports
import React from "react";
import PropTypes from "prop-types";

// React-bootstrap components
import {
	Navbar,
	NavbarBrand,
	NavbarItem,
	NavbarStart,
	NavbarEnd
} from "bloomer";

// Redux imports
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { bindActionCreators } from "redux";

// Local imports
import { logoutRequest } from "services/auth/authActions";
import * as urls from "routesConstants";

class NavBar extends React.Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		loggedIn: PropTypes.bool.isRequired,
		actions: PropTypes.shape({
			logoutRequest: PropTypes.func.isRequired
		}).isRequired
	};

	logout = () => {
		// this.props.dispatch(authLogoutAndRedirect());
		this.props.actions.logoutRequest();
	};

	goToLocation = (e, route) => {
		e.preventDefault();
		this.props.dispatch(push(route));
	};

	render() {
		return (
			<Navbar bg="light" expand="lg">
				<NavbarBrand href="/" onClick={e => this.goToLocation(e, "/")}>
					<NavbarItem href={urls.HOME} className="is-size-4">
						React-Bootstrap
					</NavbarItem>
				</NavbarBrand>
				<NavbarStart id="basic-navbar-nav">
					<NavbarItem
						href={urls.EXAMPLE_RESTRICTED}
						onClick={e =>
							this.goToLocation(e, urls.EXAMPLE_RESTRICTED)
						}
					>
						Restricted
					</NavbarItem>
					<NavbarItem
						href={"/primary"}
						onClick={e => this.goToLocation(e, "/primary")}
					>
						Not Found Page
					</NavbarItem>
				</NavbarStart>
				<NavbarEnd>
					{this.props.loggedIn ? (
						<span className="jsx-wrapper-stack-and-space">
							<NavbarItem
								href={urls.ACCOUNT}
								onClick={() => this.logout()}
							>
								Account
							</NavbarItem>
							<NavbarItem href="#" onClick={() => this.logout()}>
								Logout
							</NavbarItem>
						</span>
					) : (
						// We can't have two direct children, so we have to
						// wrap in an element
						<span className="jsx-wrapper-stack-and-space">
							<NavbarItem
								href={urls.AUTH_LOGIN}
								onClick={e =>
									this.goToLocation(e, urls.AUTH_LOGIN)
								}
							>
								Login
							</NavbarItem>
							<NavbarItem
								href={urls.AUTH_REGISTER}
								onClick={e =>
									this.goToLocation(e, urls.AUTH_REGISTER)
								}
							>
								Sign-up
							</NavbarItem>
						</span>
					)}
				</NavbarEnd>
			</Navbar>
		);
	}
}

const mapStateToProps = state => {
	return {
		loggedIn: state.auth.loggedIn,
		location: state.router.location
	};
};

const mapDispatchToProps = dispatch => {
	return {
		dispatch,
		actions: bindActionCreators({ logoutRequest }, dispatch)
	};
};

const ConnectedNavBar = connect(
	mapStateToProps,
	mapDispatchToProps
)(NavBar);
export { ConnectedNavBar as NavBar };
export { NavBar as NavBarNotConnected };
