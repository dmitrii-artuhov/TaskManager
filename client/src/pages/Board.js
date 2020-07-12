import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { loadSingleBoard } from '../actions/singleBoardActions';

// components
import { Spinner } from 'react-bootstrap';
import Navigation from '../components/Navigation/Navigation';
import Sidebar from '../components/Sidebar/Sidebar';
import BoardInfo from '../components/BoardInfo/BoardInfo';
import Card from '../components/Card/Card';

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
							{ this.props.cardId && (<Card />) }
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
	board: state.singleBoard.board,
	cardId: state.singleCard.cardId,
});

export default connect(
	mapStateToProps,
	{ loadSingleBoard }
)(Board);

