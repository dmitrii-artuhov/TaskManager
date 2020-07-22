import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { startRenamingSingleBoard, deletingBoard } from '../../actions/singleBoardActions';

import SidebarItem from '../SidebarItem/SidebarItem';

// styles
import './Sidebar.scss';

class Sidebar extends Component {
	componentDidUpdate = () => {
		// check for board
		if (!this.props.board) {
			// window.location.replace('/');
		}
	}

	deleteBoard = () => {
		this.props.deletingBoard({ boardId: this.props.board._id });
	}

	isBoardAdmin = () => {
		let isAdmin = false;

		this.props.board.participants.map(({ role, user }) => {
			if (user._id === this.props.user._id && role === 'admin') 
				isAdmin = true;
		});

		return isAdmin;
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
									modal={{ title: 'Add participant', autoComplete: true }}
									// onClick={}
									// onSearch={}
								/>
								<SidebarItem
									tag="li"
									title="remove participant"
									className="sidebar__menu-item"
									icon="/assets/imgs/delete.svg"
									modal={{ title: 'Remove participant', items: this.props.board.participants }}
									// onClick={}
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
	user: state.auth.user
});


export default connect(
	mapStateToProps,
	{ startRenamingSingleBoard, deletingBoard }
)(Sidebar);
