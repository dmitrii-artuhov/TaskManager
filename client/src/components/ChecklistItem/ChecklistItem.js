import React, { Component } from 'react'

export default class ChecklistItem extends Component {
	toggleToDo = (e) => {
		if (e.target.closest('.fullview__checklist-cross')) 
			return;
		this.props.onToggle(this.props.todo._id);
	}

	deleteToDo = () => {
		this.props.onDelete(this.props.todo._id);
	}

	render() {
		return (
			<li 
				className={`fullview__checklist-item ${this.props.todo.checked ?  'fullview__checklist-item--completed' : ''}`}
				onClick={ (e) => this.toggleToDo(e) }
				>
				<div className="fullview__checklist-text">
					<div className="fullview__checklist-toggle">
						<span></span>
						<span></span>
					</div>
					<p>{ this.props.todo.title }</p>
				</div>
				<div className="fullview__checklist-cross">
					<img
					onClick={this.deleteToDo}
					src="/assets/imgs/todo-cross.svg"
					alt="todo-cross"/>
				</div>
			</li>
		)
	}
}
