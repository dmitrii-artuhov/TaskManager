import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { unselectCard } from '../../actions/singleCardActions';

// components
import Skeleton from "react-loading-skeleton";
import Labels from '../Labels/Labels';
import Checklist from '../Checklist/Checklist';
import CardSidebar from '../CardSidebar/CardSidebar';
// API
import { getCardById, updateCardById, deleteCardById } from '../../api/cards';

// styles
import './Card.scss';

class Card extends Component {
	constructor(props) {
		super(props);

		this.Labels = React.createRef();

		this.state = {
			// redux
			cardId: '',
			listId: '',
			boardId: '',

			// card
			card: null,

			// title edit
			newCardTitle: '',
			isRenamingCard: false,

			// description edit
			isEditingDesc: false,
			newCardDesc: ''
		}
	}

	componentDidUpdate = (prevProps) => {
		// check for cardId
		const { cardId } = this.props;
		if (cardId !== prevProps.cardId) {
			this.setState({
				cardId
			});
		}

		// check for listId
		const { listId } = this.props;
		if (listId !== prevProps.listId) {
			this.setState({
				listId
			});
		}

		// check for boardId
		const { boardId } = this.props;
		if (boardId !== prevProps.boardId) {
			this.setState({
				boardId
			});
		}
	}
 
	componentDidMount = () => {
		const { cardId, boardId } = this.props;
		// retrieve selected card
		getCardById({ cardId, boardId })
			.then(({ data }) => {
				this.setState({
					card: data.card,

					newCardTitle: data.card.title,
					newCardDesc: data.card.description,

					checklist: data.card.checklist,

					labels: data.card.labels
				});
			})
			.catch((err) => {
				console.error(err.response);
			});
	}

	//--- Card
	// close the fullview card
	closeCard = () => {
		this.props.unselectCard();
	}
	// update card (title, desc, labels, checklist)
	updateCard = (e) => {
		if (e) e.preventDefault();

		const { newCardTitle, isRenamingCard, newCardDesc } = this.state;
		// check for the filled title
		if (!newCardTitle && isRenamingCard) {
			return;
		}
		
		const { boardId, cardId } = this.props;

		const data = {
			boardId,
			title: newCardTitle,
			description: newCardDesc
		}

		updateCardById({ cardId, data })
			.then(({ data }) => {
				const { card } = data;
				this.setState({
					card,
					checklist: card.checklist,

					isRenamingCard: false,
					isEditingDesc: false,
					isAddingNewChecklistItem: false,
					newChecklistItem: {
						title: ''
					}
				});
			})
			.catch((err) => {
				console.error(err.response);
			});
	}
	// delete the card (requires fixes)
	deleteCard = () => {
		const { cardId, listId, boardId } = this.props;

		deleteCardById({ cardId, listId, boardId })
			.then(() => {
				this.closeCard();
			})
			.catch((err) => {
				console.error(err.response);
			});
	}

	// mark card
	markCard = (status) => {
		const { cardId, boardId } = this.props;
		const data = {
			boardId,
			status
		}

		updateCardById({ cardId, data })
			.then(({ data }) => {
				this.setState({
					card: data.card
				});
			})
			.catch((err) => {
				console.error(err.response);
			})
	}

	render() {
		return ( 
			<Fragment>
				<div onClick={this.closeCard} className="overlay"></div>
				<div className="card-wrapper">
					<div className="fullview">
						<button onClick={this.closeCard} className="fullview__close custom-modal__button">
							<span></span>
							<span></span>
						</button>
						{/* content */}
						<div className="fullview__content">
							{/* title */}
							<div className="fullview__text-wrapper fullview__block fullview__title">
								<img src="/assets/imgs/title.svg" alt="title"/>
								{ !this.state.isRenamingCard ? (
									<h3>{ (this.state.card && this.state.card.title) || <Skeleton height={30} /> }</h3>	
								) : (
									<form onSubmit={ (e) => this.updateCard(e) }>
										<input onBlur={ () => this.setState({ isRenamingCard: false, newCardTitle: this.state.card.title }) } autoFocus className="card__input" type="text" value={ this.state.newCardTitle } onChange={ (e) => this.setState({ newCardTitle: e.target.value }) } />
									</form>
								) }		
							</div>
							{/* description */}
							<div className="fullview__block fullview__description">
								<img src="/assets/imgs/desc.svg" alt="desc"/>
								<div className="fullview__text-wrapper fullview__description-text">
									<h5>Description</h5>
									{ !this.state.isEditingDesc ? (
									<p>{ !this.state.card ? <Skeleton count={5} /> : this.state.card.description ? this.state.card.description : 'No description' }</p>
									) : (
										<form onSubmit={ (e) => this.updateCard(e) }>
											<textarea rows="5" autoFocus className="card__textarea" type="text" value={ this.state.newCardDesc } onChange={ (e) => this.setState({ newCardDesc: e.target.value }) } />
											<button type="submit" className="fullview__checklist-add">
												Done
											</button>
										</form>
									) }
								</div>
							</div>
							{/* labels */}
							<Labels
								ref={this.Labels}
								card={this.state.card}
								boardId={this.props.boardId}
								listId={this.props.listId}
							/>
							{/* checklist */}
							<Checklist
								card={this.state.card}
								boardId={this.props.boardId}
								listId={this.props.listId}
							/>
						</div>
						{/* sidebar */}
						<CardSidebar
							// controls 
							onTitleChange={() => this.setState({ isRenamingCard: !this.state.isRenamingCard })}
							onDescChange={() => this.setState({ isEditingDesc: !this.state.isEditingDesc })}
							onAddLabel={() => this.Labels.current.addNewLabel()}
							onCardDelete={() => this.deleteCard()}
							status={ this.state.card && this.state.card.status }

							// actions
							onCardMark={ (status) => this.markCard(status) }
						/>
					</div>
				</div>
			</Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
	cardId: state.singleCard.cardId,
	listId: state.singleCard.listId,
	boardId: state.singleCard.boardId
});

export default connect(
	mapStateToProps,
	{ unselectCard }
)(Card);
