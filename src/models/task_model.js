const mongoose = require("mongoose");

const Task = mongoose.model("Task", {
	description: {
		type: String,
		minlength: [6, "Must be atleast 6 letters long"],
		required: [true, "Decription of the task is required"],
		trim: true,
	},
	completed: {
		type: Boolean,
		default: false,
	},
});

module.exports = Task;
