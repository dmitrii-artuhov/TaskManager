import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { toggleModal } from '../actions/authActions';

// components
import FullscreenLoader from '../components/FullscreenLoader/FullscreenLoader';
import Navigation from '../components/Navigation/Navigation';
import Intro from '../components/Intro/Intro';
import Boards from '../components/Boards/Boards';

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isAuthenticated: null
		}
	}

	componentDidMount = () => {
		this.setState({
			isAuthenticated: this.props.isAuthenticated
		});
	}

	componentDidUpdate = (prevProps) => {
		// updating isAuthenticated property
		const { isAuthenticated } = this.props;
		if (isAuthenticated !== prevProps.isAuthenticated) {
			this.setState({
				isAuthenticated
			});
		}

	}

	render() {
		return (
			<Fragment>
				<FullscreenLoader isLoading={this.props.isRetrieving}>
						<Navigation link="/account" linkTag="Profile" />
						{ !this.state.isAuthenticated ? <Intro toggleModal={this.props.toggleModal} /> : <Boards /> }
				</FullscreenLoader>
			</Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	isRetrieving: state.auth.isRetrieving
});

export default connect(
	mapStateToProps,
	{ toggleModal }
)(Home);

/* { this.props.isLoading ? (
	<FullscreenLoader />
) : (
	<Fragment>
		<Navigation link="/account" linkTag="Profile" />
		{ !this.state.isAuthenticated ? <Intro /> : <Boards /> }
	</Fragment>
) } */