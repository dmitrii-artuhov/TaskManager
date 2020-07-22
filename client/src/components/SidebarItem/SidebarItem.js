import React, { Component, Fragment } from 'react';
import { Spinner } from 'react-bootstrap';

// components
import ParticipantsModal from '../ParticipantsModal/ParticipantsModal';
import { CSSTransition } from 'react-transition-group';

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
	constructor(props) {
		super(props);

		this.state = {
			isOpen: false
		}
	}

	toggleModal = () => {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}

	onClick = () => {
		if (typeof this.props.onClick === 'function') {
			this.props.onClick();
			return;
		}
		this.toggleModal();
	}

	render() {
		return (
			<Fragment>
				{this.props.tag === 'li' ? (
					<li
						onClick={ this.onClick }
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
				)}
				{ this.props.modal ? (
					<CSSTransition
						in={this.state.isOpen}
						timeout={200}
						classNames="participants-animate"
						unmountOnExit
					>
						<ParticipantsModal
							onClose={ this.toggleModal }
							isOpen={ this.state.isOpen }
							title={this.props.modal.title}
							autoComplete={this.props.modal.autoComplete}
							items={this.props.modal.items}
							onClick={this.props.onClick}
						/>
					</CSSTransition>
				) : (
					null
				) }
			</Fragment>
		)
	}
}
