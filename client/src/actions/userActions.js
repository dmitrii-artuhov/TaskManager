import { updateUser, retrieveUser } from '../api/users';
import { 
	USER_UPDATING,
	USER_UPDATED,

	USER_LOADING,
	USER_LOADED
} from '../actions/types';

// modal
export const updateAvatar = ({ id, avatar }) => (dispatch) => {
	// type = LOGIN, REGISTER
	dispatch({ type: USER_UPDATING });

	console.log(id, avatar);

	updateUser({ id, avatar })
		.then(({ data }) => {
			console.log(data.user)

			dispatch({
				type: USER_UPDATED,
				payload: {
					user: {
						avatar: data.user.avatar
					}
				}
			});
		})
		.catch((err) => {
			console.error(err.response);
		});
}

export const updateUserLocally = (user) => (dispatch) => {
	console.log(user);

	dispatch({
		type: USER_UPDATED,
		payload: {
			user: {
				sharedBoards: [...user.sharedBoards]	
			}
		}
	});
}

export const loadUserInfo = () => (dispatch) => {
	dispatch({ type: USER_LOADING });

	retrieveUser()
		.then(({ data }) => {
			dispatch({
				type: USER_LOADED,
				payload: {
					user: data.user
				}
			});
		})
		.catch((err) => {
			console.error(err);
		});
}