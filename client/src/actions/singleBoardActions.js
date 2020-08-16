// API
import {
	getAllUsers
} from '../api/users';

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

import { removeParticipantById, addNewParticipantByUsername } from '../api/participants';

// TYPES
import {
	// remote changes applied
	SINGLE_BOARD_APPLYING_CHANGES,
	SINGLE_BOARD_APPLIED_CHANGES,

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
	BOARD_CARD_DRAG_DROP_RELOCATE,

	// remove participant
	BOARD_PARTICIPANT_DELETING,
	BOARD_PARTICIPANT_DELETED,
	BOARD_PARTICIPANTS_FOUND,
	BOARD_PARTICIPANTS_ADDED
} from './types';

// SOCKETS
import { updateBoardRoom, notifyUser, notifyAllUsers } from '../sockets/boardSockets';

// SOCKET IO
// update a board when other participants applied changes
export const applyRemoteChanges = ({ boardId }) => (dispatch) => {
	dispatch({ type: SINGLE_BOARD_APPLYING_CHANGES });

	getBoardById({ boardId })
		.then(({ data }) => {
			dispatch({
				type: SINGLE_BOARD_APPLIED_CHANGES,
				payload: {
					board: data.board
				}
			});
		})
		.catch((err) => {
			console.error(err);
		})
}

// BOARD
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
		.then(() => {
			// make other users update their boards
			updateBoardRoom({ roomId: boardId });
		})
		.catch((err) => {
			console.error(err);	
		});
}

// delete board
export const deletingBoard = ({ boardId }) => (dispatch) => {
	dispatch({ type: SINGLE_BOARD_DELETING });

	deleteBoardById({ boardId })
		.then(() => {
			// notify other board participants
			notifyAllUsers({
				boardId,
				info: {
					msg: 'Shared board has been deleted',
					redirect: '/',
					type: 'DELETE'
				}
			});
			// redirect to homepage
			window.location.replace('/');
			dispatch({ type: SINGLE_BOARD_DELETED });
		})
		.catch((err) => {
			console.error(err);
		});
}

// LISTS
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

// new list is being created
export const createList = (body) => (dispatch) => {
	dispatch({ type: BOARD_LIST_CREATING });

	createSingleList({ body })
		.then(({ data }) => {
			// make other users update their boards
			updateBoardRoom({ roomId: body.boardId });
			
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
			// make other users update their boards
			updateBoardRoom({ roomId: boardId });
			
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
		.then(() => {
			// make other users update their boards
			updateBoardRoom({ roomId: boardId });
		})
		.catch((err) => {
			console.error(err);
		});

}

// CARDS
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
			// make other users update their boards
			updateBoardRoom({ roomId: body.boardId });

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

// DRAG AND DROP
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
		.then(() => {
			// make other users update their boards
			updateBoardRoom({ roomId: boardId });
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
		.then(() => {
			// make other users update their boards
			updateBoardRoom({ roomId: boardId });
		})
		.catch((err) => {
			console.error(err);
		});
}

// PARTICIPANTS
export const removeParticipant = (data) => (dispatch) => {
	// data: { boardId, participantId }
	dispatch({ type: BOARD_PARTICIPANT_DELETING });

	removeParticipantById(data)
		.then((res) => {
			dispatch({
				type: BOARD_PARTICIPANT_DELETED,
				payload: {
					board: res.data.board
				}
			});

			// make other users update their boards
			updateBoardRoom({ roomId: data.boardId });

			// notify excluded participant
			notifyUser({
				roomId: data.boardId,
				userId: data.participantId,
				info: {
					msg: 'You were excluded from the board',
					redirect: '/',
					type: 'EXCLUDE',
					user: res.data.participant
				}
			});
		})
		.catch((err) => {
			console.error(err);
		});
}

export const inviteNewParticipant = (data) => (dispatch) => {
	addNewParticipantByUsername(data)
		.then((res) => {
			dispatch({
				type: BOARD_PARTICIPANTS_ADDED,
				payload: {
					board: res.data.board
				}
			});

			// make other users update their boards
			updateBoardRoom({ roomId: data.boardId });

			// notify included participant
			notifyUser({
				roomId: data.boardId,
				username: data.username,
				info: {
					msg: 'You were added to the board',
					type: 'INCLUDE',
					user: res.data.participant
				}
			});
		})
		.catch((err) => {
			console.error(err);
		});
}

export const findPotentialParticipants = () => (dispatch) => {
	getAllUsers()
		.then(({data}) => {
			dispatch({
				type: BOARD_PARTICIPANTS_FOUND,
				payload: {
					users: data.users
				}
			});
		})
		.catch((err) => {
			console.error(err);
		});
}