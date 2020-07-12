const Board = require('../models/Board');
const List = require('../models/List');

module.exports = {
	checkCardPresence: (req, res, next) => {
		let { boardId, listId, cardId } = req.body;
		if (!cardId) cardId = req.params.id || req.params.cardId; // for cards.js routes

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

				List.findOne({ _id: listId })
					.then((list) => {
						if (!list) {
							return res.status(404).json({ msg: 'List not found' });
						}

						// check if provided card belongs to the list
						let belongs = false;
						list.cards.forEach((item) => {
							if (item.toString() == cardId.toString()) belongs = true;
						});

						if (!belongs) {
							return res.status(400).json({ msg: 'List does not contain provided card' });
						}
						
						// card presents in the list
						next();
					})
					.catch((err) => {
						console.error(err);
						res.status(500).json({ msg: 'Internal server error' });
					});
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ msg: 'Internal server error' });
			});
	}
}