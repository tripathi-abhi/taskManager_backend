const express = require("express");
const User = require("../models/user_model");

// creating a new router. The newly created router has same methods like express instance get,post,patch,delete,etc.

const userRouter = new express.Router();

// creating a user

userRouter.post("/users", async (req, res) => {
	const user = new User(req.body);

	try {
		const addedUser = await user.save();
		res.status(201).send(addedUser);
	} catch (error) {
		res.status(400).send(error);
	}

	// user
	// 	.save()
	// 	.then((addedUser) => {
	// 		res.status(201).send(addedUser);
	// 	})
	// 	.catch((error) => {
	// 		res.status(400).send(error);
	// 	});
});

// get all users

userRouter.get("/users", async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (error) {
		res.status(500).send(error);
	}

	// User.find({})
	// 	.then((users) => {
	// 		res.send(users);
	// 	})
	// 	.catch((error) => {
	// 		res.status(500).send(error);
	// 	});
});

// get a user by id

userRouter.get("/users/:id", async (req, res) => {
	try {
		const _id = req.params.id;
		const user = await User.findById(_id);
		if (!user) {
			return res.status(404).send();
		}
		res.send(user);
	} catch (error) {
		res.status(500).send(error);
	}

	// User.findById(_id)
	// 	.then((user) => {
	// 		if (!user) {
	// 			return res.status(404).send();
	// 		}
	// 		res.send(user);
	// 	})
	// 	.catch((e) => {
	// 		res.status(500).send(e);
	// 	});
});

// update user by id

userRouter.patch("/users/:id", async (req, res) => {
	const updatesRequested = Object.keys(req.body);
	const allowedUpdates = ["name", "age", "email", "password"];
	const isValidRequest = updatesRequested.every(update =>
		allowedUpdates.includes(update)
	);
	if (!isValidRequest) {
		return res.status(400).send({ error: "Inavlid update request" });
	}
	try {
		const user = await User.findById(req.params.id);
		updatesRequested.forEach(updateField => {
			user[updateField] = req.body[updateField];
		});
		console.log(user);

		user.save();

		// const options = {
		// 	new: true,
		// 	runValidators: true,
		// };
		// const user = await User.findByIdAndUpdate(req.params.id, req.body, options);
		if (!user) {
			return res.status(404).send();
		}
		res.send(user);
	} catch (error) {
		res.status(400).send(error);
	}
});

// to delete a user by id

userRouter.delete("/users/:id", async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) {
			return res.status(404).send();
		}
		res.send(user);
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = userRouter;
