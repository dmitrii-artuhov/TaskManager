import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
// redux
import { deleteList, renameList, createCard } from '../../actions/singleBoardActions';
import { selectCardById } from '../../actions/singleCardActions';

// components
import ActionsModal from '../ActionsModal/ActionsModal';
import CardsWrapper from '../CardsWrapper/CardsWrapper';

// API
import { getListById } from '../../api/lists';
// styles
import './List.scss';

class List extends Component {
	constructor(props) {
		super(props);

		this.state = {
			// actions modal
			isActionsOpen: false,
			// rename list
			isRenamingList: false,
			listTitle: this.props.list.title,

			// cards
			isCreatingCard: false,
		}
	}

	componentDidMount = () => {
		document.body.addEventListener('click', this.unshiftCard);
	}

	componentWillUnmount = () => {
		document.body.removeEventListener('click', this.unshiftCard);
	}

	componentDidUpdate = (prevProps) => {
		// // check lists
		// if (this.props.lists !== prevProps.lists) {
		// 	const updatedList = this.props.lists.find((item) => item._id === this.props.list._id);
		// 	// list might have been deleted
		// 	if (updatedList) {
		// 		this.setState({
		// 			list: updatedList,
		// 			cards: updatedList ? updatedList.cards : []
		// 		});
		// 	}
		// }

		// update list (if a card from it has just been viewed in fullscreen)
		// if (this.props.selectedCard !== prevProps.selectedCard && !this.props.selectedCard.listId) {
		// 	const { boardId, list } = this.state;

		// 	getListById({ boardId, listId: list._id })
		// 		.then(({ data }) => {

		// 			this.setState({
		// 				list: data.list,
		// 				listTitle: data.list.title,
		// 				cards: data.list.cards
		// 			});
		// 		})
		// 		.catch((err) => {
		// 			console.error(err.response);
		// 		})
		// }
	}

	// toggle actions menu
	toggleActionModal = () => {
		this.setState({
			isActionsOpen: !this.state.isActionsOpen
		});
	}

	// CRUD for the list
	renameList = (e) => {
		e.preventDefault();
		
		if (!this.state.listTitle) {
			return;
		}

		this.setState({
			isRenamingList: false
		});

		const { boardId, list } = this.props;
		this.props.renameList({ boardId, listId: list._id, newTitle: this.state.listTitle });
	}

	addCardToList = () => {
		this.toggleActionModal();

		this.setState({ 
			isCreatingCard: true
		});
	}

	deleteList = () => {
		const { boardId, list } = this.props;
		// this.toggleActionModal
		this.props.deleteList({ boardId, listId: list._id });
	}

	// cards
	unshiftCard = (e) => {
		if (e.target.closest('.list__card-new')) 
			return;

		this.setState({
			isCreatingCard: false
		});
	}

	createCard = (value) => {
		const { boardId, list } = this.props;

		this.props.createCard({ boardId, listId: list._id, title: value });
		
		this.setState({
			isCreatingCard: false
		});
	}

	viewCard = (cardId) => {
		this.props.selectCardById({
			cardId,
			listId: this.state.list._id,
			boardId: this.state.boardId
		});
	}

	render() {
		return (
			<Fragment>
				<div style={{opacity: (this.props.list._id === this.props.listDeletingId && this.props.isListDeleting ? 0.6 : 1)}} className="list">
					<div className="list__title">
						<span className="list__dot"></span>
						{ !this.state.isRenamingList ? (
							<h5>
								{ this.props.list ? this.props.list.title : '' }
							</h5>
						) : (
							<form onSubmit={ this.renameList }>
								<input
								autoFocus
								className="list__input"
								type="text"
								value={ this.state.listTitle }
								onChange={ (e) => this.setState({ listTitle: e.target.value }) } />
							</form>
						) }

						<div onClick={ this.toggleActionModal } className={`list__kebab-menu list__kebab-menu-${this.state.list ? this.state.list._id : ''}` }>
							<span></span>
							<span></span>
							<span></span>
						</div>
					</div>

					<ActionsModal
						onClose={ this.toggleActionModal }
						isOpen={ this.state.isActionsOpen }
						listId={ this.props.list._id }
					>
						<li onClick={ () => {
							this.setState({ isRenamingList: true });
							this.toggleActionModal();
							}}>Rename</li>
						<li onClick={ this.addCardToList }>Add card</li>
						<li onClick={ this.deleteList }>Delete</li>
					</ActionsModal>
					
					<CardsWrapper
					isCreatingCard={this.state.isCreatingCard}
					createCard={this.createCard}
					items={this.props.list.cards} />
				
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	lists: state.singleBoard.lists,
	isListDeleting: state.singleBoard.isListDeleting,
	listDeletingId: state.singleBoard.listDeletingId
	// selectedCard: state.singleCard,
});

export default connect(
	mapStateToProps,
	{ deleteList, renameList, createCard, selectCardById }
)(List);