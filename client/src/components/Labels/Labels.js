import React, { Component, Fragment } from 'react';
import { addNewLabel, deleteLabelById } from '../../api/cards';

// components
import ColorPallete from '../ColorPallete/ColorPallete';
import Skeleton from "react-loading-skeleton";

// styles
import './Labels.scss';

export default class Labels extends Component {
	constructor(props) {
		super(props);

		this.state = {
			card: null,
			labels: [],
			label: {
				title: '',
				color: ''
			},
			palleteOpenId: -1
		}
	}

	componentDidMount = () => {
		// modal managment
		window.addEventListener('click', this.togglePalleteModal);
	}

	componentWillUnmount = () => {
		window.removeEventListener('click', this.togglePalleteModal);
	}

	componentDidUpdate = (prevProps) => {
		// check for card
		if (this.props.card !== prevProps.card) {
			this.setState({
				card: this.props.card,
				labels: this.props.card ? this.props.card.labels : []
			});
		}
	}

	//--- Pallete Modal
	togglePalleteModal = (e, id = -1) => {
		if (id === -1 && e) {
			if (e.target.closest('.color-pallete__modal') ||
					e.target.closest('.fullview__labels-bars-badge')) 
				return;
		}

		this.setState({
			palleteOpenId: id
		});
	}

	editLabel = (label) => {
		let { labels } = this.state;

		labels = labels.map((item) => {
			if (item._id === label._id) {
				item = label;
			}
			return item;
		});

		this.setState({
			labels
		});
	}

	addNewLabel = () => {
		const { boardId } = this.props;
		const cardId = this.state.card._id;


		addNewLabel({ boardId, cardId, label: { title: 'New label', color: '#3d3d3d' } })
			.then(({ data }) => {
				this.setState({
					card: data.card,
					labels: data.card.labels,
					label: {
						title: '',
						color: ''
					},
					palleteOpenId: -1
				});
			})
			.catch((err) => {
				console.log(err.response);
			})
	}

	deleteLabel = (labelId) => {
		const { card, boardId } = this.props;

		deleteLabelById({ cardId: card._id, boardId, labelId })
			.then(({ data }) => {
				this.setState({
					card: data.card,
					labels: data.card.labels,
					palleteOpenId: -1,
					label: {
						title: '',
						color: ''
					}
				});
			})
			.catch((err) => {
				console.error(err.response);
			});
	}

	render() {
		return (
			<Fragment>
					<div className="fullview__block fullview__labels">
						<img src="/assets/imgs/label.svg" alt="labels"/>
						<div className="fullview__text-wrapper fullview__labels-body">
							<h5>Labels</h5>
							<div className="fullview__labels-bars">
								{ !this.state.card ? <p><Skeleton height={60} /></p> : this.state.labels.length ? this.state.labels.map((item, index) => (
									<div
										className="fullview__labels-bars-wrapper"
										key={index}>
										<div
										onClick={ () => this.togglePalleteModal(null, index) }
										className="fullview__labels-bars-badge"
										style={{ background: item.color }}>
											{ item.title }
										</div>	
										<ColorPallete
										data={ { boardId: this.props.boardId, cardId: this.state.card._id } }
										label={item}
										onEdit={ this.editLabel }
										onDelete={ () => this.deleteLabel(item._id) }
										onClose={ () => this.togglePalleteModal(null, -1) }
										isOpen={ this.state.palleteOpenId === index } />
									</div>
								)) : <p>No labels</p> }
							</div>
						</div>
					</div>
			</Fragment>
		)
	}
}
