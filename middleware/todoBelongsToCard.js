const Card = require('../models/Card');

module.exports = {
	checkTodoPresence: (req, res, next) => {
		let { todoId, cardId } = req.body;
		if (!todoId) todoId = req.params.todoId; // for cards.js routes
		if (!cardId) cardId = req.params.id || req.params.cardId; // for cards.js routes

		Card.findOne({ _id: cardId })
			.then((card) => {
				// check if label belongs to the card
				let todoBelongs = false;
				card.checklist.forEach((item) => {
					if (item.toString() == todoId.toString()) todoBelongs = true;
				});

				if (!todoBelongs) {
					return res.status(400).json({ msg: 'Label does not belong to the card' });
				}

				next();
			})
			.catch((err) => {
				console.error(err);
				res.status(500).json({ msg: 'Internal server error' });
			});
	}
}