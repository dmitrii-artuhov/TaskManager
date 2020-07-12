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
const cardBelongsToList = require('../../middleware/cardBelongsToList');
const listBelongsToBoard = require('../../middleware/listBelongsToBoard');
const labelBelongsToCard = require('../../middleware/labelBelongsToCard');
const todoBelongsToCard = require('../../middleware/todoBelongsToCard');

// get card by id
router.post('/get/:id', auth.ensureAuthentication, isBoardParticipant.checkBoardParticipant, (req, res) => {
	const { boardId } = req.body;
	const { id } = req.params; // cardId

	Card.findById(id)
		.then((card) => {
			if (!card) {
				return res.status(404).json({ msg: 'Card not found' });
			}

			res.json({ card });
		})
		.catch((err) => {
			console.error('Error while retrieving a single card', err);
		})
});

// create a card in the list (for authenticated and participating users)
router.post('/create', auth.ensureAuthentication, isBoardParticipant.checkBoardParticipant, listBelongsToBoard.checkListPresence, (req, res) => {
	const { boardId, listId, title } = req.body;

	if (!boardId || !listId || !title) {
		return res.status(400).json({ msg: 'Provide all fields' });
	}

	// find list, create a card, and assign it to the list
	List.findOne({ _id: listId })
		.then((list) => {
			if (!list) {
				return res.status(404).json({ msg: 'List not found' });
			}

			const newCard = new Card({
				title
			});

			// saving created card
			newCard.save()
				.then((card) => {
					// assigning created card to the list
					list.cards.push(card._id);
					// saving updated list
					list.save()
						.then((newList) => {
							List.populate(newList, { path: 'cards' }, (err, list) => {
								if (err) {
									console.error(err);
									return res.status(500).json({ msg: 'Internal server error' });
								}
	
								res.json({ msg: 'Card created successfully', list });
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

// deleting card
router.delete('/delete/:id', auth.ensureAuthentication, isBoardParticipant.checkBoardParticipant, (req, res) => {
	const { boardId, listId } = req.body; // boardId, listId
	const { id } = req.params;

	// delete card
	Card.findOne({ _id: id })
		.then((card) => {
			if (!card) {
				return res.status(404).json({ msg: 'Card not found' });
			}

			card.delete()
				.then(() => {
					// remove card's id from list
					List.findOne({ _id: listId })
						.then((list) => {
							list.cards = list.cards.filter((item) => item.toString() != card._id.toString());
							// saving updated list
							list.save()
								.then(() => {
									res.json({ msg: 'Card successfully deleted' });
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

// updating card's description, title, status
router.put('/update/:id', auth.ensureAuthentication, isBoardParticipant.checkBoardParticipant, (req, res) => {
	// requires boardId and listId as well
	const { id } = req.params;
	const { title, description, status } = req.body;

	if (!title && !description && !status) {
		return res.status(400).json({ msg: "Specify the field which value should update" });
	}

	Card.findOne({ _id: id })
		.then((card) => {
			if (!card) {
				return res.status(404).json({ msg: 'Card not found' });
			}

			// update description, title
			if (title) card.title = title;
			if (description != null) card.description = description;
			if (status) card.status = status;

			card.save()
				.then(() => {
					res.json({ msg: 'Card updated successfully', card });
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

// - Manage checklist
// add todo
router.post('/:id/checklist/add', auth.ensureAuthentication, isBoardParticipant.checkBoardParticipant, (req, res) => {
	const { id } = req.params;
	const { boardId, todo } = req.body;

	Card.findOne({ _id: id })
		.then((card) => {
			if (!card) {
				return res.status(404).json({ msg: 'Card not found' });
			}

			card.checklist.push(todo);

			card.save()
				.then((card) => {
					res.json({ msg: 'Checklist item successfully added', card });
				})
				.catch((err) => {
					console.error('Error while saving card when adding checklist item', err);
					res.status(500).json({ msg: 'Internal server error' });
				});
		})
		.catch((err) => {
			console.error('Error while adding checklist item', err);
			res.status(500).json({ msg: 'Internal server error' });
		});
});

// update todo
router.put('/:id/checklist/update', auth.ensureAuthentication, isBoardParticipant.checkBoardParticipant, (req, res) => {
	const { id } = req.params;
	const { boardId, todoId } = req.body;

	Card.findOne({ _id: id })
		.then((card) => {
			if (!card) {
				return res.status(404).json({ msg: 'Card not found' });
			}

			card.checklist = card.checklist.map((todo) => {
				if (todo._id == todoId) {
					todo.checked = !todo.checked;
				}
				return todo;
			});

			card.save()
				.then((card) => {
					res.json({ msg: 'Checklist item successfully updated', card });
				})
				.catch((err) => {
					console.error('Error while saving card when updating checklist item', err);
					res.status(500).json({ msg: 'Internal server error' });
				});
		})
		.catch((err) => {
			console.error('Error while updating checklist item', err);
			res.status(500).json({ msg: 'Internal server error' });
		});
});

// delete todo
router.delete('/:id/checklist/delete', auth.ensureAuthentication, isBoardParticipant.checkBoardParticipant, (req, res) => {
	const { id } = req.params;
	const { boardId, todoId } = req.body;

	Card.findOne({ _id: id })
		.then((card) => {
			if (!card) {
				return res.status(404).json({ msg: 'Card not found' });
			}
			// filter out the todo
			card.checklist = card.checklist.filter((todo) => todo._id != todoId);

			card.save()
				.then((card) => {
					res.json({ msg: 'Checklist item successfully deleted', card });
				})
				.catch((err) => {
					console.error('Error while saving card when deleting checklist item', err);
					res.status(500).json({ msg: 'Internal server error' });
				});
		})
		.catch((err) => {
			console.error('Error while deleting checklist item', err);
			res.status(500).json({ msg: 'Internal server error' });
		});
});

// - Manage labels
// add new label
router.post('/:id/labels/add', auth.ensureAuthentication, isBoardParticipant.checkBoardParticipant, (req, res) => {
	const { id } = req.params; // cardId
	const { label, boardId } = req.body;

	Card.findOne({ _id: id })
		.then((card) => {
			if (!card) {
				return res.status(404).json({ msg: 'Card not found' });
			}

			card.labels.push(label);

			card.save()
				.then((card) => {
					res.json({ msg: 'Label successfully added', card });
				})
				.catch((err) => {
					console.error('Error while saving the card when adding new label', err);
					res.status(500).json({ msg: 'Internal server error' });
				});
		})
		.catch((err) => {
			console.error('Error while searching for the card when adding new label', err);
			res.status(500).json({ msg: 'Internal server error' });
		});
});

// delete existing label
router.delete('/:id/labels/delete', auth.ensureAuthentication, isBoardParticipant.checkBoardParticipant, (req, res) => {
	const { id } = req.params; // cardId
	const { boardId, labelId } = req.body;

	Card.findOne({ _id: id })
		.then((card) => {
			if (!card) {
				return res.status(404).json({ msg: 'Card not found' });
			}

			card.labels = card.labels.filter((label) => label._id != labelId);

			card.save()
				.then((card) => {
					res.json({ msg: 'Label successfully deleted', card });
				})
				.catch((err) => {
					console.error('Error while saving the card when deleting label', err);
					res.status(500).json({ msg: 'Internal server error' });
				});
		})
		.catch((err) => {
			console.error('Error while searching for the card when deleting label', err);
			res.status(500).json({ msg: 'Internal server error' });
		});
});

// update existing label
router.put('/:id/labels/update', auth.ensureAuthentication, isBoardParticipant.checkBoardParticipant, (req, res) => {
	const { id } = req.params; // cardId
	const { boardId, labelId, label } = req.body;

	Card.findOne({ _id: id })
		.then((card) => {
			if (!card) {
				return res.status(404).json({ msg: 'Card not found' });
			}

			let updatedLabel = {};
			card.labels = card.labels.map((item) => {
				if (item._id == labelId) {
					item = label;
					updatedLabel = item;
				}
				return item;
			});

			card.save()
				.then((card) => {
					res.json({ msg: 'Label successfully updated', card, label: updatedLabel });
				})
				.catch((err) => {
					console.error('Error while saving the card when updating label', err);
					res.status(500).json({ msg: 'Internal server error' });
				});
		})
		.catch((err) => {
			console.error('Error while searching for the card when updating label', err);
			res.status(500).json({ msg: 'Internal server error' });
		});
});

// chat - upcoming

module.exports = router;