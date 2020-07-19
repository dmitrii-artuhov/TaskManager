import React, { Component, Fragment } from 'react';

// styles
import './ActionsModal.scss';

export default class ActionsModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpen: this.props.isOpen
		}
	}

	// action modal
	componentDidMount = () => {
		document.body.addEventListener('click', this.toggleActionModalOuterBounds);
	}

	componentWillUnmount = () => {
		document.body.removeEventListener('click', this.toggleActionModalOuterBounds);
	}

	componentDidUpdate = (prevProps) => {
		// isOpen
		if (this.props.isOpen !== prevProps.isOpen) {
			this.setState({
				isOpen: this.props.isOpen
			});
		}
	}

	toggleActionModalOuterBounds = (e) => {
		if (this.state.isOpen && !e.target.closest('.list__action-modal') && !e.target.closest(`.list__kebab-menu-${this.props.listId}`)) {

			this.closeModal();
		}
	}

	closeModal = () => {
		this.props.onClose();
	}

	render() {
		return (
			<Fragment>
				<div className="list__action-modal">
					<div className="list__action-title">
						<h6>Actions</h6>
						<div onClick={ this.closeModal } className="list__action-close">
							<span></span>
							<span></span>
						</div>
					</div>

					<ul className="list__action-commands">
						{ this.props.children }
					</ul>
				</div>
			</Fragment>
		)
	}
}
