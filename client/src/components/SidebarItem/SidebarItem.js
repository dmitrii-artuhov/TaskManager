import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';

/*
props:
	icon: url,
	onClick: function() {}
	title: ''
	className: '',
	alt: optional,
	tag: li|div,
	isLoading
*/

export default class SidebarItem extends Component {
	render() {
		return (
			this.props.tag === 'li' ? (
				<li
					onClick={ this.props.onClick }
					title={this.props.title}
					className={this.props.className}
				>
					{ this.props.isLoading ? (
						<Spinner animation="border" variant="white" role="status" style={ { width: 20, height: 20 } }>
							<span className="sr-only">Loading...</span>
						</Spinner>
					) : (
						<img
							alt={this.props.alt ? this.props.alt : 'item'}
							src={this.props.icon}
						/>
					) }
				</li>
			) : (
				<div
					onClick={ this.props.onClick }
					title={this.props.title}
					className={this.props.className}
				>
					{ this.props.isLoading ? (
						<Spinner animation="border" variant="white" role="status" style={ { width: 20, height: 20 } }>
							<span className="sr-only">Loading...</span>
						</Spinner>
					) : (
						<img
							alt={this.props.alt ? this.props.alt : 'item'}
							src={this.props.icon}
						/>
					) }
				</div>
			)
		)
	}
}
