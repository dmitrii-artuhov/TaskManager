import {
	getBoardById,
	updateBoardById,
	deleteBoardById
} from '../api/boards';

import {
	getListById,
	createSingleList,
	deleteListById,
	updateListById,
	// Drag and Drop
	switchCard,
	relocateCard
} from '../api/lists';
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

	// load list
	BOARD_LIST_LOADING,
	BOARD_LIST_LOADED,

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
	BOARD_CARD_CREATED,

	// Drag and Drop
	BOARD_CARD_DRAG_DROP_SWITCH,
	BOARD_CARD_DRAG_DROP_RELOCATE
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
			// window.location.replace('/');
			
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
			console.error(err);	
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
			console.error(err);
		});
}

// new list is being created
export const loadList = (data) => (dispatch) => {
	dispatch({
		type: BOARD_LIST_LOADING,
		payload: {
			id: data.listId
		}
	});

	getListById(data)
		.then(({ data }) => {
			dispatch({
				type: BOARD_LIST_LOADED,
				payload: {
					list: data.list
				}
			});
		})
		.catch((err) => {
			dispatch({ type: BOARD_LIST_FAIL });
			console.error(err);
		})
}

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
	dispatch({
		type: BOARD_CARD_CREATING,
		payload: {
			listId: body.listId
		}
	});

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
			console.error(err);
		});
} 

// Drag and Drop
// switch cards
export const switchCards = ({ boardId, listId, lists, cards }) => (dispatch) => {
	const afterSwitchLists = lists.map((list) => {
		if (list._id === listId) {
			list.cards = [...cards];
		}
		return list;
	});

	dispatch({
		type: BOARD_CARD_DRAG_DROP_SWITCH,
		payload: {
			lists: afterSwitchLists
		}
	});

	// axios
	switchCard({
		boardId,
		listId,
		cards
	})
		.catch((err) => {
			console.error(err);
		});
}

export const relocatedCards = ({ boardId, lists, removeListId, listId, cardItem }) => (dispatch) => {
	const afterRelocateLists = lists.map((list) => {
		// remove from the old spot
		if (list._id === removeListId) {
			const newCards = list.cards.filter((card) => card._id !== cardItem._id);
			list = { ...list, cards: [...newCards] };
		}
		// add to the new spot
		if (list._id === listId) {
			const newCardItem = { ...cardItem, listId }
			list = { ...list, cards: [...list.cards, newCardItem] }
		}
	
		return list;
	});

	dispatch({
		type: BOARD_CARD_DRAG_DROP_RELOCATE,
		payload: {
			lists: afterRelocateLists
		}
	});

	// axios
	relocateCard({
		boardId,
		from: removeListId,
		to: listId,
		cardId: cardItem._id
	})
		.catch((err) => {
			console.error(err);
		});
}