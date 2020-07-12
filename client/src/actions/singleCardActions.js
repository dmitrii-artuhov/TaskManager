import { SINGLE_CARD_SELECTED, SINGLE_CARD_UNSELECTED } from './types';


export const selectCardById = ({ cardId, listId, boardId }) => (dispatch) => {
	dispatch({
		type: SINGLE_CARD_SELECTED,
		payload: {
			cardId,
			listId,
			boardId
		}
	});
}


export const unselectCard = () => (dispatch) => {
	dispatch({ type: SINGLE_CARD_UNSELECTED });
}