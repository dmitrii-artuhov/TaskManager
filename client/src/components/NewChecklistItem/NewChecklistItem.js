import React, { Component } from 'react'

export default class NewChecklistItem extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: ''
		}
	}

	inputTitle = (e) => {
		this.setState({
			title: e.target.value 
		});
	}

	removeItem = () => {
		this.props.onBlur();
	}

	onSubmit = (e) => {
		e.preventDefault();
		// submit default todo
		this.props.onSubmit({ title: this.state.title, checked: false });
	}

	render() {
		return (
			<li className="fullview__checklist-item">
				<div className="fullview__checklist-text">
					<div className="fullview__checklist-toggle">
						<span></span>
						<span></span>
					</div>
					<form
					style={ {width: '90%'} }
					onSubmit={this.onSubmit}
					>
						<input
						onBlur={this.removeItem}
						autoFocus
						className="card__input card__input-todo"
						type="text"
						value={this.state.title}
						onChange={this.inputTitle} />
					</form>
				</div>
				<div className="fullview__checklist-cross">
					<img src="/assets/imgs/todo-cross.svg" alt="todo-cross"/>
				</div>
			</li>
		)
	}
}
