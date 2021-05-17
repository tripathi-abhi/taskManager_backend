const express = require("express");
const Task = require("../models/task_model");
const auth = require("../middlewares/auth");

// creating a new router. The newly created router has same methods like express instance get,post,patch,delete,etc.

const taskRouter = new express.Router();

// to add task for a user

taskRouter.post("/tasks", auth, async (req, res) => {
	try {
		const task = new Task({ ...req.body, owner: req.user._id });
		const addedTask = await task.save();
		res.status(201).send(addedTask);
	} catch (error) {
		res.status(400).send(error);
	}
});

// get user tasks with pagination and sorting

// ?limit=10&skikp=fa-rotate-18
// ?completed=rue
// ?sortBy=createdAt:desc

taskRouter.get("/tasks", auth, async (req, res) => {
	const match = {};
	const sort = {};
	if (req.query.sortBy) {
		const sortArray = req.query.sortBy.split(":");
		if (sortArray[0] && sortArray[1]) {
			sort[sortArray[0]] = sortArray[1] === "desc" ? -1 : 1;
		}
	}
	if (req.query.completed) {
		match.completed = req.query.completed === "false" ? false : true;
	}
	try {
		await req.user
			.populate({
				path: "tasks",
				match,
				options: {
					limit: parseInt(req.query.limit),
					skip: parseInt(req.query.skip),
					sort,
				},
			})
			.execPopulate();
		res.send(req.user.tasks);
	} catch (error) {
		res.status(500).send(error);
	}
});

// get a task by id

taskRouter.get("/tasks/:id", auth, async (req, res) => {
	try {
		const _id = req.params.id;
		const task = await Task.findOne({ _id, owner: req.user.id });
		if (!task) {
			return res.status(404).send();
		}
		res.send(task);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

// update a task

taskRouter.patch("/tasks/:id", auth, async (req, res) => {
	const requestedUpdates = Object.keys(req.body);
	const allowedUpdates = ["description", "completed"];
	const isValidRequest = requestedUpdates.every(update =>
		allowedUpdates.includes(update)
	);
	if (!isValidRequest) {
		return res.status(400).send({ error: "Invalid update request" });
	}
	try {
		const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
		if (!task) {
			return res.status(404).send();
		}
		requestedUpdates.forEach(field => (task[field] = req.body[field]));
		await task.save();
		return res.status(201).send(task);
	} catch (error) {
		res.status(400).send(error);
	}
});

// to delete a task by id

taskRouter.delete("/tasks/:id", auth, async (req, res) => {
	try {
		const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
		if (!task) {
			return res.status(404).send();
		}
		await task.remove();
		res.send(task);
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = taskRouter;
