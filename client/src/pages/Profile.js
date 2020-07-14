import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

// components
import Navigation from '../components/Navigation/Navigation';
import ProfileCard from '../components/ProfileCard/ProfileCard';

class Profile extends Component {
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
	isAuthenticated: state.auth.isAuthenticated,
	isRetrieving: state.auth.isRetrieving
});

export default connect(
	mapStateToProps
)(Profile);

/*
{ !this.props.isAuthenticated && !this.props.isRetrieving ? (
	<Redirect to="/" />
) : (

) }

*/