import React, { Component } from 'react';
import CardItem from '../CardItem/CardItem';
import NewCardItem from '../NewCardItem/NewCardItem';

export default class CardsWrapper extends Component {
	render() {
		return (
			<div className="list__cards">
				<ul>
					{ this.props.items
					?	this.props.items.map((card) => 
						<CardItem
						// Drag and Drop
						dragAndDrop={this.props.dragAndDrop}
						moveItem={this.props.moveItem}
						setDragElement={this.props.setDragElement}
						// Content
						onClick={this.props.onView}
						key={card._id}
						card={card}
						/>)
					: '' }

					{ this.props.isCreatingCard ? (
						<NewCardItem
							onSubmit={this.props.onCreate}
						/>
					) : (
						''
					) }
				</ul>
			</div>
		)
	}
}
