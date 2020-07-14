import React, { Component, Fragment } from 'react';
import { Spinner } from 'react-bootstrap';

// styles
import './FullscreenLoader.scss';

export default class FullscreenLoader extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: this.props.isLoading
		}
	}

	componentDidUpdate = (prevProps) => {
		const { isLoading } = this.props;
		if (!isLoading && isLoading !== prevProps.isLoading) {
			setTimeout(() => {
				this.setState({
					isLoading
				});
			}, 1000);
		} else if (isLoading !== prevProps.isLoading) {
			this.setState({
				isLoading
			});
		}
	}

	render() {
		return (
			<Fragment>
				{ this.state.isLoading ? (
					<div className="fullscreen-loader">
						<div className="fullscreen-loader__wrapper">
							<img
							className="fullscreen-loader__cloud fullscreen-loader__cloud--small"
							src="/assets/icons/Cloud.svg"
							alt="Cloud"/>

							<img
							className="fullscreen-loader__cloud fullscreen-loader__cloud--big"
							src="/assets/icons/Cloud.svg"
							alt="Cloud"/>

							<img
							className="loading"
							src="/assets/icons/Loading.svg"
							alt="Loading"/>
						</div>
							<Spinner className="fullscreen-loader__spinner" animation="border" variant="primary" role="status">
								<span className="sr-only">Loading...</span>
							</Spinner>
					</div>
				) : (
					this.props.children
				) }
			</Fragment>
		)
	}
}
