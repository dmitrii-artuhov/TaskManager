import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// styles
import './BoardPreview.scss';

/*
props:
	board: {board1}
*/

export default class BoardPreview extends Component {
	constructor(props) {
		super(props);

		this.state = {
			patternIndex: 0
		}
	}

	getBoardOwner = (participants) => {
		let owner = null;

		participants.forEach(({ user, role }, index) => {
			if (role === 'admin') {
				owner = participants[index];
			}
		});

		return owner;
	}

	render() {
		return (
			<Link
				to={`/board/${this.props.board._id}`}
				className="boards__board"
			>
				<div className="boards__info">
					<p>{ this.props.board.title }</p>
					<ul>
						<li>Owner: { this.getBoardOwner(this.props.board.participants).user.name }</li>
						<li>Active lists: { this.props.board.lists.length }</li>
						<li>Participants: { this.props.board.participants.length }</li>
					</ul>
				</div>
				<div className="boards__participants">
					<ul>
						{ this.props.board.participants.map((participant) => (
							<li key={ participant.user._id }>
								<div className="boards__user">
									<img src={`/assets/avatars/${participant.user.avatar}`} alt="avatar" />
								</div>

								<div className="target-box boards__user-target">
									<span>{ participant.user.name }</span>
								</div>
							</li>
						)) }
					</ul>
				</div>
			
				<div className="boards__overlay"></div>
				<img
					style={{zIndex: -2}}
					src={`/assets/backgrounds/${this.props.board.backgroundURL}`}
					alt="bg"
				/>
			</Link>
		);
	}
}
