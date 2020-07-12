const Card = require('../models/Card');

module.exports = {
	checkLabelPresence: (req, res, next) => {
		let { labelId, cardId } = req.body;
		if (!labelId) labelId = req.params.labelId; // for cards.js routes
		if (!cardId) cardId = req.params.id || req.params.cardId; // for cards.js routes

		Card.findOne({ _id: cardId })
			.then((card) => {
				// check if label belongs to the card
				let labelBelongs = false;
				card.labels.forEach((item) => {
					if (item.toString() == labelId.toString()) labelBelongs = true;
				});

				if (!labelBelongs) {
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