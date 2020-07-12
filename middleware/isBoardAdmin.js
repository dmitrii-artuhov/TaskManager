const Board = require('../models/Board');

module.exports = {
	checkBoardAdmin: (req, res, next) => {
		let { boardId } = req.body;
		if (!boardId) boardId = req.params.id; // for boards.js routes
		const { userId } = req; // extracted from passport (check auth.js middleware)

		Board.findById(boardId)
			.then((board) => {
				if (!board) {
					return res.status(404).json({ msg: 'Board not found' });
				}

				// check if requester is an admin of the board
				let isAdmin = false;
				board.participants.forEach((item) => {
					if (item.user == userId && item.role == 'admin') {
						isAdmin = true;
					}
				});

				if (!isAdmin) {
					return res.status(403).json({ msg: 'You do not possess required rights for this action' });
				}

				return next();
			})
			.catch((err) => {
				console.error(err);
			});
	}
}