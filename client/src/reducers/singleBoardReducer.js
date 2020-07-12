import {
	// load board
	SINGLE_BOARD_LOADING,
	SINGLE_BOARD_LOADED,
	SINGLE_BOARD_FAIL,

	// rename single board
	SINGLE_BOARD_RENAMING,
	SINGLE_BOARD_RENAMED,

	// delete single board
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
} from '../actions/types';

const initialState = {
	// board
	board: {},
	isRenamingTitle: false,
	isLoading: false,
	isDeleting: false,
	
	// lists 
	isListCreating: false,
	isListDeleting: false,
	listDeletingId: '',

	// cards
	isCardCreating: false
}

export default (state = initialState, action) => {
	switch (action.type) {
		// load single board
		case SINGLE_BOARD_LOADING:
			return {
				...state,
				isLoading: true
			}

		case SINGLE_BOARD_LOADED:
			return {
				...state,
				isLoading: false,
				board: action.payload.board
			}

		case SINGLE_BOARD_FAIL:
			return {
				...state,
				isLoading: false,
				board: {}
			}

		// rename single board
		case SINGLE_BOARD_RENAMING:
			return {
				...state,
				isRenamingTitle: true
			}

		case SINGLE_BOARD_RENAMED:
			return {
				...state,
				isRenamingTitle: false,
				board: {...state.board, title: action.payload.title}
			}

		// delete single board
		case SINGLE_BOARD_DELETING: 
			return {
				...state,
				isDeleting: true
			}

		case SINGLE_BOARD_DELETED: 
			return {
				...state,
				board: {}
			};






		// create a new list
		case BOARD_LIST_CREATING:
			return {
				...state,
				isListCreating: true
			}

		case BOARD_LIST_CREATED:
			return {
				...state,
				isListCreating: false,
				board: action.payload.board
			}

		case BOARD_LIST_FAIL:
			return {
				...state,
				isListCreating: false
			}
		
		// delete list
		case BOARD_LIST_DELETING:
			return {
				...state,
				isListDeleting: true,
				listDeletingId: action.payload.id
			}

		case BOARD_LIST_DELETED:
			return {
				...state,
				isListDeleting: false,
				listDeletingId: '',
				board: action.payload.board
			}

		// rename list
		case BOARD_LIST_RENAME:
			const renamedLists = state.board.lists.map((item) => {
				if (item._id === action.payload.id) {
					item.title = action.payload.title;
				}
				return item;
			});
			const board = { ...state.board, lists: renamedLists };
			return {
				...state,
				board
			}



		// create a new card
		case BOARD_CARD_CREATING: 
			return {
				...state,
				isCardCreating: true
			}

		case BOARD_CARD_CREATED:
			const lists = state.board.lists.map((list) => {
				if (list._id === action.payload.list._id) {
					list = action.payload.list;
				}
				return list;
			});

			return {
				...state,
				isCardCreating: false,
				board: { ...state.board, lists }
			}

		default:
			return state;
	}
}