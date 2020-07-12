import { GET_MESSAGES, CLEAR_MESSAGES } from '../actions/types';

const initialState = {
	msg: null,
	status: null,
	type: null
}

export default (state = initialState, action) => {
	switch (action.type) {
		case GET_MESSAGES:
			return {
				msg: action.payload.msg,
				status: action.payload.status,
				type: action.payload.type
			}
		case CLEAR_MESSAGES:
			return {
				msg: null,
				status: null,
				type: null
			}
		default:
			return state;
	}
}