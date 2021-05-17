const validate = require("validator");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const Task = require("./task_model");

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
			trim: true,
			minlength: [5, "Must be atleast 5 letters"],
			maxlength: [30, "Must be atmost 30 letters"],
		},
		email: {
			type: String,
			unique: true,
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
		tokens: {
			type: [
				{
					token: {
						type: String,
						required: true,
					},
				},
			],
		},
		avatar: {
			type: Buffer,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.virtual("tasks", {
	ref: "Task",
	localField: "_id",
	foreignField: "owner",
});

userSchema.methods.generateAuthToken = async function () {
	try {
		const user = this;
		const token = await jwt.sign({ _id: user._id.toString() }, "letitbeseen");
		user.tokens = user.tokens.concat({ token });
		await user.save();
		return token;
	} catch (e) {
		throw new Error(e);
	}
};

userSchema.methods.toJSON = function () {
	try {
		const user = this;
		const userObject = user.toObject();
		delete userObject.password;
		delete userObject.tokens;
		delete userObject.__v;
		return userObject;
	} catch (e) {
		throw new Error("Something went wrong");
	}
};

userSchema.statics.findByCredentials = async function (cb) {
	const { email, password } = cb;
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error("Login Failed");
	}
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error("Login Failed");
	}
	return user;
};

userSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

userSchema.pre("remove", async function (next) {
	const user = this;
	await Task.deleteMany({ owner: user.id });
	next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
