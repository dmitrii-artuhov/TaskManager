import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

// components
import Navigation from '../components/Navigation/Navigation';
import ProfileCard from '../components/ProfileCard/ProfileCard';

class Profile extends Component {
	componentDidUpdate = (prevProps) => {
		// updating isAuthenticated property
		const { isAuthenticated } = this.props;
		
		if (isAuthenticated === false) {
			this.props.history.push('/');
		}
	}

	render() {
		return (
			<Fragment>
				<Navigation link="/" linkTag="Boards" />
				<ProfileCard />
			</Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated
});

export default connect(
	mapStateToProps
)(Profile);

