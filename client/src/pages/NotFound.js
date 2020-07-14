import React, { Component, Fragment } from 'react';
import Navigation from '../components/Navigation/Navigation';
import { Link } from 'react-router-dom';

class NotFound extends Component {
	render() {
		return (
			<Fragment>
				<Navigation link="/" linkTag="Home" />
				<div className="not-found">
					<div className="not-found__wrapper">
						<img
						className="not-found__cloud not-found__cloud--small"
						src="/assets/icons/Cloud.svg" 
						alt="Cloud"/>

						<img
						className="not-found__cloud not-found__cloud--big"
						src="/assets/icons/Cloud.svg"
						alt="Cloud"/>

						<img
						className="notfound"
						src="/assets/icons/404.svg"
						alt="Not Found - the page, as well as this  :/"/>
					</div>
					
					<Link to="/" className="not-found__button">Homepage</Link>
				</div>
			</Fragment>
		);
	}
}

export default NotFound;
