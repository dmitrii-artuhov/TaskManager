const express = require('express');
const router = express.Router();
// models
const Board = require('../../models/Board');
const User = require('../../models/User');
// middleware
const auth = require('../../middleware/auth');
const isBoardAdmin = require('../../middleware/isBoardAdmin');

// add new participant to the board (authenticated users and admins only)
router.post('/add', auth.ensureAuthentication, isBoardAdmin.checkBoardAdmin, (req, res) => {
	const { boardId, participantId } = req.body;
	const { userId } = req;

	if (!boardId || !userId || !participantId) {
		return res.status(400).json({ msg: 'Provide all fields' });
	}

	// make sure that user does not add himself
	if (userId == participantId) {
		return res.status(400).json({ msg: 'You cannot add youself' });
	}

	// find the particular board
	Board.findOne({ _id: boardId })
		.then((board) => {
			// find new participant
			User.findOne({ _id: participantId })
				.then((user) => {
					if (!user) {
						return res.status(404).json({ msg: 'User not found. Participant cannot be added' });
					}

					// check if particular participant already added to the board
					let participantAlreadyExists = false;
					board.participants.forEach((item) => {
						if (item.user == participantId) participantAlreadyExists = true;
					});
					if (participantAlreadyExists) {
						return res.status(400).json({ msg: 'Participant already included' });
					}

					// create and add to the board a new participant
					const newParticipant = {
						role: 'normal',
						user: participantId
					}
					board.participants.push(newParticipant);

					// assigning board to the participant
					user.sharedBoards.push(boardId);
					user.save()
						.catch((err) => {
							console.error(err);
						})

					// saving board with a new participant
					board.save()
						.then(() => {
							res.json({ msg: 'New participant added successfully', participants: board.participants });
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
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json({ msg: 'Internal server error' });
		});
});

// delete an existing participant from the board (authenticated users and admins only)
router.delete('/delete', auth.ensureAuthentication, isBoardAdmin.checkBoardAdmin, (req, res) => {
	const { boardId, participantId } = req.body;
	const { userId } = req;
	
	if (!boardId || !userId || !participantId) {
		return res.status(400).json({ msg: 'Provide all fields' });
	}

	// make sure that user does not delete himself
	if (userId == participantId) {
		return res.status(400).json({ msg: 'You cannot delete youself' });
	}

	// finding the board
	Board.findOne({ _id: boardId })
		.then((board) => {
			if (!board) {
				return res.status(404).json({ msg: 'Board not found' });
			}

			// delete participant from board
			// but if it's not presented in it, I will send an error of 404
			const oldParticpantsLength = board.participants.length;

			board.participants = board.participants.filter((item) => item.user != participantId);
			if (oldParticpantsLength == board.participants.length) {
				// array length didn't change, meaning that participant not found
				return res.status(404).json({ msg: 'Participant does not exist' });
			}

			// save updated board
			board.save()
				.then(() => {
					// find participant and exclude particular board from his sharedBoards list
					User.findOne({ _id: participantId })
						.then((user) => {
							// this user must exist otherwise process would end earlier
							if (!user) {
								return res.status(404).json({ msg: 'Participant does not exist' });
							}
							// filtering out current board from sharedBoards list
							user.sharedBoards = user.sharedBoards.filter((item) => item != boardId);
							user.save()
								.then(() => {
									res.json({ msg: 'Participant successfully excluded from board' });
								})
								.catch((err) => {
									console.error(err);
								});
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
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json({ msg: 'Internal server error' });
		});
});

// participating users can unsubscribe from board (authenticated users)
// route will not detect if user is actually a participant or not
// the result will be the same for any related user
router.post('/unsubscribe', auth.ensureAuthentication, (req, res) => {
	const { boardId } = req.body;
	const { userId } = req;

	Board.findOne({ _id: boardId })
		.then((board) => {
			// even if board does not exist delete its id from user's sharedBoards list
			if (!board) {
				return User.findOne({ _id: userId })
					.then((user) => {
						// filtering out the board from requester's sharedBoards list
						user.sharedBoards = user.sharedBoards.filter((item) => item != boardId);
						user.save()
							.then(() => {
								res.json({ msg: 'Board not found. Deleted from your \'sharedBoards\' list' });
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
			}

			// filtering out the requester from the board and detecting admin at the same time
			let isAdmin = false;
			board.participants = board.participants.filter((item) => {
				if (item.user == userId && item.role == 'admin') isAdmin = true;
				return item.user != userId;
			});

			// if the requester is an admin prevent further actions and do not save changes
			if (isAdmin) {
				return res.status(403).json({ msg: 'Admin cannot unsubscribe from the board' });
			}

			board.save()
				.then(() => {
					User.findOne({ _id: userId })
						.then((user) => {
							// filtering out the board from requester's sharedBoards list
							user.sharedBoards = user.sharedBoards.filter((item) => item != boardId);
							user.save()
								.then(() => {
									res.json({ msg: 'Unsubscribed successfully' });
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

module.exports = router;