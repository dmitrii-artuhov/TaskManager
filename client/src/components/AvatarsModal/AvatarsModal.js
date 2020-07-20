import React, { Component } from 'react';

import { avatars } from '../../static.json';

// styles
import './AvatarsModal.scss';

export default class AvatarsModal extends Component {
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
		if (this.state.isOpen && !e.target.closest('.avatars__modal')) {
			this.closeModal();
		}
	}

	closeModal = () => {
		this.props.onClose();
	}

	onUpdate = (avatar) => {
		this.props.onUpdate({ avatar, id: this.props.userId });
	}

	render() {
		return (
			<div className="avatars__modal">
				<div className="avatars__title">
					<h6>Avatars</h6>
					<div onClick={ this.closeModal } className="avatars__close">
						<span></span>
						<span></span>
					</div>
				</div>

				<div className="avatars__section">
					{avatars.map((name, index) => (
						<div
							onClick={() => this.onUpdate(name)}
							key={index}
							style={{ background: `url(/assets/avatars/${name})` }}
							className="avatars__section-face"
						></div>
					))}
				</div>
			</div>
		)
	}
}
