import {
	// remote changes
	SINGLE_BOARD_APPLYING_CHANGES,
	SINGLE_BOARD_APPLIED_CHANGES,

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

	//load list
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

	// participants
	BOARD_PARTICIPANT_DELETING,
	BOARD_PARTICIPANT_DELETED,
	BOARD_PARTICIPANTS_FOUND,
	BOARD_PARTICIPANTS_ADDED
} from '../actions/types';

const initialState = {
	// board
	board: {},
	isRemovingParticipant: false,
	isApplyingChanges: false,
	isRenamingTitle: false,
	isLoading: false,
	isDeleting: false,
	isFailed: false,
	
	// lists 
	isListLoading: false,
	listLoadingId: '',

	isListCreating: false,

	isListDeleting: false,
	listDeletingId: '',

	// cards
	isCardCreating: false,
	cardCreatingListId: '',

	// participants
	potentialParticipants: []
}

export default (state = initialState, action) => {
	switch (action.type) {
		// apply remote changes
		case SINGLE_BOARD_APPLYING_CHANGES:
			return {
				...state,
				isApplyingChanges: true
			}

		case SINGLE_BOARD_APPLIED_CHANGES:
			return {
				...state,
				isApplyingChanges: false,
				board: action.payload.board
			}

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
				isFailed: true,
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




		// load a list
		case BOARD_LIST_LOADING:
			return {
				...state,
				isListLoading: true,
				listLoadingId: action.payload.id
			}

		case BOARD_LIST_LOADED:
			let updatedBoard = state.board;
			updatedBoard.lists = updatedBoard.lists.map((list) => {
				if (list && list._id === action.payload.list._id) {
					list = action.payload.list;
				}
				return list;
			});
			
			return {
				...state,
				board: {...updatedBoard},
				isListLoading: false,
				listLoadingId: ''
			}

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
				isCardCreating: true,
				cardCreatingListId: action.payload.listId
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
				cardCreatingListId: '',
				board: { ...state.board, lists }
			}

		// Drag and Drop
		// Sitch cards
		case BOARD_CARD_DRAG_DROP_SWITCH:
			return {
				...state,
				board: { ...state.board, lists: [...action.payload.lists] }
			}

		case BOARD_CARD_DRAG_DROP_RELOCATE:
			return {
				...state,
				board: { ...state.board, lists: [...action.payload.lists] }
			}

		// Participants
		case BOARD_PARTICIPANT_DELETING: 
			return {
				...state,
				isRemovingParticipant: true
			}

		case BOARD_PARTICIPANT_DELETED: 
			return {
				...state,
				isRemovingParticipant: false,
				board: { ...action.payload.board }
			}

		case BOARD_PARTICIPANTS_FOUND:
			return {
				...state,
				potentialParticipants: [...action.payload.users]
			}

		case BOARD_PARTICIPANTS_ADDED:
			return {
				...state,
				board: { ...action.payload.board }
			}


		default:
			return state;
	}
}