import { 
	GET_MESSAGES,
	CLEAR_MESSAGES
} from './types';

// return errors
export const returnMessages = (msg, status, type) => {
	return {
		type: GET_MESSAGES,
		payload: {
			msg,
			status,
			type
		}
	}
}

// clear errors
export const clearMessages = () => {
	return {
		type: CLEAR_MESSAGES
	}
}
