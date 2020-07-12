const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	cards: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Card'
		}
	]
}, { timestamps: true });

module.exports = List = mongoose.model('List', ListSchema);