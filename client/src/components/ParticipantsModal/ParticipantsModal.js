import React, { Component, Fragment } from 'react';
import Autocomplete from '../Autocomplete/Autocomplete';

// styles
import './ParticipantsModal.scss';

export default class ParticipantsModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpen: this.props.isOpen
		}
	}

	// modal
	componentDidMount = () => {
		document.body.addEventListener('click', this.toggleModalOuterBounds);
	}

	componentWillUnmount = () => {
		document.body.removeEventListener('click', this.toggleModalOuterBounds);
	}

	componentDidUpdate = (prevProps) => {
		// isOpen
		if (this.props.isOpen !== prevProps.isOpen) {
			this.setState({
				isOpen: this.props.isOpen
			});
		}
	}

	toggleModalOuterBounds = (e) => {
		if (this.state.isOpen && !e.target.closest('.participants-modal')) {
			this.closeModal();
		}
	}

	closeModal = () => {
		this.props.onClose();
	}

	// remove participant
	removeParticipant = (userId) => {
		this.props.onRemove(userId);
	}

	render() {
		return (
			<Fragment>
				<div className="participants-modal">
					<div className="participants-title">
						<h6>{this.props.title}</h6>
						<div onClick={ this.closeModal } className="participants-close">
							<span></span>
							<span></span>
						</div>
					</div>
					{ this.props.autoComplete ? (
						<Autocomplete
							onInvite={this.props.onInvite}
							isInvalid={this.props.isInvalid}
							items={this.props.items}
							onClose={this.closeModal}
						/>
					) : (
						<ul className="participants-users">
							{ this.props.items ? this.props.items.map((item) => 
								<li onClick={this.props.onClick} key={item.user._id}>
									<div className="participants-users__wrapper">
										<div className="participants-users__avatar">
											<img src={`/assets/avatars/${item.user.avatar}`} alt="avatar"/>
										</div>
										<div className="participants-users__name">
											{item.user.username}
										</div>
									</div>
									{ !this.props.autoComplete && item.user._id !== this.props.userId && (
										<div className="participants-users__cross">
											<img
											onClick={() => this.removeParticipant(item.user._id)}
											src="/assets/imgs/todo-cross.svg"
											alt="todo-cross"/>
										</div>
									) }
								</li>
							) : (
								null
							) }
						</ul>
					) }
				</div>
			</Fragment>
		)
	}
}
