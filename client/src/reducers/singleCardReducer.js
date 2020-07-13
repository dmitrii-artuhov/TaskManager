import {
	SINGLE_CARD_SELECTED,
	SINGLE_CARD_UNSELECTED,

	SINGLE_CARD_LOADING,
	SINGLE_CARD_FAIL,
	SINGLE_CARD_LOADED,
	
	SINGLE_CARD_UPDATING,
	SINGLE_CARD_UPDATED,

	SINGLE_CARD_DELETING,
	SINGLE_CARD_DELETED,

	SINGLE_CARD_TODO_CREATING,
	SINGLE_CARD_TODO_CREATED
} from '../actions/types';

const initialState = {
	isLoading: false,
	isUpdating: false,
	isDeleting: false,
	isTodoCreating: false,
	meta: {
		cardId: '',
		listId: '',
		boardId: ''
	},
	card: {}
}

export default (state = initialState, action) => {
	switch (action.type) {
		case SINGLE_CARD_SELECTED:
			return {
				...state,
				meta: {
					cardId: action.payload.cardId,
					listId: action.payload.listId,
					boardId: action.payload.boardId
				}
			}

		case SINGLE_CARD_UNSELECTED:
			return {
				...state,
				isLoading: false,
				isUpdating: false,
				meta: {
					cardId: '',
					listId: '',
					boardId: ''
				},
				card: {}
			}

		case SINGLE_CARD_LOADING:
			return {
				...state,
				isLoading: true
			}

		case SINGLE_CARD_FAIL:
			return {
				...state,
				isLoading: false
			}

		case SINGLE_CARD_LOADED:
			return {
				...state,
				isLoading: false,
				card: action.payload.card
			}

		case SINGLE_CARD_UPDATING:
			return {
				...state,
				isUpdating: true
			}

		case SINGLE_CARD_UPDATED:
			return {
				...state,
				isUpdating: false,
				card: action.payload.card
			}

		case SINGLE_CARD_DELETING:
			return {
				...state,
				isDeleting: true
			}

		case SINGLE_CARD_DELETED:
			return {
				...state,
				isDeleting: false,
				meta: {
					cardId: '',
					listId: '',
					boardId: ''
				},
				card: {}
			}

		case SINGLE_CARD_TODO_CREATING:
			return {
				...state,
				isTodoCreating: true
			}
	
		case SINGLE_CARD_TODO_CREATED:
			return {
				...state,
				isTodoCreating: false
			}

		default:
			return state;
	}
}