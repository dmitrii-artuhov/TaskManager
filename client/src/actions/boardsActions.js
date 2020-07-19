import { getAllBoards, createSingleBoard } from '../api/boards';
import {
	BOARDS_LOADING,
	BOARDS_LOADED,
	BOARDS_FAIL,

	BOARD_CREATING,
	BOARD_CREATED
} from '../actions/types';

// load boards 
export const loadBoards = () => (dispatch) => {
	// boards are being loaded
	dispatch({ type: BOARDS_LOADING });

	getAllBoards()
		.then(({ data }) => {
			dispatch({
				type: BOARDS_LOADED,
				payload: {
					ownBoards: data.ownBoards,
					sharedBoards: data.sharedBoards
				}
			});
		})
		.catch((err) => {
			dispatch({ type: BOARDS_FAIL });
			console.error(err);
		});
}

// create a new board
export const createBoard = ({ title, backgroundURL }) => (dispatch) => {
	// board's being created
	dispatch({ type: BOARD_CREATING });

	if (!title) {
		// board title is required
		return;
	}

	// axios.post('/api/boards/create', { title })
	createSingleBoard({ title, backgroundURL })
		.then(({ data }) => {
			dispatch({
				type: BOARD_CREATED,
				payload: data.board
			});
		})
		.catch((err) => {
			dispatch({ type: BOARDS_FAIL });
			console.error(err.response);
		});
}
