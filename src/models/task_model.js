const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
	{
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
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
