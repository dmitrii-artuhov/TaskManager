import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';

// styles
import './CustomInput.scss';


/*
props:
	placeholder: '',
	onSubmit: function() {},
	isLoading,
	className
*/

export default class CustomInput extends Component {
	constructor(props) {
		super(props);

		this.state = {
			value: ''
		}
	}

	onSubmit = (e) => {
		if (e) e.preventDefault();

		if (!this.state.value) 
			return;

		this.props.onSubmit(this.state.value);
		this.setState({
			value: ''
		});
	}

	inputValue = (e) => {
		this.setState({ value: e.target.value });
	}

	render() {
		return (
			// boards__create
			<div className={`custom-input ${this.props.className}`}>
				{/* boards__input-wrapper */}
				<div className="custom-input__wrapper">
					<form onSubmit={ this.onSubmit }>
						<input value={this.state.value} onChange={ this.inputValue } type="text" placeholder={this.props.placeholder} />
						{ this.props.isLoading ? (
							// boards__input-spinner
							<div className="custom-input__spinner">
								<Spinner animation="border" variant="white" role="status">
									<span className="sr-only">Loading...</span>
								</Spinner>
							</div>
						) : (
							<img onClick={ this.onSubmit } alt="img" src="/assets/imgs/plus-solid.png" />
						) }
					</form>
				</div>
			</div>
		)
	}
}
