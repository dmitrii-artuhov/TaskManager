// Socket IO
import socket from '../config/socket';

// enter a room (boardId is a room identifier)
export const enterBoardRoom = ({ roomId }) => {
	socket.emit('enter-board-room', { roomId });
}

// leave a room 
export const leaveBoardRoom = ({ roomId }) => {
	socket.emit('leave-board-room', { roomId });
}

// make others update the board
export const updateBoardRoom = ({ roomId }) => {
	socket.emit('update-board-room', { roomId });
}

// notify user 
export const notifyUser = (data) => {
	// data = { roomId, userId, info }
	socket.emit('notify-board-room-participant', data);
}

export const notifyAllUsers = (data) => {
	// data = { roomId, info }
	socket.emit('notify-board-room-all-participants', data);
}