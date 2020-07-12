import React, { Component, Fragment } from 'react';
import { Spinner } from 'react-bootstrap';
import BoardsWrapper from '../BoardsWrapper/BoardsWrapper';

// redux
import { connect } from 'react-redux';
import { loadBoards, createBoard } from '../../actions/boardsActions';

// styles
import './Boards.scss';

/*
redux: get all boards,
isLoading: Spinner,
ownBoards: [],
sharedBoards: []

*/

class Boards extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ownBoards: [],
			sharedBoards: [],
			isLoading: false
		}
	}

	componentDidMount = () => {
		this.props.loadBoards();
	}

	componentDidUpdate = (prevProps) => {
		// updating ownBoards data
		const { ownBoards, sharedBoards, loadingBoards } = this.props;
		
		if (ownBoards !== prevProps.ownBoards) {
			this.setState({
				ownBoards
			});
		}

		// updating sharedBoards data		
		if (sharedBoards !== prevProps.sharedBoards) {
			this.setState({
				sharedBoards
			});
		}

		// updating loadingBoards data		
		if (loadingBoards !== prevProps.loadingBoards) {
			this.setState({
				isLoading: loadingBoards
			});
		}
	}

	render() {
		return (
			<Fragment>
				<div className="boards-container">
					{ this.state.isLoading ? (
						<Spinner className="mt-2 ml-2" animation="border" variant="primary" role="status">
							<span className="sr-only">Loading...</span>
						</Spinner>
					) : (
						<Fragment>
							<BoardsWrapper
							type="OWNED"
							items={ this.state.ownBoards }
							title="Owning boards:"
							createBoard={ this.props.createBoard }
							isLoading={ this.props.creatingBoard }
							/>
							<BoardsWrapper
							type="SHARED"
							items={ this.state.sharedBoards }
							title="Shared boards:"
							/>
						</Fragment>
					) }
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	ownBoards: state.boards.ownBoards,
	sharedBoards: state.boards.sharedBoards,
	loadingBoards: state.boards.isLoading,
	creatingBoard: state.boards.isCreating
});

export default connect(
	mapStateToProps,
	{ loadBoards, createBoard }
)(Boards);
