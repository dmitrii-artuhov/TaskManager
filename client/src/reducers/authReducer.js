import { 
	// GLOBAL_LOADING,
	USER_LOADING,
	USER_LOADED,

	LOGIN_SUCCESS,
	REGISTER_SUCCESS,
	LOGOUT_SUCCESS,

	AUTH_ERROR
} from '../actions/types';

const initialState = {
	isAuthenticated: null,
	isLoading: false,
	// globalLoading: false,
	user: null
}

export default (state = initialState, action) => {
	switch (action.type) {
		// case GLOBAL_LOADING:
		// 	return {
		// 		...state,
		// 		globalLoading: true
		// 	}
		case USER_LOADING:
			return {
				...state,
				isLoading: true
			}
		case USER_LOADED:
		case LOGIN_SUCCESS:
			return {
				isAuthenticated: true,
				isLoading: false,
				// globalLoading: false,
				user: action.payload.user
			}
		case REGISTER_SUCCESS:
			return {
				...state,
				isLoading: false
			}
		case LOGOUT_SUCCESS:
		case AUTH_ERROR:
			return {
				isAuthenticated: false,
				isLoading: false,
				// globalLoading: false,
				user: null
			}
		
		default: 
			return state;
	}
}