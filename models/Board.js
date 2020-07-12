const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	backgroundImage: {
		type: String
	},
	participants: [
		{
			role: {
				type: String,
				default: 'admin'
			},
			user: {
				type: Schema.Types.ObjectId,
				ref: 'User'
			}
		}
	],
	lists: [
		{
			type: Schema.Types.ObjectId,
			ref: 'List'
		}
	]
}, { timestamps: true });

module.exports = Board = mongoose.model('Board', BoardSchema);