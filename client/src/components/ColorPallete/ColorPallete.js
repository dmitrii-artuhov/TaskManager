import React, { Component } from 'react';
import { colors } from './colors.json';

// styles
import './ColorPallete.scss';

export default class ColorPallete extends Component {
	constructor(props) {
		super(props);

		this.state = {
			label: null
		}
	}

	componentDidMount = () => {
		this.setState({
			label: this.props.label
		});
	}

	closeModal = (e) => {
		this.saveChanges();
		this.props.onClose();
	}

	onSubmit = (e) => {
		e.preventDefault();

		this.closeModal();
	}

	deleteLabel = () => {
		this.props.onDelete();
	}

	inputTitle = (e) => {
		this.setState({
			label: {
				...this.state.label,
				title: e.target.value
			}
		});

		this.applyChanges({ ...this.state.label, title: e.target.value });
	}

	setColor = (color) => {
		this.setState({
			label: {
				...this.state.label,
				color
			}
		});

		this.applyChanges({ ...this.state.label, color });
	}

	applyChanges = (label) => {
		this.props.onChange(label);
	}

	saveChanges = () => {
		this.props.onSave(this.state.label);
	}


	render() {
		return (
			this.props.isOpen ? (
				<div className={`color-pallete__modal color-pallete__modal-${this.state.label._id}`}>
					<div className="color-pallete__title">
						<form
							onSubmit={this.onSubmit}
						>
							<input
							autoFocus
							onChange={this.inputTitle}
							value={this.state.label.title}
							className="color-pallete__input"
							type="text"/>
						</form>
						<div
						onClick={ () => { this.closeModal(); } }
						className="color-pallete__close">
							<span></span>
							<span></span>
						</div>
					</div>
					<div className="color-pallete__pallete">
						{colors.map((color, index) => (
							<div
							key={index}
							style={ {background: color} }
							className="color-pallete__color"
							onClick={ () => this.setColor(color) }
							></div>
						))}
					</div>
					<ul className="color-pallete__actions">
						<li onClick={ this.deleteLabel } className="color-pallete__actions-item">Delete</li>
					</ul>
				</div>
			) : (
				null
			)
		)
	}
}
