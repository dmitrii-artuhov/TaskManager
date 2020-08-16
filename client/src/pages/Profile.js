import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { updateUserLocally, loadUserInfo, updateAvatar } from '../actions/userActions';


// components
import Navigation from '../components/Navigation/Navigation';
import ProfileCard from '../components/ProfileCard/ProfileCard';
import { toast } from 'react-toastify';

// Socket IO
import socket from '../config/socket';

class Profile extends Component {
	componentDidMount = () => {
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

			if (data.info.type === 'DELETE') {
				const user = {
					...this.props.user,
					sharedBoards: [...this.props.user.sharedBoards.filter((boardId) => boardId !== data.boardId)]
				}

				this.props.updateUserLocally(user);
			}
		});

		// load user
		this.props.loadUserInfo();
	}

	componentWillUnmount = () => {
		// stop listening to participant events
		socket.off('notify-participant');
		socket.off('notify-all-participants');
	}

	updateAvatar = (data) => {
		console.log(data)
		this.props.updateAvatar(data);
	}

	render() {
		return (
			<Fragment>
				<Navigation link="/" linkTag="Boards" />
				<ProfileCard
					user={this.props.user}
					isLoading={this.props.isLoading}
					isUpdating={this.props.isUpdating}
					onUpdate={this.updateAvatar}
				/>
			</Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	isRetrieving: state.auth.isRetrieving,
	isLoading: state.auth.isLoading,
	isUpdating: state.auth.isUpdating,
	user: state.auth.user
});

export default connect(
	mapStateToProps,
	{ updateUserLocally, loadUserInfo, updateAvatar }
)(Profile);
