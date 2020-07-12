import React, { Component, Fragment } from 'react';

// styles
import './CardSidebar.scss';

export default class CardSidebar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			statuses: {
				open: 'OPEN',
				failed: 'FAILED',
				completed: 'COMPLETED'
			}
		}
	}

	render() {
		const { status } = this.props;
		const { statuses } = this.state;

		return (
			<Fragment>
				<div className={`fullview__sidebar ${status === statuses.open && 'fullview__sidebar--open'} ${status === statuses.completed && 'fullview__sidebar--completed'} ${status === statuses.failed && 'fullview__sidebar--failed'}`}>
					<div className="fullview__sidebar-menu">
						<h6>Controls</h6>
						<button
							onClick={this.props.onTitleChange}
							className="fullview__sidebar-button"
						>Edit title</button>
						<button
							onClick={this.props.onDescChange}
							className="fullview__sidebar-button"
						>Edit description</button>
						<button
							onClick={this.props.onAddLabel} 
							className="fullview__sidebar-button">Add label</button>
						<button
						onClick={this.props.onCardDelete} 
						className="fullview__sidebar-button"
						>Delete card</button>
					</div>
					<div className="fullview__sidebar-menu">
						<h6>Actions</h6>
						<button
							onClick={ () => this.props.onCardMark(this.state.statuses.completed) }
							className="fullview__sidebar-button"
						>Mark as completed</button>
						<button
							onClick={ () => this.props.onCardMark(this.state.statuses.failed) }
							className="fullview__sidebar-button"
						>Mark as failed</button>
						<button
							onClick={ () => this.props.onCardMark(this.state.statuses.open) }
							className="fullview__sidebar-button"
						>Unmark</button>
					</div>
				</div>
			</Fragment>
		)
	}
}
