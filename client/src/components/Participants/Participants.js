import React, { Component } from 'react';

// styles
import './Participants.scss';

/*
props:
	participants: []

*/

export default class Participants extends Component {
	render() {
		return (
			<div className="board-info__meta-participants">
				<ul>
					{this.props.participants ? this.props.participants.map((item) => (
						<li key={item.user._id}>
							<div className="board-info__meta__user">
								<img src={`/assets/avatars/${item.user.avatar}`} alt="avatar" />
							</div>

							<div className="board-info__meta-target">
								<span>{ item.user.name }</span>
							</div>
						</li>
					)) : (
						null
					)}
				</ul>
			</div>
		)
	}
}
