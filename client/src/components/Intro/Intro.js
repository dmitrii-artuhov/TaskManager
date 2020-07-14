import React, { Component, Fragment } from 'react';

// styles
import './Intro.scss';

class Intro extends Component {
	render() {
		return (
			<Fragment>
				<div className="intro container">
					{/* Promo */}
					<div className="intro__promo">
						<div className="intro__promo-content">
							<div className="intro__promo-text">
								<h1>TaskManager App</h1>
								<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
								</p>
							</div>
							<div className="intro__promo-buttons">
								<button onClick={() => this.props.toggleModal({ type: 'LOGIN', isOpen: true })}>Login</button>
								<button onClick={() => this.props.toggleModal({ type: 'REGISTER', isOpen: true })}>Register</button>
							</div>
						</div>
						<div className="intro__promo-img">
							<img src="/assets/imgs/promo.svg" alt="promo"/>
						</div>
					</div>
					{/* Content */}
					<div className="intro__content">
						<div className="intro__content-block">
							<div className="intro__content-block-text">
								<h2>Manage your personal workflow</h2>
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
							</div>
							<div className="intro__content-block-img">
								<img src="/assets/imgs/workflow.svg" alt="workflow"/>
							</div>
						</div>
						<div className="intro__content-block">
							<div className="intro__content-block-text">
								<h2>Team up with friends</h2>
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
							</div>
							<div className="intro__content-block-img">
								<img src="/assets/imgs/team.svg" alt="team"/>
							</div>
						</div>
						<div className="intro__content-block">
							<div className="intro__content-block-text">
								<h2>Level up your productivity</h2>
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
							</div>
							<div className="intro__content-block-img">
								<img src="/assets/imgs/prod.svg" alt="productivity"/>
							</div>
						</div>
					</div>
				</div>
				{/* Footer */}
				<div className="footer">
					<div className="footer__wrapper container">
						<div className="footer-item">
							<h5>About</h5>
							<p>
							<span className="footer-item--bold">TaskManager</span> - lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
							</p>
						</div>
						<div className="footer-item">
						<h5>Contact</h5>
						<p>
						<span className="footer-item--bold">Creator</span> - Dmitrii Art
						</p>
						<div className="footer-item-icons">
							<ul>
								<a rel="noopener noreferrer" href="mailto:artuhovdmitrii@gmail.com" target="_blank">
									<li>
										<img src="/assets/imgs/gmail.svg" alt=""/>
									</li>
								</a>
								<a rel="noopener noreferrer" href="https://github.com/dmitrii-artuhov" target="_blank">
									<li>
										<img src="/assets/imgs/git.svg" alt=""/>
									</li>
								</a>
								<a rel="noopener noreferrer" href="https://t.me/dmitrii_artuhov" target="_blank">
									<li>
										<img src="/assets/imgs/telegram.svg" alt=""/>
									</li>
								</a>
							</ul>
						</div>
					</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default Intro;
