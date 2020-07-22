const express = require('express');
const router = express.Router();
// models
const Board = require('../../models/Board');
const User = require('../../models/User');
const List = require('../../models/List');
const Card = require('../../models/Card');
// middleware
const auth = require('../../middleware/auth');
const isBoardAdmin = require('../../middleware/isBoardAdmin');
const isBoardParticipant = require('../../middleware/isBoardParticipant');
const listBelongsToBoard = require('../../middleware/listBelongsToBoard');

// get all lists for the particular board
router.get('/get', auth.ensureAuthentication, isBoardParticipant.checkBoardParticipant, (req, res) => {
	const { boardId } = req.body;

	if (!boardId) {
		return res.status(400).json({ mag: 'Provide all fields' });
	}

	Board.findOne({ _id: boardId })
		.populate({
			path: 'lists',
			populate: {
				path: 'cards',
				model: 'Card'
			}
		})
		.exec((err, board) => {
			if (err) {
				console.error(err);	
				return res.status(500).json({ msg: 'Internal server error' });
			}

			if (!board) {
				return res.status(404).json({ msg: 'Board not found' });
			}

			res.json({
				lists: board.lists
			});
		});
});

// get single list
router.post('/get/:id', auth.ensureAuthentication, isBoardParticipant.checkBoardParticipant, (req, res) => {
	const { boardId } = req.body;
	const { id } = req.params;

	List.findById(id)
		.populate('cards')
		.exec((err, list) => {
			if (err) {
				console.error('Error while getting a single list', err);
				return res.status(500).json({ msg: 'Internal server error' });
			}

			res.json({ msg: 'List successfully found', list });
		});
});


// create a list for particular board (for authenticated and participating users)
router.post('/create', auth.ensureAuthentication, isBoardParticipant.checkBoardParticipant, (req, res) => {
	const { title, boardId } = req.body;

	if (!title || !boardId) {
		return res.status(400).json({ msg: 'Provide all fields' });
	}

	Board.findOne({ _id: boardId })
		.then((board) => {
			if (!board) return res.status(404).json({ msg: 'Board not found' });

			// create a new list
			const newList = new List({
				title
			});

			// save a new list
			newList.save()
				.then((list) => {
					// assign created list to its board
					board.lists.push(list._id);
					board.save()
						.then((updateBoard) => 
							updateBoard
								.populate({
									path: 'lists',
									populate: {
										path: 'cards'
									}
								})
								.populate({
									path: 'participants.user',
									select: '-password'
								})
								.execPopulate()
						)
						.then(board => {
							res.json({ board, msg: 'New list created successfully' });
						})
						.catch((err) => {
							console.log(err);
							res.status(500).json({ msg: 'Internal server error' });
						})
				})
				.catch((err) => {
					console.log(err);
					res.status(500).json({ msg: 'Internal server error' });
				});
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ msg: 'Internal server error' });
		});
});

// delete a list from a particular board (for authenticated and participating users)
router.delete('/delete/:id', auth.ensureAuthentication, isBoardParticipant.checkBoardParticipant, listBelongsToBoard.checkListPresence, (req, res) => {
	const { id } = req.params;
	const { boardId } = req.body;

	if (!boardId) {
		return res.status(400).json({ msg: 'Provide all fields' });
	}

	// deleting list
	List.findOne({ _id: id })
	.then((list) => {
		if (!list) {
			return res.status(404).json({ msg: 'List not found' });
		}

		list.delete()
			.then((deletedList) => {
				// list deleted successfully
				// remove list's id from board
				Board.findOne({ _id: boardId })
					.then((board) => {
						board.lists = board.lists.filter((item) => {
							return item.toString() != list._id.toString();
						});

						board.save()
							.then((updatedBoard) => 
								updatedBoard
									.populate({
										path: 'lists',
										populate: {
											path: 'cards'
										}
									})
									.populate({
										path: 'participants.user',
										select: '-password'
									})
									.execPopulate()
							)
							.then(board => {
								res.json({ msg: 'List deleted successfully', board });
							})
							.catch((err) => {
								console.error(err);
								res.status(500).json({ msg: 'Internal server error' });
							});
					})
					.catch((err) => {
						console.error(err);
						res.status(500).json({ msg: 'Internal server error' });
					});

				// delete all cards assosiated with this list
				deletedList.cards.forEach((card) => {
					Card.findOneAndDelete({ _id: card })
						.catch((err) => {
							console.error('Error while deleting cards assosiated with deleted list', err);
						});
				});
			})
			.catch((err) => {
				console.error(err);
				res.status(500).json({ msg: 'Internal server error' });
			})
	})
	.catch((err) => {
		console.error(err);
		res.status(500).json({ msg: 'Internal server error' });
	});
});

// update list's containings (for authenticated and participating users)
router.put('/update/:id', auth.ensureAuthentication, isBoardParticipant.checkBoardParticipant, listBelongsToBoard.checkListPresence, (req, res) => {
	const { id } = req.params;
	const { title, boardId } = req.body;
	const { userId } = req;

	if (!userId || !title || !boardId) {
		return res.status(400).json({ msg: 'Provide all fields' });
	}
	
	// find list
	List.findOne({ _id: id })
		.then((list) => {
			// updating list
			list.title = title;
			list.save()
				.then(() => {
					res.json({ msg: 'List successfully updated' });
				})
				.catch((err) => {
					console.error(err);
					res.status(500).json({ msg: 'Internal server error' });
				});
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ msg: 'Internal server error' });
		});
});

// used for drag and drop functionality on the front end
router.post('/switch', auth.ensureAuthentication, isBoardParticipant.checkBoardParticipant, (req, res) => {
	const { boardId, listId, cards } = req.body;

	List.findById(listId)
		.then((list) => {
			list.cards = cards.map((item) => item._id);
			list.save()
				.then(() => {
					res.json({ msg: 'Cards successfully switched' });
				})
				.catch((err) => {
					console.error(err);
					res.status(500).json({ msg: 'Internal server error' });
				});
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ msg: 'Internal server error' });
		});
});

router.post('/relocate', auth.ensureAuthentication, isBoardParticipant.checkBoardParticipant, (req, res) => {
	const { boardId, from, to, cardId } = req.body;

	List.findById(from)
		.then((fromList) => {
			fromList.cards = fromList.cards.filter((id) => id != cardId);
			fromList.save()
				.then(() => {
					List.findById(to)
						.then((toList) => {
							toList.cards.push(cardId);
							toList.save()
								.then(() => {
									Card.findById(cardId)
										.then((card) => {
											card.listId = to;
											card.save()
												.then(() => {
													res.json({ msg: 'Card successfully relocated' });
												})
												.catch((err) => {
													console.error('Error while saving card', err);
													res.status(500).json({ msg: 'Internal server error' });
												});
										})
										.catch((err) => {
											console.error(err);
											res.status(500).json({ msg: 'Internal server error' });
										});
								})
								.catch((err) => {
									console.error('Error while saving toList', err);
									res.status(500).json({ msg: 'Internal server error' });
								});
						})
						.catch((err) => {
							console.error(err);
							res.status(500).json({ msg: 'Internal server error' });
						});
				})
				.catch((err) => {
					console.error('Error while saving fromList', err);
					res.status(500).json({ msg: 'Internal server error' });
				});
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ msg: 'Internal server error' });
		});
});

module.exports = router;