import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

// components
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
				<Navigation link="/account" linkTag="Profile" />
				{ !this.state.isAuthenticated ? <Intro /> : <Boards /> }
			</Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated
});

export default connect(
	mapStateToProps
)(Home);

