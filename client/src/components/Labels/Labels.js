import React, { Component, Fragment } from 'react';

// components
import ColorPallete from '../ColorPallete/ColorPallete';
import Skeleton from "react-loading-skeleton";

// styles
import './Labels.scss';

export default class Labels extends Component {
	constructor(props) {
		super(props);

		this.state = {
			items: [],
			palleteOpenId: -1
		}
	}

	componentDidMount = () => {
		// pallete modal
		document.body.addEventListener('click', this.togglePalleteModalOuter);

		this.setState({
			items: this.props.items
		});
	}

	componentWillUnmount = () => {
		document.body.removeEventListener('click', this.togglePalleteModalOuter);
	}

	componentDidUpdate = (prevProps) => {
		const { items } = this.props;
		if (items !== prevProps.items) {
			this.setState({
				items
			});
		}
	}

	togglePalleteModal = (id = -1) => {
		if (this.state.palleteOpenId !== -1) 
			this.refs[`pallete-${this.state.palleteOpenId}`].saveChanges();

		this.setState({
			palleteOpenId: id
		});
	}

	togglePalleteModalOuter = (e) => {
		if (e.target.closest('.fullview__labels-bars-badge') || e.target.closest('.color-pallete__modal')) 
			return;

		if (this.state.palleteOpenId !== -1) 
			this.refs[`pallete-${this.state.palleteOpenId}`].saveChanges();

		this.setState({
			palleteOpenId: -1
		});
	}

	addNewLabel = () => {
		const defaultLabel = {
			title: 'New label',
			color: '#3d3d3d'
		}

		this.props.onAdd(defaultLabel);
	}

	applyChangesToLabel = (updatedLabel) => {
		const newItems = this.state.items.map((label) => {
			if (label._id === updatedLabel._id) {
				label = updatedLabel;
			}
			return label;
		})

		this.setState({
			items: newItems
		});
	}

	updateLabel = (updatedLabel) => {
		this.props.onUpdate(updatedLabel);
	}

	deleteLabel = (labelId) => {
		this.setState({
			palleteOpenId: -1
		});
		this.props.onDelete(labelId);
	}

	render() {
		return (
			<Fragment>
					<div className="fullview__block fullview__labels">
						<img src="/assets/imgs/label.svg" alt="labels"/>
						<div className="fullview__text-wrapper fullview__labels-body">
							<h5>Labels</h5>
							<div className="fullview__labels-bars">
								{ !this.state.items ? <p><Skeleton height={60} /></p> : this.state.items.length ? this.state.items.map((label, index) => (
									<div
										className="fullview__labels-bars-wrapper"
										key={label._id}>
										<div
										onClick={ () => this.togglePalleteModal(index) }
										className={`fullview__labels-bars-badge fullview__labels-bars-badge-${label._id}`}
										style={{ background: label.color }}>
											{ label.title }
										</div>
										<ColorPallete
										ref={`pallete-${index}`}
										label={label}
										onSave={(updatedLabel) => this.updateLabel(updatedLabel)}
										onChange={(updatedLabel) => this.applyChangesToLabel(updatedLabel)}
										onDelete={ () => this.deleteLabel(label._id) }
										onClose={ () => this.togglePalleteModal() }
										isOpen={ this.state.palleteOpenId === index }
										/>
									</div>
								)) : <p>No labels</p> }
							</div>
						</div>
					</div>
			</Fragment>
		)
	}
}
