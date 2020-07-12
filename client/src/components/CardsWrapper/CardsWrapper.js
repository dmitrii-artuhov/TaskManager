import React, { Component } from 'react';
import CardItem from '../CardItem/CardItem';
import NewCardItem from '../NewCardItem/NewCardItem';

export default class CardsWrapper extends Component {
	render() {
		return (
			<div className="list__cards">
				<ul>
					{ this.props.items
					?	this.props.items.map((card) => <CardItem key={card._id} card={card} />)
					: '' }

					{ this.props.isCreatingCard ? (
						<NewCardItem
							onSubmit={this.props.createCard}
						/>
					) : (
						''
					) }
				</ul>
			</div>
		)
	}
}

/*
if (!card.isCreating) {
	// regular cards
		<li 
			style={ { background: card.status === 'COMPLETED' ? '#D6FFF2' : card.status === 'FAILED' ? '#FFE6DB' : '' } }
			// onClick={ () => this.viewCard(card._id) }
			key={ index }
			className="list__card">
				<div className="list__meta">
					<span
					style={ { background: card.status === 'COMPLETED' ? '#5DE0B9' : card.status === 'FAILED' ? '#FC5151' : '' } }
					className="list__line"></span>

					{ card.status === 'OPEN' && (
						<div className="list__info">
							<ul>
								{ card.labels.map((label, index) => <li style={ { background: label.color } } key={index}></li>) }
							</ul>

							{ card.checklist.length ?
								(<div className="list__checklist">
									<span>{`${this.countCheckedToDos(card._id)}/${card.checklist.length}`}</span>
									<img alt="img" src="/assets/imgs/list.svg" /> 
								</div>)
								: '' }
						</div>
					) }

					{ card.status !== 'OPEN' && (	
						card.status === 'COMPLETED' ? (
							<div style={ {background: '#5DE0B9'} } className="list__status-button">
								<img src="/assets/imgs/status-tick.svg" alt="tick"/>
							</div>
						) : (
							<div style={ {background: '#FC5151'} } className="list__status-button">
								<img src="/assets/imgs/status-cross.svg" alt="cross"/>
							</div>
						)
					) }
				</div>
				<div className="list__content">
					<h6>{ card.title }</h6>
					<p>
						{ this.trimCardDescription(card.description) }
					</p>
				</div>
			</li>
}
else {
	return (
		<li key={ index } className="list__card">
			<div className="list__meta">
				<span className="list__line"></span>
				<div className="list__info">
					<ul>
					</ul>
				</div>
			</div>
			<div className="list__content">
				<form onSubmit={ (e) => { this.createCard(e); } }>
					<input
						onBlur={ this.unshiftCard }
						autoFocus
						className="list__card-input"
						type="text"
						value={ this.state.cardTitle }
						onChange={ (e) => this.setState({ cardTitle: e.target.value }) } />
				</form>
				<p>
					{ card.description }
				</p>
			</div>
		</li>
	);
}


*/