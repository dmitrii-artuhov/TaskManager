import React, { Component, Fragment } from 'react';

// styles
import './Intro.scss';

class Intro extends Component {
	render() {
		return (
			<Fragment>
				<div className="intro">
					<div className="intro__content">
						<div className="intro__todo-list">
							<ul>
								<li className="intro__todo-item">
									<div className="intro__checkbox">
										<img alt="img" src="/assets/imgs/check.png" />
									</div>
									<p>Manage your personal workflow</p>
								</li>
								<li className="intro__todo-item">
									<div className="intro__checkbox">
										<img alt="img" src="/assets/imgs/check.png" />
									</div>
									<p>Team up with friends</p>
								</li>
								<li className="intro__todo-item">
									<div className="intro__checkbox">
										<img alt="img" src="/assets/imgs/check.png" />
									</div>
									<p>Level up your productivity</p>
								</li>
							</ul>
						</div>
						<div className="intro__title">
							<h2>
								Create account and you will be able to manage tasks with ease!
							</h2>
						</div>
					</div>
					<img alt="img" className="intro__bg" src="/assets/imgs/Background.png" />
				</div>
			</Fragment>
		);
	}
}

export default Intro;
