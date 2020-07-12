import React, { Component } from 'react';

// styles
import './CardItem.scss';

export default class CardItem extends Component {
	countCheckedToDos = () => {
		let count = 0;
		this.props.card.checklist.map((todo) => todo.checked && count++);

		return count;
	}
	
	trimCardDescription = (desc) => {
		if (!desc)
			return '';

		let trimmed = desc.split(' ').splice(0, 15).join(' ');
		
		if (desc.split(' ').length >= 15)
			trimmed += '...';

			return trimmed;
	}

	render() {
		return (
			<li 
			style={ { background: this.props.card.status === 'COMPLETED' ? '#D6FFF2' : this.props.card.status === 'FAILED' ? '#FFE6DB' : '' } }
			// onClick={ () => this.viewCard(card._id) }
			className="list__card">
				<div className="list__meta">
					<span
					style={ { background: this.props.card.status === 'COMPLETED' ? '#5DE0B9' : this.props.card.status === 'FAILED' ? '#FC5151' : '' } }
					className="list__line"></span>

					{ this.props.card.status === 'OPEN' && (
						<div className="list__info">
							<ul>
								{ this.props.card.labels.map((label, index) => <li style={ { background: label.color } } key={label._id}></li>) }
							</ul>

							{ this.props.card.checklist.length ?
								(<div className="list__checklist">
									<span>{`${this.countCheckedToDos(this.props.card._id)}/${this.props.card.checklist.length}`}</span>
									<img alt="img" src="/assets/imgs/list.svg" /> 
								</div>)
								: '' }
						</div>
					) }

					{ this.props.card.status !== 'OPEN' && (	
						this.props.card.status === 'COMPLETED' ? (
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
					<h6>{ this.props.card.title }</h6>
					<p>
						{ this.trimCardDescription(this.props.card.description) }
					</p>
				</div>
			</li>
		);
	}
}
