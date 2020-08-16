const enterBoard = (io, socket, data) => {
	const { roomId } = data;
	socket.join(roomId);	
}

const leaveBoard = (io, socket, data) => {
	const { roomId } = data;
	socket.leave(roomId);
}

const updateBoard = (io, socket, data) => {
	const { roomId } = data;
	socket.broadcast.to(roomId).emit('update-board');	
}

const notifyParticipant = (io, socket, data) => {
	// const { roomId, userId, username, info } = data;
	socket.broadcast.emit('notify-participant', data);
}

const notifyAllParticipants = (io, socket, data) => {
	// const { boardId, info } = data;
	socket.broadcast.emit('notify-all-participants', data);
}

module.exports = {
	enterBoard,
	leaveBoard,
	updateBoard,
	notifyParticipant,
	notifyAllParticipants
}
