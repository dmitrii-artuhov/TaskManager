import axios from 'axios';

export const retrieveUser = () => {
	return axios.get('/api/users/retrieve');
}

export const registerUser = ({ userCredencials, config }) => {
	return axios.post('/api/users/register', userCredencials, config);
}

export const loginUser = ({ userCredencials, config }) => {
	return axios.post('/api/users/login', userCredencials, config);
}

export const logoutUser = () => {
	return axios.get('/api/users/logout');
}

export const updateUser = ({ id, avatar }) => {
	return axios.put(`/api/users/update/${id}`, { avatar });
}