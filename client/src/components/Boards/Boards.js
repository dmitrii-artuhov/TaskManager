import React, { Component, Fragment } from 'react';
import Skeleton from "react-loading-skeleton";
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
						<Fragment>
							<div className="boards__loader">
								<Skeleton className="boards__loader-title" height={30} width={280} />
								<div className="boards__loader-feed">
									<Skeleton className="boards__loader-board" height={200} />
									<Skeleton className="boards__loader-board" height={200} />
								</div>
							</div>
							<div className="boards__loader">
								<Skeleton className="boards__loader-title" height={30} width={280} />
								<div className="boards__loader-feed">
									<Skeleton className="boards__loader-board" height={200} />
									<Skeleton className="boards__loader-board" height={200} />
								</div>
							</div>
						</Fragment>
						
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
