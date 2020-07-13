import React, { Component } from 'react';
import Skeleton from "react-loading-skeleton";

// styles
import './CardDescField.scss';

export default class CardDescField extends Component {
	constructor(props) {
		super(props);

		this.state = {
			newCardDesc: '',
			description: ''
		}
	}

	componentDidMount = () => {
		document.body.addEventListener('click', this.onBlur);
	}

	componentWillUnmount = () => {
		document.body.removeEventListener('click', this.onBlur);
	}

	componentDidUpdate = (prevProps) => {
		const { description } = this.props;
		if (description !== prevProps.description) {
			this.setState({
				newCardDesc: description,
				description
			});
		}
	}

	onSubmit = (e) => {
		e.preventDefault();
		const { newCardDesc } = this.state;

		// prevent UI from flickering
		this.setState({
			description: newCardDesc
		});

		this.props.onSubmit({ description: newCardDesc });
		this.props.onBlur();
	}

	inputDesc = (e) => {
		this.setState({
			newCardDesc: e.target.value
		});
	}

	onBlur = (e) => {
		if (e.target.closest('.card__textarea')
			|| e.target.closest('.fullview__checklist-add')) {
			return;
		}

		this.props.onBlur();
		this.setState({
			newCardDesc: this.props.description
		});
	}


	render() {
		return (
			<div className="fullview__block fullview__description">
				<img src="/assets/imgs/desc.svg" alt="desc"/>
				<div className="fullview__text-wrapper fullview__description-text">
					<h5>Description</h5>
					{ !this.props.isUpdating ? (
					<p>{ !this.props.loaded ? <Skeleton count={5} /> : (!this.state.description ? 'No description' : this.state.description) }</p>
					) : (
						<form className="fullview__description-form"
							onSubmit={this.onSubmit}>
							<textarea
							rows="5"
							autoFocus
							className="card__textarea"
							type="text"
							value={ this.state.newCardDesc }
							onChange={this.inputDesc} />
							<button type="submit" className="fullview__checklist-add">
								Done
							</button>
						</form>
					) }
				</div>
			</div>
		)
	}
}
