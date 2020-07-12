import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

// components
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem } from 'reactstrap';
import {
	Spinner
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

import LoginModal from '../AuthForm/LoginModal';
import RegisterModal from '../AuthForm/RegisterModal';
import Logout from '../AuthForm/Logout';

// styles
import './Navigation.scss';

class Navigation extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isCollapsed: true,
			isAuthenticated: null,
			user: null
		}
	}

	componentDidUpdate = (prevProps) => {
		// update isAuthenticated property
		if (this.props.isAuthenticated !== prevProps.isAuthenticated) {
			this.setState({
				isAuthenticated: this.props.isAuthenticated
			});
		}

		// update user property
		if (this.props.user !== prevProps.user) {
			this.setState({
				user: this.props.user
			});
		}
	}

	componentDidMount = () => {
		this.setState({
			isAuthenticated: this.props.isAuthenticated,
			user: this.props.user
		});
	}

	toggleNavbar = () => {
		this.setState({
			isCollapsed: !this.state.isCollapsed
		});
	}

	render() {
		const guestLinks = (
			<Fragment>
				<NavItem>
					<LoginModal />
				</NavItem>
				<span className="navigation__line"></span>
				<NavItem>
					<RegisterModal />
				</NavItem>
			</Fragment>
		);

		const authLinks = (
			<Fragment>
				<NavItem>
					<Link to={ this.props.link } className="navigation__button nav-link">
						{ this.props.linkTag }
					</Link>
				</NavItem>
				<span className="navigation__line"></span>	
				<NavItem>
					<Logout />
				</NavItem>
			</Fragment>
		);

		return (
			<Fragment>
				<Navbar className="navigation" color="dark" dark expand="sm">
					<NavbarBrand href="/" className="mr-auto">TaskManager</NavbarBrand>

					<NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
					<Collapse isOpen={!this.state.isCollapsed} navbar>
						<Nav navbar className="ml-auto">
							{ this.state.isAuthenticated === null ? 
								<Spinner as="span" size="sm" animation="border" variant="info" />
							: this.state.isAuthenticated ? (
								authLinks
							) : guestLinks }
						</Nav>
					</Collapse>
				</Navbar>
			</Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	user: state.auth.user
});

export default connect(
	mapStateToProps
)(Navigation);

