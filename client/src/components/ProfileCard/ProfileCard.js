import React, { Component, Fragment } from 'react';

import AvatarsModal from '../AvatarsModal/AvatarsModal';
import { CSSTransition } from 'react-transition-group';
import { Spinner } from 'react-bootstrap';

// styles
import './ProfileCard.scss';

class ProfileCard extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isAvatarsOpen: false
		}
	}

	// toggle avatars modal
	toggleAvatarsModal = () => {
		this.setState({
			isAvatarsOpen: !this.state.isAvatarsOpen
		});
	}

	render() {
		return (
			<Fragment>
				<div className="container">
					<div className="profile-card">
					<div className="profile-card__info">
						<div className="profile-card__account">
							<h6>Personal information</h6>
							<div className="profile-card__field">
								<ul>
									<li>Email Address:</li>
									<li>{ this.props.user.email }</li>
								</ul>
							</div>
							<div className="profile-card__field">
								<ul>
									<li>Full Name:</li>
									<li>{ this.props.user.name }</li>
								</ul>
							</div>
							<div className="profile-card__field">
								<ul>
									<li>Usertag:</li>
									<li>{ this.props.user.username }</li>
								</ul>
							</div>
						</div>

						<hr />
						
						<div className="profile-card__boards">
							<h6>Boards</h6>
							<div className="profile-card__field">
								<ul>
									<li>Personal:</li>
									<li>{ this.props.user.ownBoards.length }</li>
								</ul>
							</div>
							<div className="profile-card__field">
								<ul>
									<li>Shared:</li>
									<li>{ this.props.user.sharedBoards.length }</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="profile-card__avatar">
						<div className="profile-card__circle">
							{ this.props.isUpdating && (
								<div className="profile-card__fade">
									<Spinner className="profile-card__loader" animation="border" variant="primary" role="status">
										<span className="sr-only">Loading...</span>
									</Spinner>
								</div>
							) }
							
							<img style={{height: 150, width: 150}} src={`/assets/avatars/${this.props.user && (this.props.user.avatar ? this.props.user.avatar : 'avataaar-1.svg')}`} alt="avatar" />
						</div>

						<button onClick={this.toggleAvatarsModal} className="main-button profile-card__button">
							Change
						</button>
						<CSSTransition
							in={this.state.isAvatarsOpen}
							timeout={200}
							classNames="avatars__modal-animate"
							unmountOnExit
						>
							<AvatarsModal
								userId={this.props.user._id}
								onUpdate={this.props.onUpdate}
								isOpen={this.state.isAvatarsOpen}
								onClose={this.toggleAvatarsModal}
							/>
						</CSSTransition>
					</div>
				</div>
				</div>
			</Fragment>
		);
	}
}


export default ProfileCard;