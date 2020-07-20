import { updateUser } from '../api/users';
import { 
	USER_UPDATING,
	USER_UPDATED
} from '../actions/types';

// modal
export const updateAvatar = ({ id, avatar }) => (dispatch) => {
	// type = LOGIN, REGISTER
	dispatch({ type: USER_UPDATING });

	updateUser({ id, avatar })
		.then(({ data }) => {
			dispatch({
				type: USER_UPDATED,
				payload: {
					avatar: data.user.avatar
				}
			});
		})
		.catch((err) => {
			console.error(err.response);
		});
}