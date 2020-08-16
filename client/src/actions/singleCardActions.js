// TYPES
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
} from './types';

// API
import {
	// card
	getCardById,
	updateCardById,
	deleteCardById,
	// labels
	addLabel,
	updateLabelById,
	deleteLabelById,
	// checklist
	addNewToDo,
	updateToDoById,
	deleteToDoById
} from '../api/cards';


// SOCKETS
import { updateBoardRoom } from '../sockets/boardSockets';


//------- CARD
// open card
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
// close card
export const unselectCard = ({ boardId }) => (dispatch) => {
	dispatch({ type: SINGLE_CARD_UNSELECTED });
	// make other users update their boards
	updateBoardRoom({ roomId: boardId });
}
// load card
export const loadSingleCard = ({ cardId, boardId }) => (dispatch) => {
	dispatch({ type: SINGLE_CARD_LOADING });

	getCardById({ cardId, boardId })
		.then(({ data }) => {
			dispatch({
				type: SINGLE_CARD_LOADED,
				payload: {
					card: data.card
				}
			});
		})
		.catch((err) => {
			dispatch({
				type: SINGLE_CARD_FAIL
			});
			console.error(err.response);
		});
}
// update card
export const updateSingleCard = (data) => (dispatch) => {
	dispatch({ type: SINGLE_CARD_UPDATING });
	updateCardById(data)
		.then(({ data }) => {
			dispatch({
				type: SINGLE_CARD_UPDATED,
				payload: {
					card: data.card
				}
			});
		})
		.catch((err) => {
			console.error(err.response);
		});
}
// delete card
export const deleteSingleCard = (data) => (dispatch) => {
	dispatch({ type: SINGLE_CARD_DELETING });

	deleteCardById(data)
		.then(({ data }) => {
			dispatch({ type: SINGLE_CARD_DELETED });
		})
		.catch((err) => {
			console.error(err.response);
		});
}

//-------- LABELS
// add label
export const addNewLabel = (data) => (dispatch) => {
	dispatch({ type: SINGLE_CARD_UPDATING });
	
	addLabel(data)
		.then(({ data }) => {

			dispatch({
				type: SINGLE_CARD_UPDATED,
				payload: {
					card: data.card
				}
			});
		})
		.catch((err) => {
			console.log(err.response);
		});
}

// update label
export const updateLabel = (data) => (dispatch) => {
	dispatch({ type: SINGLE_CARD_UPDATING });

	updateLabelById(data)
		.then(({ data }) => {
			dispatch({
				type: SINGLE_CARD_UPDATED,
				payload: {
					card: data.card
				}
			});
		})
		.catch((err) => {
			console.error(err.response);
		});
}

// delete label
export const deleteLabel = (data) => (dispatch) => {
	dispatch({ type: SINGLE_CARD_UPDATING });

	deleteLabelById(data)
		.then(({ data }) => {

			dispatch({
				type: SINGLE_CARD_UPDATED,
				payload: {
					card: data.card
				}
			});
		})
		.catch((err) => {
			console.error(err.response);
		});
}


//--------- CHECKLIST
// create todo
export const createTodo = (data) => (dispatch) => {
	dispatch({ type: SINGLE_CARD_UPDATING });
	dispatch({ type: SINGLE_CARD_TODO_CREATING });

	addNewToDo(data)
		.then(({ data }) => {
			dispatch({
				type: SINGLE_CARD_UPDATED,
				payload: {
					card: data.card
				}
			});
			dispatch({ type: SINGLE_CARD_TODO_CREATED });
		})
		.catch((err) => {
			console.error(err.response);
		});
}

// update todo
export const updateTodo = (data) => (dispatch) => {
	dispatch({ type: SINGLE_CARD_UPDATING });

	updateToDoById(data)
		.then(({ data }) => {
			dispatch({
				type: SINGLE_CARD_UPDATED,
				payload: {
					card: data.card
				}
			});
		})
		.catch((err) => {
			console.error(err.response);
		});
}

// delete todo
export const deleteTodo = (data) => (dispatch) => {
	dispatch({ type: SINGLE_CARD_UPDATING });

	deleteToDoById(data)
		.then(({ data }) => {
			dispatch({
				type: SINGLE_CARD_UPDATED,
				payload: {
					card: data.card
				}
			});
		})
		.catch((err) => {
			console.error(err.response);
		});
}