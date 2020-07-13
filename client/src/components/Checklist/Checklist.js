import React, { Component, Fragment } from 'react';

// components
import Skeleton from "react-loading-skeleton";
import ChecklistItem from '../ChecklistItem/ChecklistItem';
import NewChecklistItem from '../NewChecklistItem/NewChecklistItem';

// styles
import './Checklist.scss';

export default class Checklist extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isAddingNewChecklistItem: false
		}
	}

	componentDidUpdate = (prevProps) => {
		const { isTodoCreating } = this.props;
		if (isTodoCreating !== prevProps.isTodoCreating) {
			this.setState({
				isAddingNewChecklistItem: isTodoCreating
			});
		}
	}

	// create new todo
	createTodo = (todo) => {
		this.props.onAdd(todo);
	}

	// toggle todo completed field 
	toggleToDo = (todoId) => {
		this.props.onUpdate(todoId);
	}

	// delete selected todo
	deleteToDo = (todoId) => {	
		this.props.onDelete(todoId);
	}

	// count completed dotos
	calcCompletedToDos = () => {
		if (!this.props.items || !this.props.items.length) {
			return 0;
		}

		let count = 0;
		this.props.items.map((todo) => todo.checked && count++);

		const percentage = Math.floor(count / this.props.items.length * 100);
		return percentage;
	}

	addItem = () => {
		this.setState({
			isAddingNewChecklistItem: true
		});
	}

	removeItem = () => {
		this.setState({
			isAddingNewChecklistItem: false
		});
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
							{ !this.props.items ? <Skeleton count={4} /> : this.props.items.map((todo) => (
								<ChecklistItem
								onToggle={this.toggleToDo}
								onDelete={this.deleteToDo}
								key={todo._id}
								todo={todo}
								/>
							)) }
							{/* New ToDo is being created */}
							{ this.state.isAddingNewChecklistItem ? (
								<NewChecklistItem
								onBlur={this.removeItem}
								onSubmit={this.createTodo}
								/>
							) : '' }
						</ul>
						<button
						onClick={this.addItem}
						className="fullview__checklist-add">
							Add
						</button>
					</div>
				</div>
			</Fragment>
		)
	}
}

/*
TODO
<li 
	key={index}
	className={`fullview__checklist-item ${todo.checked ?  'fullview__checklist-item--completed' : ''}`}
	onClick={ (e) => this.toggleToDo(e, todo._id) }>
	<div className="fullview__checklist-text">
		<div className="fullview__checklist-toggle">
			<span></span>
			<span></span>
		</div>
		<p>{ todo.title }</p>
	</div>
	<div className="fullview__checklist-cross">
		<img onClick={ () => this.deleteToDo(todo._id) } src="/assets/imgs/todo-cross.svg" alt="todo-cross"/>
	</div>
</li> 
*/