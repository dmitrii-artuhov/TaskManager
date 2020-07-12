import React, { Component } from 'react';

// styles
import './Participants.scss';

export default class Participants extends Component {
	render() {
		return (
			<div className="board-info__meta-participants">
				<ul>
					<li>
						<div className="board-info__meta__user">
							<img src="/assets/imgs/user_avatar.png" alt="avatar" />
						</div>
					</li>
					<li>
						<div className="board-info__meta__user">
							<img src="/assets/imgs/user_avatar.png" alt="avatar" />
						</div>
					</li>
				</ul>
			</div>
		)
	}
}
