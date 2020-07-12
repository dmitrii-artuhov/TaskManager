const Board = require('../models/Board');

module.exports = {
	checkListPresence: (req, res, next) => {
		let { boardId, listId } = req.body;
		if (!listId) listId = req.params.id; // for lists.js routes

		// find board
		Board.findOne({ _id: boardId })
			.then((board) => {
				if (!board) {
					return res.status(404).json({ msg: 'Board not found' });
				}

				// find provided listID in the board
				let belongs = false;
				board.lists.forEach((item) => {
					if (item.toString() == listId.toString()) {
						belongs = true;
					}
				});
				// check if list belongs to the provided board
				if (!belongs) {
					return res.status(400).json({ msg: 'Board does not contain provided list' });
				}

				// list presents in the board
				next();
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ msg: 'Internal server error' });
			});
	}
}