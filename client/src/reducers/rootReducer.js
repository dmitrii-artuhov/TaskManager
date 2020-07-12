import { combineReducers } from 'redux';
import authReducer from './authReducer';
import messagesReducer from './messagesReducer';
import boardsReducer from './boardsReducer';
import singleBoardReducer from './singleBoardReducer';
import singleCardReducer from './singleCardReducer';

export default combineReducers({
	auth: authReducer,
	message: messagesReducer,
	boards: boardsReducer,
	singleBoard: singleBoardReducer,
	singleCard: singleCardReducer
});