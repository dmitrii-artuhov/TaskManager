import axios from 'axios';


export const getAllBoards = () => {
	return axios.get('/api/boards/get');
}

export const createSingleBoard = ({ title }) => {
	return axios.post('/api/boards/create', { title });
}

export const getBoardById = ({ boardId }) => {
	return axios.get(`/api/boards/find/${boardId}`);
}

export const updateBoardById = ({ boardId, newTitle }) => {
	return axios.put(`/api/boards/update/${boardId}`, { title: newTitle })
}

export const deleteBoardById = ({ boardId }) => {
	return axios.delete(`/api/boards/delete/${boardId}`);
}