const Board = require('../models/Board');

module.exports = {
	checkBoardParticipant: (req, res, next) => {
		let { boardId } = req.body;
		if (!boardId) boardId = req.params.id; // for boards.js routes
		const { userId } = req; // extracted from passport (check auth.js middleware)

		Board.findOne({ _id: boardId })
			.then((board) => {
				if (!board) {
					return res.status(404).json({ msg: 'Board not found' });
				}

				// check if requester is a participant of the board
				let isParticipant = false;
				board.participants.forEach((item) => {
					if (item.user == userId) {
						isParticipant = true;
					}
				});
	
				if (!isParticipant) {
					return res.status(403).json({ msg: 'You must own a board or participate in it' }) // forbidden
				}

				return next();
			})
			.catch((err) => {
				console.error(err);
			});
	}
}