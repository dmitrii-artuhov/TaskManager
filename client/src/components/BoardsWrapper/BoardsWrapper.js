import React, { Component, Fragment } from 'react';
import BoardPreview from '../BoardPreview/BoardPreview';
import CustomInput from '../CustomInput/CustomInput';

// styles
import './BoardWrapper.scss';

/*
props:
	items: [{board1}, {board2}],
	title: 'Owning',
	isLoading: optional,
	type: {
		type: String,
		value: 'OWNED', 'SHARED'
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
							// <div className="boards__create">
							// 	<div className="boards__input-wrapper">
							// 		<form onSubmit={ this.createBoard }>
							// 			<input value={this.state.newBoardTitle} onChange={ this.inputTitle } type="text" placeholder="Create new board..." />
							// 			{ this.props.isLoading ? (
							// 				<div className="boards__input-spinner">
							// 					<Spinner animation="border" variant="white" role="status">
							// 						<span className="sr-only">Loading...</span>
							// 					</Spinner>
							// 				</div>
							// 			) : (
							// 				<img onClick={ this.createBoard } alt="img" src="/assets/imgs/plus-solid.png" />
							// 			) }
							// 		</form>
							// 	</div>
							// </div>
						) }
					</div>
				</div>
			</Fragment>
		)
	}
}

export default BoardsWrapper;