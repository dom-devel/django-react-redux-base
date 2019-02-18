// Default react imports
import React from "react";
import PropTypes from "prop-types";

// React-bootstrap components
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

// Redux imports
import { connect } from "react-redux";
import { push } from "connected-react-router";

// Local imports
import { authLogoutAndRedirect } from "services/auth";

class NavBar extends React.Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		isAuthenticated: PropTypes.bool.isRequired
	};

	logout = () => {
		this.props.dispatch(authLogoutAndRedirect());
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
						{this.props.isAuthenticated ? (
							<Nav.Link onClick={this.logout}>Logout</Nav.Link>
						) : (
							<Nav.Link
								href="/login"
								onClick={e => this.goToLocation(e, "/login")}
							>
								Login
							</Nav.Link>
						)}
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

const mapStateToProps = state => {
	return {
		isAuthenticated: state.auth.isAuthenticated,
		location: state.router.location
	};
};

export default connect(mapStateToProps)(NavBar);
