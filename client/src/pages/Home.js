import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { toggleModal } from '../actions/authActions';
import { loadBoards } from '../actions/boardsActions';
import { updateUserLocally } from '../actions/userActions';

// components
import FullscreenLoader from '../components/FullscreenLoader/FullscreenLoader';
import Navigation from '../components/Navigation/Navigation';
import Intro from '../components/Intro/Intro';
import Boards from '../components/Boards/Boards';
import { toast } from 'react-toastify';

// Socket IO
import socket from '../config/socket';

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

		// Socket listeners
		socket.on('notify-participant', (data) => {
			if ((data.userId && this.props.user._id !== data.userId)
				|| (data.username && this.props.user.username !== data.username)) return;
		
			const { info } = data;
			toast.info(info.msg, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: false,
				pauseOnHover: false,
				draggable: false
			});

			this.props.updateUserLocally(data.info.user);
			this.props.loadBoards();
		});

		socket.on('notify-all-participants', (data) => {
			if (!this.props.user.sharedBoards.find((boardId) => boardId === data.boardId)) return;
			
			const { info } = data;

			toast.info(info.msg, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: false,
				pauseOnHover: false,
				draggable: false
			});

			this.props.loadBoards();
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

	componentWillUnmount = () => {
		// stop listening to participant events
		socket.off('notify-participant');
		socket.off('notify-all-participants');
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
	isRetrieving: state.auth.isRetrieving,
	user: state.auth.user
});

export default connect(
	mapStateToProps,
	{ toggleModal, loadBoards, updateUserLocally }
)(Home);
