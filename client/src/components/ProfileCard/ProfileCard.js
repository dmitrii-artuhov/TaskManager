import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

// styles
import './ProfileCard.scss';

class ProfileCard extends Component {
	constructor(props) {
		super(props);

		this.state = {
			user: null
		}
	}

	componentDidMount = () => {
		this.setState({
			user: this.props.user
		});
	}

	componentDidUpdate = (prevProps) => {
		const { user } = this.props;
		if (user !== prevProps.user) {
			this.setState({
				user
			});
		}
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
									<li>{ this.state.user ? this.state.user.email : '' }</li>
								</ul>
							</div>
							<div className="profile-card__field">
								<ul>
									<li>Full Name:</li>
									<li>{ this.state.user ? this.state.user.name : '' }</li>
								</ul>
							</div>
							<div className="profile-card__field">
								<ul>
									<li>Usertag:</li>
									<li>{ this.state.user ? this.state.user.username : '' }</li>
								</ul>
							</div>
						</div>

						<hr />
						
						<div className="profile-card__boards">
							<h6>Boards</h6>
							<div className="profile-card__field">
								<ul>
									<li>Personal:</li>
									<li>{ this.state.user ? this.state.user.ownBoards.length : '' }</li>
								</ul>
							</div>
							<div className="profile-card__field">
								<ul>
									<li>Shared:</li>
									<li>{ this.state.user ? this.state.user.sharedBoards.length : '' }</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="profile-card__avatar">
						<div className="profile-card__circle">
							<img src="/assets/imgs/avatar.png" alt="avatar" />
						</div>

						<label htmlFor="avatar" className="main-button profile-card__button">
							Change
						</label>
						<input type="file" id="avatar" />
					</div>
				</div>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.auth.user
});

export default connect(
	mapStateToProps
)(ProfileCard);