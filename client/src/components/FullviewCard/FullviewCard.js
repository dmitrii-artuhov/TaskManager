import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
	// card
	unselectCard,
	loadSingleCard,
	updateSingleCard,
	deleteSingleCard,
	// labels
	addNewLabel,
	deleteLabel,
	updateLabel,
	// checklist
	createTodo,
	updateTodo,
	deleteTodo
} from '../../actions/singleCardActions';

// components
import Labels from '../Labels/Labels';
import Checklist from '../Checklist/Checklist';
import CardSidebar from '../CardSidebar/CardSidebar';
import CardTitleField from '../CardTitleField/CardTitleField';
import CardDescField from '../CardDescField/CardDescField';

// styles
import './FullviewCard.scss';

class FullviewCard extends Component {
	constructor(props) {
		super(props);

		this.Labels = React.createRef();

		this.state = {
			isRenaming: false,
			isChangingDesc: false
		}
	}

	componentDidMount = () => {
		// retrieve selected card
		const { meta } = this.props;
		const { cardId, boardId } = meta;
		this.props.loadSingleCard({ cardId, boardId });
	}

	// title
	renameCard = () => {
		this.setState({
			isRenaming: true
		});
	}

	stopRenaming = (e) => {
		if ((e && !e.target.closest('.fullview__title-form')) || !e) {
			this.setState({
				isRenaming: false
			});
		}
	}
	// description
	changeDesc = () => {
		this.setState({
			isChangingDesc: true
		});
	}

	stopChangingDesc = () => {
		this.setState({
			isChangingDesc: false
		});
	}

	// close fullview card
	closeCard = () => {
		this.props.unselectCard();
	}

	// update card 
	updateCard = (data) => {
		// data = { title, description, status }
		const { boardId, cardId } = this.props.meta;
		this.props.updateSingleCard({ cardId, data: { boardId, ...data } });
	}

	// delete card
	deleteCard = () => {
		const { cardId, listId, boardId } = this.props.meta;

		this.props.deleteSingleCard({ cardId, listId, boardId });
		this.closeCard();
	}

	// label
	addNewLabel = (label) => {
		const { cardId, boardId } = this.props.meta;
		this.props.addNewLabel({ cardId, boardId, label });
	}

	updateLabel = (label) => {
		const { boardId, cardId } = this.props.meta;
		this.props.updateLabel({ boardId, cardId, labelId: label._id, label });
	}

	deleteLabel = (labelId) => {
		const { cardId, boardId } = this.props.meta;
		this.props.deleteLabel({ cardId, boardId, labelId });
	}

	// checklist
	createTodo = (todo) => {
		const { boardId, cardId } = this.props.meta;
		this.props.createTodo({ cardId, boardId, todo });
	}

	updateTodo = (todoId) => {
		const { boardId, cardId } = this.props.meta;
		this.props.updateTodo({ cardId, boardId, todoId });
	}

	deleteTodo = (todoId) => {
		const { boardId, cardId } = this.props.meta;
		this.props.deleteTodo({ cardId, boardId, todoId });
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
							<CardTitleField
							isUpdating={this.state.isRenaming}
							onSubmit={this.updateCard}
							onBlur={this.stopRenaming}
							title={this.props.card.title} />

							{/* description */}
							<CardDescField
							loaded={Object.keys(this.props.card).length !== 0} // for the skeleton
							isUpdating={this.state.isChangingDesc}
							onSubmit={this.updateCard}
							onBlur={this.stopChangingDesc}
							description={this.props.card.description} />
							
							{/* labels */}
							<Labels
								ref={this.Labels}
								onAdd={this.addNewLabel}
								onUpdate={this.updateLabel}
								onDelete={(labelId) => this.deleteLabel(labelId)}
								items={this.props.card.labels}
							/>
							{/* checklist */}
							<Checklist
								items={this.props.card.checklist}
								onUpdate={this.updateTodo}
								onDelete={this.deleteTodo}
								onAdd={this.createTodo}
								isTodoCreating={this.props.isTodoCreating}
							/>
						</div>
						{/* sidebar */}
						<CardSidebar
							// controls
							onTitleChange={this.renameCard}
							onDescChange={this.changeDesc}
							onAddLabel={() => { !this.props.isUpdating && this.Labels.current.addNewLabel() }}
							onCardDelete={() => { !this.props.isUpdating && this.deleteCard() }}
							status={ this.props.card.status }

							// actions
							onCardMark={ (status) => this.updateCard({ status }) }
						/>
					</div>
				</div>
			</Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
	isLoading: state.singleCard.isLoading,
	isUpdating: state.singleCard.isUpdating,
	card: state.singleCard.card,
	isTodoCreating: state.singleCard.isTodoCreating
});

export default connect(
	mapStateToProps,
	{
		// card
		unselectCard,
		loadSingleCard,
		updateSingleCard,
		deleteSingleCard,
		// labels
		addNewLabel,
		updateLabel,
		deleteLabel,
		// checklist
		createTodo,
		updateTodo,
		deleteTodo
	}
)(FullviewCard);