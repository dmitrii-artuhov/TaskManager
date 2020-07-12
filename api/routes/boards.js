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

// get all boards
router.get('/get', auth.ensureAuthentication, (req, res) => {
	User.findById(req.userId)
		.populate({ 
			path: 'ownBoards',
			populate: {
				path: 'participants.user',
				select: 'name',
				model: 'User'
			} 
		})
		.populate({ 
			path: 'sharedBoards',
			populate: {
				path: 'participants.user',
				select: 'name',
				model: 'User'
			} 
		})
		.exec((err, user) => {
			if (err) {
				console.error('Error while getting the boards', err);
				return;
			}

			res.json({ ownBoards: user.ownBoards, sharedBoards: user.sharedBoards });
		});
});

// create a board (for authenticated users)
router.post('/create', auth.ensureAuthentication, (req, res) => {
	const { title } = req.body;
	const { userId } = req;
	if (!title || !userId) return res.status(400).json({ msg: 'Provide all fields' });
	
	const newBoard = new Board({
		title,
		participants: [ { role: 'admin', user: userId } ]
	});

	// saving a board
	newBoard.save()
		.then((board) =>
			board.populate({ 
				path: 'participants.user',
				select: 'name',
				model: 'User' 
			})
			.execPopulate()
		)
		.then((board) => {
			// assign created board to the user
			User.findOne({ _id: userId })
				.then((user) => {
					user.ownBoards.push(board._id);
					user.save()
						.then(() => {
							res.json({ msg: 'Board created successfully', board });
						})
						.catch((err) => {
							console.error(err);
							res.status(500).json({ msg: 'Cound not create a new board. Internal server error.' });
						});
				})
				.catch((err) => {
					console.error(err);
					res.status(500).json({ msg: 'Cound not create a new board. Internal server error.' });
				});
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ msg: 'Cound not create a new board. Internal server error.' });
		});
});

// update a board (for authenticated and participating users)
router.put('/update/:id', auth.ensureAuthentication, isBoardParticipant.checkBoardParticipant, (req, res) => {
	const { id } = req.params;
	const { title } = req.body;
	const { userId } = req;

	if (!title || !userId) {
		return res.status(400).json({ msg: 'Provide all fields' });
	}

	Board.findOne({ _id: id })
		.then((board) => {
			if (!board) return res.status(404).json({ msg: 'Board not found' });

			// applying all changes
			board.title = title;

			board.save()
				.then((board) => {
					res.json({ msg: 'Board updated successfully', board });
				})
				.catch((err) => {
					console.error(err);
					res.status(500).json({ msg: 'Could not update a board' });
				});
		})
		.catch((err) => {
			console.error(err);
			res.status(404).json({ msg: 'Board not found' });
		});
});

// delete a board (for authenticated users and admin of a board)
router.delete('/delete/:id', auth.ensureAuthentication, isBoardAdmin.checkBoardAdmin, (req, res) => {
	const { id } = req.params;
	const { userId } = req;

	if (!userId) {
		return res.status(400).json({ msg: 'Provide all fields' });
	}

	Board.findOne({ _id: id })
		.then((board) => {
			// checking for existance of a board
			if (!board) {		
				return res.status(404).json({ msg: 'Board does not exist' });
			}
			
			// delete the board from admin's ownBoards list
			// I don't delete board from all participants, because they just won't be able to access it afterwards anyway 
			User.findOne({ _id: userId })
				.then((admin) => {
					// filtering out the board that is to be deleted
					let newOwnBoards = admin.ownBoards.filter((item) => item != id); 
					admin.ownBoards = newOwnBoards;
					admin.save()
						.catch((err) => {
							console.error(err);
						})
				})
				.catch((err) => {
					console.error(err);
				});

			// deleting the board
			board.delete()
				.then((board) => {
					// remove all lists connected to this board
					board.lists.forEach((list) => {
						List.findOneAndDelete({ _id: list })
							.then(list => {
								list.cards.forEach((cardId) => {
									Card.findOneAndDelete({ _id: cardId })
										.catch((err) => {
											console.error('Error while removing cards from deleted lists/board', err);
										});
								})
							})
							.catch((err) => {
								console.error('Error while removing lists from deleted board', err);
							});
					});

					res.json({ msg: 'Board deleted successfully' });
				})
				.catch((err) => {
					console.error(err);
					res.status(500).json({ msg: 'Internal servr error' });
				});
		})
		.catch((err) => {
			// checking for errors
			console.error(err);
			res.status(500).json({ msg: 'Internal server error' });
		});
});

// retrieve a board
router.get('/find/:id', auth.ensureAuthentication, isBoardParticipant.checkBoardParticipant, (req, res) => {
	const { id } = req.params;

	Board.findOne({ _id: id })
		.populate({
			// populating cards of the lists and labels of the cards
			path: 'lists',
			populate: { path: 'cards' }
		})
		// populating participants
		.populate('participants.user')
		.exec((err, board) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ msg: 'Internal server error' });
			}
			res.json({ board });
		});
});

module.exports = router;