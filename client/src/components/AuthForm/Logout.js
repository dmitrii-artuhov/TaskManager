import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

// components
import { Link } from 'react-router-dom';

// redux
import { logout } from '../../actions/authActions';

class Logout extends Component {
	logout = () => {
		this.props.logout();
	}

	render() {
		return (
			<Fragment>
				<Link to="/" onClick={this.logout} className="navigation__button nav-link">
					Logout
				</Link>
			</Fragment>
		);
	}
}

export default connect(
	null,
	{ logout }
)(Logout);