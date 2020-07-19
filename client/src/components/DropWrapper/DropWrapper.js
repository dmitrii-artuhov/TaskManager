import React, { Component } from 'react'

/*
props:
	onDrop: function() {},
	childred: Components,
*/

export default class DropWrapper extends Component {
	allowDrop = (e) => e.preventDefault();

	handleDrop = (e) => {
		const data = JSON.parse(e.dataTransfer.getData('CardItem')); // CardItem.js
		this.props.onDrop({ cardItem: data });
	}

	render() {
		return (
			<div
			onDragOver={this.allowDrop}
			onDrop={this.handleDrop}
			className="drop-wrapper">
				{this.props.children}
			</div>
		)
	}
}
