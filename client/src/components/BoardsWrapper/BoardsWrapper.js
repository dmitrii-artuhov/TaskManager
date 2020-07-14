import React, { Component, Fragment } from 'react';
import BoardPreview from '../BoardPreview/BoardPreview';
import CustomInput from '../CustomInput/CustomInput';

// styles
import './BoardWrapper.scss';

/*
props:
	items: [{board1}, {board2}],
	title: 'Owning | Shared',
	isLoading: optional,
	type: {
		type: ENUM,
		value: ['OWNED', 'SHARED']
	},
	createBoard: function() {}
*/

class BoardsWrapper extends Component {
	constructor(props) {
		super(props);

		this.state = {
			newBoardTitle: ''
		}
	}

	createBoard = (value) => {
		this.props.createBoard(value);
	}

	render() {
		return (
			<Fragment>
				<div className="boards">
					<div className="boards__title">
					<h6>{this.props.title}</h6>
					</div>
					<div className="boards__content">
						{this.props.items.map((board, item) => (
							<BoardPreview
							key={board._id}
							board={board} />
						))}

						{ this.props.type === 'OWNED' && (
							<CustomInput
							placeholder="Create new board..."
							onSubmit={this.createBoard}
							isLoading={this.props.isLoading} />
						) }
					</div>
				</div>
			</Fragment>
		)
	}
}

export default BoardsWrapper;