import React, { Component, Fragment } from 'react';
import BoardPreview from '../BoardPreview/BoardPreview';
import CustomInput from '../CustomInput/CustomInput';

import { backgrounds } from '../../static.json';

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

	randomIndex = (min, max) => {
		const val = min + Math.random() * (max - min); 
		return Math.round(val);
	}

	createBoard = (value) => {
		const backgroundURL = backgrounds[this.randomIndex(0, backgrounds.length - 1)];

		this.props.createBoard({ title: value, backgroundURL });
	}

	render() {
		return (
			<Fragment>
				<div className="boards">
					<div className="boards__title">
					<h6>{this.props.title}</h6>
					</div>
					<div className="boards__content">
						{this.props.items.map((board) => (
							<BoardPreview
								key={board._id}
								board={board}
							/>
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