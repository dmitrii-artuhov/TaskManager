import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

// actions
import { toggleModal, register } from '../../actions/authActions';
import { returnMessages, clearMessages } from '../../actions/messagesActions';

// components
import { 
	Modal,
	ModalHeader,
	ModalBody,
	NavLink,
	Form,
	FormGroup,
	Label, 
	Input,
	Alert,
	Badge
} from 'reactstrap';

import {
	Button,
	Spinner
} from 'react-bootstrap';

// styles
import './AuthForm.scss';


class RegisterModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpen: false,
			email: '',
			password: '',
			username: '',
			usertag: '',
			message: {
				msg: null,
				status: null,
				type: null
			},
			isLoading: false
		}
	}

	componentDidUpdate = (prevProps) => {
		// updating message output
		const { message } = this.props;
		if (message !== prevProps.message) {
			this.setState({
				message
			});
		}

		// updating isLoading property
		const { isLoading } = this.props;
		if (isLoading !== prevProps.isLoading) {
			this.setState({
				isLoading
			});
		}

		// modal
		const { modal } = this.props;
		if (modal && modal !== prevProps.modal) {
			this.setState({
				isOpen: modal.isOpen,
				type: modal.type 
			});
		}
	}

	toggleModal = () => {
		this.props.toggleModal({
			isOpen: !this.state.isOpen,
			type: 'REGISTER'
		});
		this.props.clearMessages();
		// this.setState({
		// 	isOpen: !this.state.isOpen
		// });
	}

	inputField = (e) => {
		this.props.clearMessages();
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	submitForm = (e) => {
		e.preventDefault();

		// simple validation
		const { email, username, password, usertag } = this.state;
		if (!email || !username || !password || !usertag || usertag[0] !== '@' || usertag.length === 1) {
			// send validation error to the alerting system
			const msg = 'Provide all fields with valid values', 
						status = 400,
						type = 'error';
			return this.props.returnMessages(msg, status, type);
		}

		// validation passed
		const newUser = {
			email,
			password,
			username,
			usertag
		}

		// calling redux action to register
		this.props.register(newUser);
	}

	render() {
		const highlightColor = this.state.message.type !== 'error' ? 'success' : 'danger';

		const closeBtn = (
			<button onClick={this.toggleModal} className="custom-modal__button">
				<span></span>
				<span></span>
			</button>
		);

		return (
			<Fragment>
				<NavLink onClick={this.toggleModal} className="navigation__button">
					Register
				</NavLink>
				<Modal className="custom-modal" isOpen={this.state.type === 'REGISTER' && this.state.isOpen} toggle={this.toggleModal}>
					<ModalHeader
					className="custom-modal__header"
					toggle={this.toggleModal}
					close={closeBtn}>
						Create your account {' '}
						{ this.state.isLoading ? <Spinner className="modal__spinner" as="span" size="sm" animation="border" variant="dark" /> : '' }
					</ModalHeader>
					<ModalBody className="custom-modal__body">
						<Form>
							{ this.state.message.msg ?
								<Alert className="modal__alert" color={highlightColor}>
									<p>{ this.state.message.msg }</p>
									<Badge className="ml-auto" color={highlightColor}>{ this.state.message.status }</Badge>
								</Alert>
							: null }
							<FormGroup className="custom-modal__field">
								<Label>Email:</Label>
								<Input onChange={this.inputField} type="email" name="email" />
							</FormGroup>
							<FormGroup className="custom-modal__field">
								<Label>Your name:</Label>
								<Input onChange={this.inputField} type="text" name="username" />
							</FormGroup>
							<FormGroup className="custom-modal__field">
								<Label>Password:</Label>
								<Input onChange={this.inputField} type="password" name="password" />
							</FormGroup>
							<FormGroup className="custom-modal__field">
								<Label>Username tag: (eg. @dopedude)</Label>
								<Input onChange={this.inputField} type="text" name="usertag" />
							</FormGroup>
							<FormGroup>	
								<Button className="main-button custom-modal__submit-button" onClick={this.submitForm} block variant="dark">Submit</Button>	
							</FormGroup>
						</Form>
					</ModalBody>
				</Modal>
			</Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	message: state.message,
	isLoading: state.auth.isLoading,
	modal: state.auth.modal
});

export default connect(
	mapStateToProps,
	{ register, clearMessages, returnMessages, toggleModal }
)(RegisterModal);
