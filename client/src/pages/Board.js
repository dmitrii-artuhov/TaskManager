import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { loadSingleBoard } from '../actions/singleBoardActions';

// components
import { Spinner } from 'react-bootstrap';
import Navigation from '../components/Navigation/Navigation';
import Sidebar from '../components/Sidebar/Sidebar';
import BoardInfo from '../components/BoardInfo/BoardInfo';
import FullviewCard from '../components/FullviewCard/FullviewCard';

// styles
import './styles.scss'; 


class Board extends Component {
	componentDidMount = () => {
		const { id } = this.props.match.params;
		this.props.loadSingleBoard(id);
	}

	componentDidUpdate = (prevProps) => {
		// updating isAuthenticated property
		const { isAuthenticated } = this.props;
		
		if (isAuthenticated === false) {
			this.props.history.push('/');
		}
	}

	render() {
		return (
			<Fragment>
				<Navigation link="/" linkTag="Boards" />
				<div className="board-page-wrapper d-flex">
					{ !this.props.isLoading ? (
						<Fragment>
							<Sidebar />
							<BoardInfo board={ this.props.board } />
							{ this.props.meta.cardId && (<FullviewCard meta={this.props.meta} />) }
						</Fragment>
					) : (
						<Spinner animation="border" variant="primary" role="status">
							<span className="sr-only">Loading...</span>
						</Spinner>
					) }
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
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

