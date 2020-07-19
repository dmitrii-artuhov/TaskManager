import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
// redux
import {
	// Drag and Drop
	switchCards,
	relocatedCards,

	loadList,
	deleteList,
	renameList,
	createCard
} from '../../actions/singleBoardActions';
import { selectCardById } from '../../actions/singleCardActions';

// components
import ActionsModal from '../ActionsModal/ActionsModal';
import CardsWrapper from '../CardsWrapper/CardsWrapper';
import { CSSTransition } from 'react-transition-group';
// Drag and Drop
import DropWrapper from '../DropWrapper/DropWrapper';

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
			// Drag and Drop
			dragEl: null,
			items: this.props.list.cards
		}
	}

	componentDidMount = () => {
		document.body.addEventListener('click', this.unshiftCard);
	}

	componentWillUnmount = () => {
		document.body.removeEventListener('click', this.unshiftCard);
	}

	componentDidUpdate = (prevProps) => {
		// check if card is being created or it is already created
		const { isCardCreating, cardCreatingListId, list } = this.props;

		if ((isCardCreating && isCardCreating !== prevProps.isCardCreating && cardCreatingListId === list._id)
				|| (!isCardCreating && isCardCreating !== prevProps.isCardCreating)) {
			this.setState({
				isCreatingCard: isCardCreating
			});
		}

		// update list (if a card from it has just been viewed in fullscreen)
		if (this.props.selectedCard !== prevProps.selectedCard && !this.props.selectedCard.meta.listId) {
			const { boardId, list } = this.props;
			this.props.loadList({ boardId, listId: list._id });
		}

		if (list.cards !== prevProps.list.cards) {
			this.setState({
				items: list.cards
			});
		}
	}

	// toggle actions menu
	toggleActionModal = () => {
		this.setState({
			isActionsOpen: !this.state.isActionsOpen
		});
	}

	// list
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
		// componentDidUpdate will add the card to the list
	}

	viewCard = (cardId) => {
		this.props.selectCardById({
			cardId,
			listId: this.props.list._id,
			boardId: this.props.boardId
		});
	}

	// Drag and Drop
	// save moveItem action result
	dragAndDrop = ({ type, cardItem = {} }) => {
		if (type === 'SWITCH') {
			this.props.switchCards({
				boardId: this.props.boardId,
				listId: this.props.list._id,
				lists: this.props.lists,
				cards: this.state.items
			});
		} else if (type === 'RELOCATE') {
			this.props.relocatedCards({
				boardId: this.props.boardId,
				listId: this.props.list._id,
				removeListId: cardItem.listId,
				lists: this.props.lists,
				cardItem
			});
		}
	}

	setDragElement = (dragEl) => {
		this.setState({
			dragEl
		});
	}

	// change list
	onDrop = ({ cardItem }) => {
		// determine if the card is on top of the same list it used to be
		if (cardItem.listId === this.props.list._id) return;
		this.dragAndDrop({ type: 'RELOCATE', cardItem });
	}

	// change placing inside a list
	moveItem = (el) => {
		// calc current 
		if (!this.state.dragEl) return;

		const itemIndex = this.state.items.findIndex((item) => item._id === this.state.dragEl._id);
		if (itemIndex === -1) return;

		const hoverIndex = this.state.items.findIndex((item) => item._id === el._id);

		// switch places
		const updatedItems = [...this.state.items];
		updatedItems.splice(itemIndex, 1);
		updatedItems.splice(hoverIndex, 0, this.state.dragEl);	
		this.setState({
			items: [...updatedItems]
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
						
					<CSSTransition
						in={this.state.isActionsOpen}
						timeout={200}
						classNames="list_action-animate"
						unmountOnExit
					>
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
					</CSSTransition>

					<DropWrapper onDrop={this.onDrop}>
						{ !this.state.items.length
						&& !this.state.isCreatingCard ? (
							<div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
								<img style={{ marginTop: '30px', height: '100px' }} src="/assets/imgs/empty.svg" alt="empty"/>
								<p style={{ textAlign: 'center', marginTop: '15px', fontSize: '12px' }}>No Data</p>
							</div>
						) : (
							<CardsWrapper
							// Drag and Drop
							dragAndDrop={this.dragAndDrop}
							moveItem={this.moveItem}
							setDragElement={this.setDragElement}
							// other
							listId={this.props.list._id}
							isCreatingCard={this.state.isCreatingCard}
							onCreate={this.createCard}
							onView={(cardId) => this.viewCard(cardId)}
							items={this.state.items}
							/>
						) }
					</DropWrapper>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = (state) => ({

	// lists
	lists: state.singleBoard.board.lists,
	isListDeleting: state.singleBoard.isListDeleting,
	listDeletingId: state.singleBoard.listDeletingId,
	// cards
	isCardCreating: state.singleBoard.isCardCreating,
	cardCreatingListId: state.singleBoard.cardCreatingListId,
	selectedCard: state.singleCard,
});

export default connect(
	mapStateToProps,
	{ 
		// Drag and Drop
		switchCards,
		relocatedCards,

		loadList,
		deleteList,
		renameList,
		createCard,
		selectCardById
	}
)(List);