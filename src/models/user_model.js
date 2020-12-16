const validate = require("validator");
const mongoose = require("mongoose");

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

module.exports = User;
