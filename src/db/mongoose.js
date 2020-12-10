const mongoose = require("mongoose");
const validate = require("validator");
// const { Schema } = mongoose;

const connectionURL = "mongodb://127.0.0.1:27017/";

const databaseName = "task-manager-api";

mongoose.connect(`${connectionURL}${databaseName}`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
});

// const userSchema = new Schema({
// 	name: {
// 		type: String,
// 	},
// 	age: {
// 		type: Number,
// 	},
// });

const User = mongoose.model("User", {
	name: {
		type: String,
		required: [true, "Name is required"],
		trim: true,
		minlength: [5, "Must be atleast 5 letters"],
		maxlength: [30, "Must be atmost 30 letters"],
	},
	email: {
		type: String,
		trim: true,
		required: [true, "Email is required"],
		validate: {
			// one way to use customized validator
			validator(value) {
				return validate.isEmail(value);
			},
			message: "Not a valid Email",
		},
	},
	password: {
		type: String,
		trim: true,
		required: [true, "Password is required"],
		minlength: [6, "Password is shorter than the minimum allowed length (6)"],
		validate: {
			validator(value) {
				if (
					value
						.toLowerCase()
						.includes("password", 0 /* position to start searching */)
				) {
					throw new Error("Cannot be used as password. Use unique password");
				}
			},
		},
	},
	age: {
		type: Number,
		validate: {
			validator(value) {
				if (value < 0) {
					throw new Error("Age cannot be negative");
				}
			},
		},
		default: 0,
	},
});

// const newUser = new User({
// 	name: "name sample",
// 	email: "ani@gmail.com",
// 	password: "rohitAni@123",
// 	age: 23,
// });

// newUser
// 	.save()
// 	.then((user) => {
// 		console.log(user);
// 	})
// 	.catch((error) => {
// 		console.log("Error! ", error.message);
// 	});

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

const newTask = new Task({
	description: "Start coding 3 months plan",
	completed: false,
});

newTask
	.save()
	.then((task) => {
		console.log(task);
	})
	.catch((error) => {
		console.log("Error! ", error.message);
	});
