const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ToDoSchema = new Schema({	
	title: String,
	checked: {
		type: Boolean,
		default: false
	}
});

module.exports = ToDo = mongoose.model('ToDo', ToDoSchema);