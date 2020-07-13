import React, { Component } from 'react';
import Skeleton from "react-loading-skeleton";

// styles
import './CardTitleField.scss';

export default class CardTitleField extends Component {
	constructor(props) {
		super(props);

		this.state = {
			newCardTitle: '',
			title: ''
		}
	}

	componentDidUpdate = (prevProps) => {
		const { title } = this.props;
		if (title !== prevProps.title) {
			this.setState({
				newCardTitle: title,
				title
			});
		}
	}
	
	onSubmit = (e) => {
		e.preventDefault();
		const { newCardTitle } = this.state;
		// check for the filled title
		if (!newCardTitle) {
			return;
		}
		// prevent UI from flickering
		this.setState({
			title: newCardTitle
		});
		this.props.onSubmit({ title: newCardTitle });
		this.props.onBlur();
	}	

	inputTitle = (e) => {
		this.setState({
			newCardTitle: e.target.value
		});
	}

	onBlur = () => {
		this.props.onBlur();
		this.setState({
			newCardTitle: this.props.title
		});
	}

	render() {
		return (
			<div className="fullview__text-wrapper fullview__block fullview__title">
				<img src="/assets/imgs/title.svg" alt="title"/>
				{ !this.props.isUpdating ? (
					<h3>{ this.state.title ? this.state.title : <Skeleton height={30} /> }</h3>	
				) : (
					<form className="fullview__title-form" onSubmit={this.onSubmit}>
						<input 
							onBlur={this.onBlur}
							autoFocus
							className="card__input"
							type="text"
							value={ this.state.newCardTitle }
							onChange={this.inputTitle} />
					</form>
				) }		
			</div>
		)
	}
}
