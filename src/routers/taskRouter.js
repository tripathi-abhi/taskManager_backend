const express = require("express");
const Task = require("../models/task_model");

// creating a new router. The newly created router has same methods like express instance get,post,patch,delete,etc.

const taskRouter = new express.Router();

// to add task for a user

taskRouter.post("/tasks", async (req, res) => {
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

taskRouter.get("/tasks", async (req, res) => {
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

taskRouter.get("/tasks/:id", async (req, res) => {
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

taskRouter.patch("/tasks/:id", async (req, res) => {
	const requestedUpdates = Object.keys(req.body);
	const allowedUpdates = ["description", "completed"];
	const isValidRequest = requestedUpdates.every(update =>
		allowedUpdates.includes(update)
	);
	if (!isValidRequest) {
		return res.status(400).send({ error: "Invalid update request" });
	}
	try {
		const task = await Task.findById(req.params.id);
		requestedUpdates.forEach(field => (task[field] = req.body[field]));
		task
			.save()
			.then(data => {
				return res.status(201).send(data);
			})
			.catch(e => {
				return res.status(400).send(e);
			});
	} catch (error) {
		res.status(400).send(error);
	}
});

// to delete a task by id

taskRouter.delete("/tasks/:id", async (req, res) => {
	try {
		const task = await Task.findByIdAndDelete(req.params.id);
		if (!task) {
			return res.status(404).send();
		}
		res.send(task);
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = taskRouter;
