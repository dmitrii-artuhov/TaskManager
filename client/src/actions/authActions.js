import { retrieveUser, registerUser, loginUser, logoutUser } from '../api/users';
import { returnMessages, clearMessages } from './messagesActions';
import { 
	// GLOBAL_LOADING,
	USER_LOADING,
	USER_LOADED,

	LOGIN_SUCCESS,
	REGISTER_SUCCESS,
	LOGOUT_SUCCESS,

	AUTH_ERROR
} from '../actions/types';

// Load user if possible (when page refreshed)
export const loadUser = () => (dispatch) => {
	// user is loading
	dispatch({ type: USER_LOADING });
	// dispatch({ type: GLOBAL_LOADING });

	// try to fetch user
	retrieveUser()
		.then((res) => {
			// user is retrieved
			dispatch({
				type: USER_LOADED,
				payload: {
					user:	res.data.user
				}
			})
			// console.log(res.data);
		})
		.catch((err) => {
			// session is empty, no authenticated user exists
			// passing down server error response
			// dispatch(returnMessages(err.response.data.msg, err.response.status, err.response.data.type));
			dispatch({
				type: AUTH_ERROR
			});
			// console.error('Axios Error:', err);
		});
}

// Register user
export const register = ({ email, password, username, usertag }) => (dispatch) => {
	// user is loading
	dispatch({ type: USER_LOADING	});

	// headers
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	}

	// API request

	const userCredencials = JSON.stringify({
		email,
		name: username,
		password,
		username: usertag
	});

	registerUser({ userCredencials, config })
		.then((res) => {
			// clearing old messages
			dispatch(clearMessages());
			// sending new message
			dispatch(returnMessages(res.data.msg, res.status, res.data.type));
			// user registered
			dispatch({
				type: REGISTER_SUCCESS
			});
			//console.log(res.data);
		})	
		.catch((err) => {
			// sending error message
			dispatch(returnMessages(err.response.data.msg, err.response.status, err.response.data.type));
			dispatch({
				type: AUTH_ERROR
			});
		});
}

// Login user
export const login = ({ email, password }) => (dispatch) => {
	// user is loading
	dispatch({ type: USER_LOADING });

	// headers
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	}

	// API request
	const userCredencials = JSON.stringify({
		email,
		password
	});

	// axios.post('/api/users/login', userCredencials, config)
	loginUser({ userCredencials, config })
		.then((res) => {
			// clearing old messages
			dispatch(clearMessages());
			// sending new message
			dispatch(returnMessages(res.data.msg, res.status, res.data.type));
			// user registered
			dispatch({
				type: LOGIN_SUCCESS,
				payload: {
					user: res.data.user
				}
			});
		})
		.catch((err) => {
			// sending error message
			if (err.response.data) {
				dispatch(returnMessages(err.response.data.msg, err.response.status, err.response.data.type));
			}
			dispatch({
				type: AUTH_ERROR
			});
		});
}

// Logout user
export const logout = () => (dispatch) => {
	// asking passport.js for logout
	logoutUser()
		.then(() => {
			dispatch(clearMessages());
			dispatch({
				type: LOGOUT_SUCCESS
			});
		})
		.catch((err) => {
			// sending error message
			dispatch(returnMessages(err.response.data.msg, err.response.status, err.response.data.type));
			dispatch({
				type: AUTH_ERROR
			});
		});
}