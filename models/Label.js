const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LabelSchema = new Schema({
	title: String,
	color: String
});

module.exports = Label = mongoose.model('Label', LabelSchema);