import React, { Component, Fragment } from 'react';
import { deleteToDoById, updateToDoById, addNewToDo } from '../../api/cards';

// components
import Skeleton from "react-loading-skeleton";

// styles
import './Checklist.scss';

export default class Checklist extends Component {
	constructor(props) {
		super(props);

		this.state = {
			card: null,
			// checklist
			checklist: [],
			newChecklistItem: {
				title: '',
				checked: false
			},
			isAddingNewChecklistItem: false
		}
	}

	componentDidUpdate = (prevProps) => {
		// card
		const { card } = this.props;
		
		if (card !== prevProps.card) {
			this.setState({
				card,
				checklist: card.checklist
			});
		}
	}

	//--- ToDo
	// start editing new todo
	addNewToDo = () => {
		this.setState({
			isAddingNewChecklistItem: true
		});
	}

	// create new todo
	createNewTodo = (e) => {
		e.preventDefault();
		if (!this.state.newChecklistItem.title) 
			return;

		const { boardId } = this.props;
		const cardId = this.state.card._id;

		addNewToDo({ cardId, boardId, todo: this.state.newChecklistItem })
			.then(({ data }) => {
				this.setState({
					card: data.card,
					checklist: data.card.checklist,
					newChecklistItem: {
						title: '',
						checked: false
					},
					isAddingNewChecklistItem: false
				});
			})
			.catch((err) => {
				console.error(err.response);
			});
	}

	// toggle todo completed field 
	toggleToDo = (e, todoId) => {
		if (e.target.closest('.fullview__checklist-cross')) {
			return;
		}

		const { boardId } = this.props;
		const cardId = this.state.card._id;
	
		updateToDoById({ cardId, boardId, todoId })
			.then(({ data }) => {
				this.setState({
					card: data.card,
					checklist: data.card.checklist
				});
			})
			.catch((err) => {
				console.error(err.response);
			});
	}

	// delete selected todo
	deleteToDo = (todoId) => {		
		const { boardId } = this.props;
		const cardId = this.state.card._id;

		deleteToDoById({ boardId, cardId, todoId })
			.then(({ data }) => {
				this.setState({
					card: data.card,
					checklist: data.card.checklist
				});
			})
			.catch((err) => {
				console.error(err.response);
			});
	}

	// count completed dotos
	calcCompletedToDos = () => {
		if (!this.state.card || !this.state.card.checklist.length) {
			return 0;
		}

		let count = 0;
		this.state.checklist.map((todo) => todo.checked && count++);

		const percentage = Math.floor(count / this.state.card.checklist.length * 100);
		return percentage;
	}


	render() {
		return (
			<Fragment>
				<div className="fullview__checklist">
					{/* Title */}
					<div className="fullview__block">
						<img src="/assets/imgs/checklist.svg" alt="checklist"/>
						<div className="fullview__text-wrapper fullview__checklist-body">
							<h5>Checklist</h5>
							<div className="fullview__checklist-progress">
								<span>{`${this.calcCompletedToDos()}%`}</span>
								<div className="fullview__checklist-bar">
									<span style={ { width: this.calcCompletedToDos() + '%' } } ></span>
									<span></span>
								</div>
							</div>
						</div>
					</div>
					{/* ToDos */}
					<div className="fullview__checklist-todo">
						<ul>
							{ !this.state.card ? <Skeleton count={4} /> : this.state.card.checklist.map((item, index) => (
								<li 
									key={index}
									className={`fullview__checklist-item ${item.checked ?  'fullview__checklist-item--completed' : ''}`}
									onClick={ (e) => this.toggleToDo(e, item._id) }>
									<div className="fullview__checklist-text">
										<div className="fullview__checklist-toggle">
											<span></span>
											<span></span>
										</div>
										<p>{ item.title }</p>
									</div>
									<div className="fullview__checklist-cross">
										<img onClick={ () => this.deleteToDo(item._id) } src="/assets/imgs/todo-cross.svg" alt="todo-cross"/>
									</div>
								</li>
							)) }
							{/* New ToDo is being created */}
							{ this.state.isAddingNewChecklistItem ? (
								<li className="fullview__checklist-item">
									<div className="fullview__checklist-text">
										<div className="fullview__checklist-toggle">
											<span></span>
											<span></span>
										</div>
										<form style={ {width: '90%'} } onSubmit={ (e) => this.createNewTodo(e) }>
											<input
											onBlur={ () => this.setState({
												isAddingNewChecklistItem: false,
												newChecklistItem: { title: '' } }) }
											autoFocus
											className="card__input card__input-todo"
											type="text"
											value={ this.state.newChecklistItem.title }
											onChange={ (e) => this.setState({
												newChecklistItem: { title: e.target.value }
											}) } />
										</form>
									</div>
									<div className="fullview__checklist-cross">
										<img src="/assets/imgs/todo-cross.svg" alt="todo-cross"/>
									</div>
								</li>
							) : '' }
						</ul>
						<button onClick={ this.addNewToDo } className="fullview__checklist-add">
							Add
						</button>
					</div>
				</div>
			</Fragment>
		)
	}
}
