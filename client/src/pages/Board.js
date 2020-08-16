import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { applyRemoteChanges, loadSingleBoard } from '../actions/singleBoardActions';
import { updateUserLocally } from '../actions/userActions';


// components
import Navigation from '../components/Navigation/Navigation';
import Sidebar from '../components/Sidebar/Sidebar';
import BoardInfo from '../components/BoardInfo/BoardInfo';
import FullviewCard from '../components/FullviewCard/FullviewCard';
import Skeleton from "react-loading-skeleton";
import { toast } from 'react-toastify';

// Socket IO
import socket from '../config/socket';
import { enterBoardRoom, leaveBoardRoom } from '../sockets/boardSockets';

// styles
import './styles.scss';


class Board extends Component {
	// componentDidUpdate = (prevProps) => {
	// 	// check if board is unreachable 
	// 	if (this.props.isFailed !== prevProps.isFailed && this.props.isFailed && !this.props.isLoading) {
	// 		this.notifyUser('You might have been excluded from the board or board id is invalid. We will redirect you to the homepage.');
	// 	}
	// }

	componentDidMount = () => {
		// watch this carefully
		const { id } = this.props.match.params;
		this.props.loadSingleBoard(id);

		// connect to the socket room
		enterBoardRoom({ roomId: id });

		// track remote changes
		socket.on('update-board', () => {
			this.props.applyRemoteChanges({ boardId: id });
		});

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

			if (info.type === 'EXCLUDE' && this.props.board._id === data.roomId) {		
				this.props.history.push(info.redirect);
			}
		});

		socket.on('notify-all-participants', (data) => {
			console.log(this.props.user.sharedBoards, data.boardId);
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
			
			if (this.props.board._id === data.boardId) {		
				this.props.history.push(info.redirect);
			}
		});
	}

	componentWillUnmount = () => {
		const { id } = this.props.match.params;
		// disconnect from socket room
		leaveBoardRoom({ roomId: id });
		
		// stop listening to participant events
		socket.off('notify-participant');
		socket.off('notify-all-participants');
	}

	render() {
		return (
			<Fragment>
				<Navigation link="/" linkTag="Boards" />
				<div className="board-page-wrapper d-flex">
					<Sidebar />
					{ !this.props.isLoading ? (
						<Fragment>
							<BoardInfo board={ this.props.board } />
							{ this.props.meta.cardId && (<FullviewCard meta={this.props.meta} />) }
						</Fragment>
					) : (
						<Fragment>
							<div className="container board-info">
								<div className="board-info__meta">
									<Skeleton className="faded-skeleton" width={250} height={40} />
								</div>
								<div className="board-info__content">
									<Skeleton className="faded-skeleton" width={280} height={400} />
									<Skeleton className="faded-skeleton" width={280} height={400} />
								</div>
							</div>
						</Fragment>
					) }

					<div className="board-page-wrapper__background">
						<div className="board-page-wrapper__background-fade"></div>
						{ !this.props.isLoading && this.props.board.backgroundURL ? (
							<img src={`/assets/backgrounds/${this.props.board.backgroundURL}`} alt="bg"/>
						) : (
							<div className="board-page-wrapper__placeholder"></div>
						)}
					</div>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.auth.user,
	isAuthenticated: state.auth.isAuthenticated,
	isRetrieving: state.auth.isRetrieving,
	isLoading: state.singleBoard.isLoading,
	isFailed: state.singleBoard.isFailed,
	// board
	board: state.singleBoard.board,
	// selected fullview card
	meta: state.singleCard.meta,
});

export default connect(
	mapStateToProps,
	{ applyRemoteChanges, loadSingleBoard, updateUserLocally }
)(Board);
