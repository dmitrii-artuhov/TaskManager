import axios from 'axios';

// remove participant from the board
export const removeParticipantById = (data) => {
	// data: { boardId, participantId }
	return axios.delete('/api/participants/delete', { data });
} 

// add participant to the board
export const addNewParticipantByUsername = (data) => {
	// data: { boardId, username }
	return axios.post('/api/participants/add', data);
}