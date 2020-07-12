import React, { Component } from 'react';
import { colors } from './colors.json';
import { updateLabelById } from '../../api/cards'; 

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
			label: this.props.label,
		});
	}
	componentDidUpdate = (prevProps) => {
		const { label } = this.props;
		if (label !== prevProps.label) {
			this.setState({
				label
			});
		}
	}

	closeModal = () => {
		this.props.onClose();
	}

	inputTitle = (e) => {
		this.setState({
			label: {
				...this.state.label,
				title: e.target.value
			}
		});

		this.editLabel({ ...this.state.label, title: e.target.value });
	}

	setColor = (color) => {
		this.setState({
			label: {
				...this.state.label,
				color
			}
		});

		this.updateLabel(null, { ...this.state.label, color });
	}

	editLabel = (label) => {
		this.props.onEdit(label);
	}

	updateLabel = (e, label) => {
		if (e) e.preventDefault();
		const { boardId, cardId } = this.props.data;


		updateLabelById({ boardId, cardId, labelId: label._id, label })
			.then(({ data }) => {
				this.editLabel(data.label);
			})
			.catch((err) => {
				console.error(err.response);
			});
	}

	deleteLabel = () => {
		this.props.onDelete();
	}

	render() {
		return (
			this.props.isOpen ? (
				<div className="color-pallete__modal">
					<div className="color-pallete__title">
						<form onSubmit={(e) => { this.updateLabel(e, this.state.label); this.closeModal(); }}>
							<input
							onBlur={() => this.updateLabel(null, this.state.label)}
							autoFocus
							onChange={(e) => { this.inputTitle(e); }}
							value={this.state.label.title}
							className="color-pallete__input"
							type="text"/>
						</form>
						<div onClick={ () => { this.editLabel(this.state.label); this.updateLabel(null, this.state.label); this.closeModal(); } } className="color-pallete__close">
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
							onClick={ () => { this.setColor(color); } }></div>
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
