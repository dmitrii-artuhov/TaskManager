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
					<Participants participants={this.props.board.participants} />
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
