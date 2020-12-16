const express = require("express");
require("./db/mongoose");
const User = require("./models/user_model");
const Task = require("./models/task_model");

const app = express();

const usedPort = process.env.PORT || 3000;

app.use(express.json());

// to add users (signup)

app.post("/users", async (req, res) => {
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

app.get("/users", async (req, res) => {
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

app.get("/users/:id", async (req, res) => {
	const _id = req.params.id;
	try {
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

app.patch("/users/:id", async (req, res) => {
	const updatesRequested = Object.keys(req.body);
	const allowedUpdates = ["name", "age", "email", "password"];
	const isValidRequest = updatesRequested.every((update) =>
		allowedUpdates.includes(update)
	);
	if (!isValidRequest) {
		return res.status(400).send({ error: "Inavlid update request" });
	}
	try {
		const options = {
			new: true,
			runValidators: true,
		};
		const user = await User.findByIdAndUpdate(req.params.id, req.body, options);
		if (!user) {
			return res.status(404).send();
		}
		res.send(user);
	} catch (error) {
		res.status(400).send(error);
	}
});

// to delete a user by id

app.delete("/users/:id", async (req, res) => {
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

// to add task for a user

app.post("/tasks", async (req, res) => {
	const task = new Task(req.body);

	try {
		const addedTask = await task.save();
		res.status(201).send(addedTask);
	} catch (error) {
		res.status(400).send(error);
	}

	// task
	// 	.save()
	// 	.then((addedTask) => {
	// 		res.status(201).send(addedTask);
	// 	})
	// 	.catch((error) => {
	// 		res.status(400).send(error);
	// 	});
});

// get all tasks

app.get("/tasks", async (req, res) => {
	try {
		const tasks = await Task.find({});
		res.send(tasks);
	} catch (error) {
		res.status(500).send(error);
	}

	// Task.find({})
	// 	.then((tasks) => {
	// 		res.send(tasks);
	// 	})
	// 	.catch((error) => {
	// 		res.status(500).send(error);
	// 	});
});

// get a task by id

app.get("/tasks/:id", async (req, res) => {
	const _id = req.params.id;

	try {
		const task = await Task.findById(_id);
		if (!task) {
			return res.status(404).send();
		}
		res.send(task);
	} catch (error) {
		res.status(500).send(error);
	}

	// Task.findById(_id)
	// 	.then((task) => {
	// 		if (!task) {
	// 			return res.status(404).send();
	// 		}
	// 		res.send(task);
	// 	})
	// 	.catch((error) => {
	// 		res.status(500).send(error);
	// 	});
});

// update a task

app.patch("/tasks/:id", async (req, res) => {
	const requestedUpdates = Object.keys(req.body);
	const allowedUpdates = ["description", "completed"];
	const isValidRequest = requestedUpdates.every((update) =>
		allowedUpdates.includes(update)
	);
	if (!isValidRequest) {
		return res.status(400).send({ error: "Invalid update request" });
	}
	try {
		const options = {
			new: true,
			runValidators: true,
		};
		const task = await Task.findByIdAndUpdate(req.params.id, req.body, options);
		if (!task) {
			return res.status(404).send();
		}
		res.send(task);
	} catch (error) {
		res.status(400).send(error);
	}
});

// to delete a task by id

app.delete("/tasks/:id", async (req, res) => {
	try {
		const task = await Task.findByIdAndDelete(req.params.id);
		if (!task) {
			res.status(404).send();
		}
		res.send(task);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.listen(usedPort, () => {
	console.log("Listening at port ", usedPort);
});
