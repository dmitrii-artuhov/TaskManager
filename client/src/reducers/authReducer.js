import { 
	USER_UPDATING,
	USER_UPDATED,

	USER_RETRIEVING,
	USER_RETRIEVED,

	USER_LOADING,
	USER_LOADED,

	LOGIN_SUCCESS,
	REGISTER_SUCCESS,
	LOGOUT_SUCCESS,

	AUTH_ERROR,

	TOGGLE_AUTH_MODAL
} from '../actions/types';

const initialState = {
	isAuthenticated: null,
	isLoading: false,
	isRetrieving: false,
	isUpdating: false,
	user: null,
	modal: {
		isOpen: false,
		type: null // LOGIN, REGISTER
	}
}

export default (state = initialState, action) => {
	switch (action.type) {
		case USER_UPDATING:
			return {
				...state,
				isUpdating: true
			}

		case USER_UPDATED:
			return {
				...state,
				isUpdating: false,
				user: {
					...state.user,
					//avatar: action.payload.avatar
					...action.payload.user
				}
			}

		case TOGGLE_AUTH_MODAL:
			return {
				...state,
				modal: {
					isOpen: action.payload.isOpen,
					type: action.payload.type
				}
			}

		case USER_RETRIEVING:
			return {
				...state,
				isRetrieving: true
			}

		case USER_RETRIEVED:
			return {
				...state,
				isAuthenticated: true,
				isRetrieving: false,
				user: action.payload.user
			}

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
				isRetrieving: false,
				user: null
			}
		
		default: 
			return state;
	}
}