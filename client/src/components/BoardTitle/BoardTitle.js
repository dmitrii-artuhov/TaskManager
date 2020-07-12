import React, { Component } from 'react';
import { connect } from 'react-redux';
import { renameSingleBoard } from '../../actions/singleBoardActions';


// styles
import './BoardTitle.scss';

class BoardTitle extends Component {
	constructor(props) {
		super(props);

		this.state = {
			boardTitle: ''
		}
	}

	componentDidMount = () => {
		this.setState({
			boardTitle: this.props.board.title
		});
	}

	componentDidUpdate = (prevProps) => {
		if (this.props.board !== prevProps.board) {
			this.setState({
				boardTitle: this.props.board.title
			});
		}
	}

	inputValue = (e) => {
		this.setState({
			boardTitle: e.target.value
		});
	}

	getFullDate = () => {
		const d = new Date();
		const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

		const day = d.getDate();
		const month = monthNames[d.getMonth()];
		const year = d.getFullYear();

		const dateString = `${month} ${day}, ${year}`;

		return dateString;
	}

	renameBoard = (e) => {
		e.preventDefault();
		if (!this.state.boardTitle) 
			return;

		this.props.renameSingleBoard({
			boardId: this.props.board._id,
			newTitle: this.state.boardTitle
		});
	}

	render() {
		return (
			<div className="board-info__meta-date">
				{ !this.props.isRenamingBoard ? (
					<h4>{ this.props.board.title } | <span>{ this.getFullDate() }</span></h4>
					) : (
						<form onSubmit={ (e) => this.renameBoard(e) }>
							<input
								autoFocus
								className="board-info__meta-input"
								type="text"
								value={ this.state.boardTitle }
								onChange={ this.inputValue } />
						</form>
					) }
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	isRenamingBoard: state.singleBoard.isRenamingTitle,
	board: state.singleBoard.board
});


export default connect(
	mapStateToProps,
	{ renameSingleBoard }
)(BoardTitle);