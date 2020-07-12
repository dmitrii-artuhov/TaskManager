import React, { Component } from 'react';
import List from '../List/List';
import CustomInput from '../CustomInput/CustomInput';

// styles
import './ListsWrapper.scss';

export default class ListsWrapper extends Component {
	createList = (value) => {
		if (!value) 
			return;

		this.props.onCreateList({ title: value, boardId: this.props.board._id });
	}
	
	render() {
		return (
			<div className="board-info__content">
				{ this.props.board && this.props.board.lists ? this.props.board.lists.map((list) => (
					<List
					key={ list._id }
					list={ list }
					boardId={ this.props.board._id } />
				)) : '' }

				<CustomInput
					placeholder="Create new list..."
					onSubmit={this.createList}
					isLoading={this.props.isListCreating}
					className="board-info__input"
				/>
			</div>
		);
	}
}
