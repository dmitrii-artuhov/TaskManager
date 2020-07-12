import {
	BOARDS_LOADING,
	BOARDS_LOADED,
	BOARDS_FAIL,
	
	BOARD_CREATING,
	BOARD_CREATED
} from '../actions/types';

const initialState = {
	ownBoards: [],
	sharedBoards: [],
	isLoading: false,
	isCreating: false
}

export default (state = initialState, action) => {
	switch (action.type) {
		case BOARDS_LOADING:
			return {
				...state,
				isLoading: true
			}

		case BOARDS_LOADED:
			return {
				...state,
				isLoading: false,
				ownBoards: action.payload.ownBoards,
				sharedBoards: action.payload.sharedBoards
			}

		case BOARDS_FAIL:
			return {
				...state,
				ownBoards: [],
				sharedBoards: [],
				isLoading: false
			}

		case BOARD_CREATING:
			return {
				...state,
				isCreating: true
			}
		
		case BOARD_CREATED:
			return {
				...state,
				isCreating: false,
				ownBoards: [...state.ownBoards, action.payload]
			}

		default:
			return state;
	}
}