import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { startRenamingSingleBoard, deletingBoard, removeParticipant, findPotentialParticipants, inviteNewParticipant } from '../../actions/singleBoardActions';

import SidebarItem from '../SidebarItem/SidebarItem';

// styles
import './Sidebar.scss';

class Sidebar extends Component {
	componentDidMount = () => {
		this.props.findPotentialParticipants();
	}

	componentDidUpdate = () => {
		// check for board
		if (!this.props.board) {
			// window.location.replace('/');
		}
	}

	deleteBoard = () => {
		this.props.deletingBoard({ boardId: this.props.board._id });
	}

	removeParticipant = (participantId) => {
		this.props.removeParticipant({ boardId: this.props.board._id, participantId });
	}

	addParticipant = (username) => {
		this.props.inviteNewParticipant({ boardId: this.props.board._id, username });
	}

	isBoardAdmin = () => {
		let isAdmin = false;

		this.props.board.participants.forEach(({ role, user }) => {
			if (user._id === this.props.user._id && role === 'admin') 
				isAdmin = true;
		});

		return isAdmin;
	}

	isBoardParticipant = (userId) => {
		let isParticipant = false;

		this.props.board.participants.forEach(({ user }) => {
			if (user._id === userId) 
				isParticipant = true;
		});

		return isParticipant;
	}

	render() { 
		return (
			<div className="sidebar">
				<div className="sidebar__menu">
					<ul className="sidebar__list">
						<SidebarItem
							tag="li"
							onClick={this.props.startRenamingSingleBoard}
							title="rename board"
							className="sidebar__menu-item"
							icon="/assets/imgs/rename.svg"
						/>
						{ this.props.board.participants && this.isBoardAdmin() ? (
							<Fragment>
								<SidebarItem
									tag="li"
									title="add participant"
									className="sidebar__menu-item"
									icon="/assets/imgs/add.svg"
									modal={{
										title: 'Add participant',
										autoComplete: true,
										items: this.props.potentialParticipants,
										isInvalid: this.isBoardParticipant,
										onInvite: this.addParticipant
									}}
								/>
								<SidebarItem
									tag="li"
									title="remove participant"
									className="sidebar__menu-item"
									icon="/assets/imgs/delete.svg"
									modal={{
										title: 'Remove participant',
										items: this.props.board.participants,
										userId: this.props.user._id,
										onRemove: this.removeParticipant
									}}
								/>
							</Fragment>
						) : null }
					</ul>
				</div>
				{ this.props.board.participants && this.isBoardAdmin() ? (
					<SidebarItem
						onClick={this.deleteBoard}
						title="delete board"
						className="sidebar__button"
						icon="/assets/imgs/trash.svg"
						isLoading={this.props.isDeleting}
					/>
				) : null }
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	isDeleting: state.singleBoard.isDeleting,
	board: state.singleBoard.board,
	user: state.auth.user,
	potentialParticipants: state.singleBoard.potentialParticipants
});


export default connect(
	mapStateToProps,
	{ startRenamingSingleBoard, deletingBoard, removeParticipant, findPotentialParticipants, inviteNewParticipant }
)(Sidebar);
