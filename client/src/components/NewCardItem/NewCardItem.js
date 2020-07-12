import React, { Component } from 'react';

export default class NewCardItem extends Component {
	constructor(props) {
		super(props);

		this.state = {
			cardTitle: ''
		}
	}

	createCard = (e) => {
		e.preventDefault();
		if (!this.state.cardTitle) 
			return;

		this.props.onSubmit(this.state.cardTitle);
	}

	inputTitle = (e) => {
		this.setState({ cardTitle: e.target.value });
	}

	render() {
		return (
			<li className="list__card list__card-new">
				<div className="list__meta">
					<span className="list__line"></span>
					<div className="list__info">
						<ul></ul>
					</div>
				</div>
				<div className="list__content">
					<form onSubmit={ this.createCard }>
						<input
							onBlur={ this.unshiftCard }
							autoFocus
							className="list__card-input"
							type="text"
							value={ this.state.cardTitle }
							onChange={ this.inputTitle } />
					</form>
					<p></p>
				</div>
			</li>
		)
	}
}
