import React, { Component } from 'react';
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

	render() { 
		return (
			<div className="sidebar">
				<div className="sidebar__menu">
					<ul>
						<SidebarItem
							tag="li"
							onClick={this.props.startRenamingSingleBoard}
							title="rename board"
							className="sidebar__menu-item"
							icon="/assets/imgs/rename.svg"
						/>
						<SidebarItem
							tag="li"
							title="add participant"
							className="sidebar__menu-item"
							icon="/assets/imgs/add.svg"
						/>
						<SidebarItem
							tag="li"
							title="remove participant"
							className="sidebar__menu-item"
							icon="/assets/imgs/delete.svg"
						/>
					</ul>
				</div>
				
				<SidebarItem
					onClick={this.deleteBoard}
					title="delete board"
					className="sidebar__button"
					icon="/assets/imgs/trash.svg"
					isLoading={this.props.isDeleting}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	isDeleting: state.singleBoard.isDeleting,
	board: state.singleBoard.board
});


export default connect(
	mapStateToProps,
	{ startRenamingSingleBoard, deletingBoard }
)(Sidebar);
