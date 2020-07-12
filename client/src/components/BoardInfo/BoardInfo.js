import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createList } from '../../actions/singleBoardActions';

import BoardTitle from '../BoardTitle/BoardTitle';
import Participants from '../Participants/Participants';
import ListsWrapper from '../ListsWrapper/ListsWrapper';

// styles
import './BoardInfo.scss';

class BoardInfo extends Component {
	constructor(props) {
		super(props);

		this.state = {
			board: this.props.board,
			isListCreating: false
		}
	}

	componentDidUpdate = (prevProps) => {
		// check for board
		if (this.props.board !== prevProps.board) {
			this.setState({
				board: this.props.board
			});
		}
	}

	render() {
		return (
			<div className="container board-info">
				<div className="board-info__meta">
					<BoardTitle />
					<Participants />
				</div>

				<ListsWrapper
					board={this.props.board}
					onCreateList={(data) => this.props.createList(data)}
					isListCreating={this.props.isListCreating}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	board: state.singleBoard.board,
	isListCreating: state.singleBoard.isListCreating
});


export default connect(
	mapStateToProps,
	{ createList }
)(BoardInfo);


/*
<div className="board-info__content">
	{ this.state.lists ? this.state.lists.map((list, index) => (
		<List
		key={ list._id }
		list={ list }
		boardId={ this.state.board._id } />
	)) : '' }

	<div className="boards__create board-info__input">
		<div className="boards__input-wrapper">
			<form onSubmit={ (e) => { e.preventDefault(); this.createList(); } }>
				<input value={ this.state.newListTitle } onChange={(e) => {this.setState({ newListTitle: e.target.value })}} type="text" placeholder="Create new list..." />
				{ this.state.isListCreating ? (
					<div className="boards__input-spinner">
						<Spinner animation="border" variant="white" role="status">
							<span className="sr-only">Loading...</span>
						</Spinner>
					</div>
				) : (
					<img onClick={ this.createList } alt="img" src="/assets/imgs/plus-solid.png" />
				) }
			</form>
		</div>
	</div>
</div>



*/