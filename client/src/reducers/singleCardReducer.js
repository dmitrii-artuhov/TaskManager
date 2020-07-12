import { SINGLE_CARD_SELECTED, SINGLE_CARD_UNSELECTED } from '../actions/types';

const initialState = {
	cardId: '',
	listId: '',
	boardId: ''
}

export default (state = initialState, action) => {
	switch (action.type) {
		case SINGLE_CARD_SELECTED:
			return {
				...state,
				cardId: action.payload.cardId,
				listId: action.payload.listId,
				boardId: action.payload.boardId,
			}

		case SINGLE_CARD_UNSELECTED:
			return {}
		
		default:
			return state;
	}
}