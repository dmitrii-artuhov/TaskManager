import axios from 'axios';

// card
export const getCardById = ({ cardId, boardId }) => {
	return axios.post(`/api/cards/get/${cardId}`, { boardId });
}

export const createSingleCard = ({ body }) => {
	return axios.post('/api/cards/create', body);
}

export const updateCardById = ({ cardId, data }) => {
	return axios.put(`/api/cards/update/${cardId}`, { ...data });
}

export const deleteCardById = ({ cardId, listId, boardId }) => {
	return axios.delete(`/api/cards/delete/${cardId}`, { data: { listId, boardId } });
}

// checklist
export const addNewToDo = ({ cardId, boardId, todo }) => {
	return axios.post(`/api/cards/${cardId}/checklist/add`, { boardId, todo });
}

export const updateToDoById = ({ cardId, boardId, todoId }) => {
	return axios.put(`/api/cards/${cardId}/checklist/update`, { boardId, todoId });
}

export const deleteToDoById = ({ boardId, cardId, todoId }) => {
	return axios.delete(`/api/cards/${cardId}/checklist/delete`, { data: { boardId, todoId } });
}

// labels
export const addLabel = ({ boardId, cardId, label }) => {
	return axios.post(`/api/cards/${cardId}/labels/add`, { boardId, label });
}

export const deleteLabelById = ({ boardId, cardId, labelId }) => {
	return axios.delete(`/api/cards/${cardId}/labels/delete`, { data: { boardId, labelId } });
}

export const updateLabelById = ({ boardId, cardId, labelId, label }) => {
	return axios.put(`/api/cards/${cardId}/labels/update`, { boardId, labelId, label });
}

