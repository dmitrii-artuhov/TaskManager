const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	labels: [
		{
			_id: {
				type: Schema.Types.ObjectId,
				required: true,
				auto: true,
			},
			title: String,
			color: String
		}
	],
	description: {
		type: String
	},
	listId: {
		type: Schema.Types.ObjectId,
		required: true
	},
	status: {
		type: String,
		enum: ['OPEN', 'FAILED', 'COMPLETED'],
		default: 'OPEN'
	},
	checklist: [
		{
			_id: {
				type: Schema.Types.ObjectId,
				required: true,
				auto: true,
			},
			title: String,
			checked: {
				type: Boolean,
				default: false
			}
		}
	],
	// comments: [
	// 	{
	// 		author: String,
	// 		date: {
	// 			type: Date,
	// 			default: Date.now()
	// 		},
	// 		message: String
	// 	}
	// ]
}, { timestamps: true });

module.exports = Card = mongoose.model('Card', CardSchema);