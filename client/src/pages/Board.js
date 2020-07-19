import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { loadSingleBoard } from '../actions/singleBoardActions';
import Skeleton from "react-loading-skeleton";

// components
import Navigation from '../components/Navigation/Navigation';
import Sidebar from '../components/Sidebar/Sidebar';
import BoardInfo from '../components/BoardInfo/BoardInfo';
import FullviewCard from '../components/FullviewCard/FullviewCard';

// styles
import './styles.scss'; 


class Board extends Component {
	componentDidMount = () => {
		// watch this carefully
		const { id } = this.props.match.params;
		this.props.loadSingleBoard(id);
	}

	render() {
		return (
			<Fragment>
				<Navigation link="/" linkTag="Boards" />
				<div className="board-page-wrapper d-flex">
					<Sidebar />
					{ !this.props.isLoading ? (
						<Fragment>
							<BoardInfo board={ this.props.board } />
							{ this.props.meta.cardId && (<FullviewCard meta={this.props.meta} />) }
						</Fragment>
					) : (
						<Fragment>
							<div className="container board-info">
								<div className="board-info__meta">
									<Skeleton className="faded-skeleton" width={250} height={40} />
								</div>
								<div className="board-info__content">
									<Skeleton className="faded-skeleton" width={280} height={400} />
									<Skeleton className="faded-skeleton" width={280} height={400} />
								</div>
							</div>
						</Fragment>
					) }

					<div className="board-page-wrapper__background">
						<div className="board-page-wrapper__background-fade"></div>
						{ !this.props.isLoading && this.props.board.backgroundURL ? (
							<img src={`/assets/backgrounds/${this.props.board.backgroundURL}`} alt="bg"/>
						) : (
							<div className="board-page-wrapper__placeholder"></div>
						)}
					</div>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	isRetrieving: state.auth.isRetrieving,
	isLoading: state.singleBoard.isLoading,
	// board
	board: state.singleBoard.board,
	// selected fullview card
	meta: state.singleCard.meta,
});

export default connect(
	mapStateToProps,
	{ loadSingleBoard }
)(Board);

//  { !this.props.isAuthenticated && !this.props.isRetrieving ? (
// 		<Redirect to="/" />
// 	) : ( 
		
// 	) }
