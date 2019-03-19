// Default react imports
import React from "react";
import PropTypes from "prop-types";

// React-bootstrap components
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

// Redux imports
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { bindActionCreators } from "redux";

// Local imports
import { logout } from "services/auth/authActions";

class NavBar extends React.Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		loggedIn: PropTypes.bool.isRequired,
		actions: PropTypes.shape({
			logout: PropTypes.func.isRequired
		}).isRequired
	};

	logout = () => {
		// this.props.dispatch(authLogoutAndRedirect());
		this.props.actions.logout();
	};

	goToLocation = (e, route) => {
		e.preventDefault();
		this.props.dispatch(push(route));
	};

	render() {
		return (
			<Navbar bg="light" expand="lg">
				<Navbar.Brand href="/" onClick={e => this.goToLocation(e, "/")}>
					React-Bootstrap
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="mr-auto">
						<Nav.Link
							href="/"
							onClick={e => this.goToLocation(e, "/")}
						>
							Home
						</Nav.Link>
						<Nav.Link
							href="/restricted"
							onClick={e => this.goToLocation(e, "/restricted")}
						>
							Restricted
						</Nav.Link>
						<Nav.Link
							href="/primary"
							onClick={e => this.goToLocation(e, "/primary")}
						>
							Not Found Page
						</Nav.Link>
						{this.props.loggedIn ? (
							<Nav.Link onClick={this.logout}>Logout</Nav.Link>
						) : (
							// We can't have two direct children, so we have to
							// wrap in an element
							<span className="jsx-wrapper-stack-and-space">
								<Nav.Link
									href="/login"
									onClick={e =>
										this.goToLocation(e, "/login")
									}
								>
									Login
								</Nav.Link>
								<Nav.Link
									href="/register"
									onClick={e =>
										this.goToLocation(e, "/register")
									}
								>
									Sign-up
								</Nav.Link>
							</span>
						)}
					</Nav>
				</Navbar.Collapse>
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
		actions: bindActionCreators({ logout }, dispatch)
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NavBar);
