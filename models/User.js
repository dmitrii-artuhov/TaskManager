const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	ownBoards: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Board'
		}
	],
	sharedBoards: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Board'
		}
	],
	avatar: {
		type: String
	}
}, { timestamps: true });

module.exports = User = mongoose.model('User', UserSchema);