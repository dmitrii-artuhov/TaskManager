import axios from 'axios';

export const getListById = ({ listId, boardId }) => {
	return axios.post(`/api/lists/get/${listId}`, { boardId });
}

export const createSingleList = ({ body }) => {
	return axios.post('/api/lists/create', body);
} 

export const deleteListById = ({ listId, boardId }) => {
	return axios.delete(`/api/lists/delete/${listId}`, {
		data: { boardId }
	})
} 

export const updateListById = ({ listId, boardId, newTitle }) => {
	return axios.put(`/api/lists/update/${listId}`, {
		boardId,
		title: newTitle
	})
}

// Drag and Drop
export const switchCard = (data) => {
	// data = { boardId, listId, cards }
	return axios.post('/api/lists/switch', data);
}

export const relocateCard = (data) => {
	// data = { boardId, from, to, cardId }
	return axios.post('/api/lists/relocate', data);
}