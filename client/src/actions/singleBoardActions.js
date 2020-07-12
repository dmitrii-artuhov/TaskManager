import { getBoardById, updateBoardById, deleteBoardById } from '../api/boards';
import { createSingleList, deleteListById, updateListById } from '../api/lists';
import { createSingleCard } from '../api/cards';
import {
	// load board
	SINGLE_BOARD_LOADING,
	SINGLE_BOARD_LOADED,
	SINGLE_BOARD_FAIL,
	
	// rename single board
	SINGLE_BOARD_RENAMING,
	SINGLE_BOARD_RENAMED,

	// delete board
	SINGLE_BOARD_DELETING,
	SINGLE_BOARD_DELETED,

	// create list
	BOARD_LIST_CREATING,
	BOARD_LIST_CREATED,
	BOARD_LIST_FAIL,

	// delete list
	BOARD_LIST_DELETING,
	BOARD_LIST_DELETED,

	// rename list
	BOARD_LIST_RENAME,

	// cards
	BOARD_CARD_CREATING,
	BOARD_CARD_CREATED
} from './types';

// single board is loading
export const loadSingleBoard = (boardId) => (dispatch) => {
	// boards are being loaded
	dispatch({ type: SINGLE_BOARD_LOADING });

	getBoardById({ boardId })
		.then(({ data }) => {
			dispatch({
				type: SINGLE_BOARD_LOADED,
				payload: {
					board: data.board
				}
			});
		})
		.catch((err) => {
			console.error(err);
			window.location.replace('/');
			
			dispatch({ type: SINGLE_BOARD_FAIL });
		});
}
// rename board
export const startRenamingSingleBoard = () => (dispatch) => {
	dispatch({ type: SINGLE_BOARD_RENAMING });
}

export const renameSingleBoard = ({ boardId, newTitle }) => (dispatch) => {
	dispatch({
		type: SINGLE_BOARD_RENAMED,
		payload: {
			title: newTitle
		}
	});

	updateBoardById({ boardId, newTitle })
		.catch((err) => {
			console.error(err.response);	
		});
}

// delete board
export const deletingBoard = ({ boardId }) => (dispatch) => {
	dispatch({ type: SINGLE_BOARD_DELETING });

	deleteBoardById({ boardId })
		.then(() => {
			// redirect to homepage
			window.location.replace('/');
			dispatch({ type: SINGLE_BOARD_DELETED });
		})
		.catch((err) => {
			console.error(err.response);
		});
}



// new list is being created
export const createList = (body) => (dispatch) => {
	dispatch({ type: BOARD_LIST_CREATING });

	createSingleList({ body })
		.then(({ data }) => {
			dispatch({
				type: BOARD_LIST_CREATED,
				payload: {
					board: data.board
				}
			});
		})
		.catch((err) => {
			console.error(err);
			dispatch({ type: BOARD_LIST_FAIL });
		});
}

// delete a list
export const deleteList = ({ boardId, listId }) => (dispatch) => {
	dispatch({
		type: BOARD_LIST_DELETING,
		payload: {
			id: listId
		}
	});

	deleteListById({ listId, boardId })
		.then(({ data }) => {
			dispatch({
				type: BOARD_LIST_DELETED,
				payload: {
					board: data.board
				}
			});
		})
		.catch((err) => {
			dispatch({ type: BOARD_LIST_FAIL });
			console.error(err);
		});

	// dispatch({
	// 	type: BOARD_LIST_DELETE,
	// 	payload: {
	// 		id: listId
	// 	}
	// });

	// deleteListById({ listId, boardId })
	// 	.catch((err) => {
	// 		console.error(err);
	// 	});
}

// rename list
export const renameList = ({ boardId, listId, newTitle }) => (dispatch) => {
	dispatch({
		type: BOARD_LIST_RENAME,
		payload: {
			id: listId,
			title: newTitle
		}
	});

	updateListById({ listId, boardId, newTitle })
		.catch((err) => {
			console.error(err);
		});

}


// create a new card
export const createCard = (body) => (dispatch) => {
	dispatch({ type: BOARD_CARD_CREATING });

	createSingleCard({ body })
		.then(({ data }) => {
			dispatch({
				type: BOARD_CARD_CREATED,
				payload: {
					list: data.list
				}
			});
		})
		.catch((err) => {
			console.error(err.response);
		});
} 