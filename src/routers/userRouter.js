const express = require("express");
const auth = require("../middlewares/auth");
const User = require("../models/user_model");
const multer = require("multer");
const sharp = require("sharp");

// creating a new router. The newly created router has same methods like express instance get,post,patch,delete,etc.

const userRouter = new express.Router();

// creating a user

userRouter.post("/users", async (req, res) => {
	try {
		const user = new User(req.body);
		const addedUser = await user.save();
		const token = await addedUser.generateAuthToken();
		res.status(201).send({ addedUser, token });
	} catch (error) {
		const errMsg = error.message;
		res.status(400).send({ error, errMsg });
	}
});

// login

userRouter.post("/users/login", async (req, res) => {
	try {
		const loggedInUser = await User.findByCredentials(req.body);
		const token = await loggedInUser.generateAuthToken();
		return res.send({ loggedInUser, token });
	} catch (e) {
		return res.status(400).send(e.message);
	}
});

// logout

userRouter.post("/users/logout", auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter(
			token => token.token !== req.token
		);
		await req.user.save();
		return res.send();
	} catch (e) {
		return res.status(400).send(e.message);
	}
});

// logout of all devices

userRouter.post("/users/logoutAll", auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		return res.send();
	} catch (e) {
		return res.staus(400).send();
	}
});

// get your profile

userRouter.get("/users/me", auth, async (req, res) => {
	try {
		const user = req.user;
		return res.send(user);
	} catch (error) {
		res.status(400).send();
	}
});

// update user details

userRouter.patch("/users/updateme", auth, async (req, res) => {
	const updatesRequested = Object.keys(req.body);
	const allowedUpdates = ["name", "age", "email", "password"];
	const isValidRequest = updatesRequested.every(update =>
		allowedUpdates.includes(update)
	);
	if (!isValidRequest) {
		return res.status(400).send({ error: "Invalid update request" });
	}
	try {
		const user = req.user;
		updatesRequested.forEach(updateField => {
			user[updateField] = req.body[updateField];
		});
		await user.save();
		return res.status(201).send(user);
	} catch (error) {
		res.status(500).send(error);
	}
});

// to delete a user by id

userRouter.delete("/users/deleteme", auth, async (req, res) => {
	try {
		req.user.remove();
		res.send(req.user);
	} catch (error) {
		res.status(500).send(error);
	}
});

// upload user avatar
const uploads = multer({
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			console.log("here");
			return cb(new Error("Not a valid image type"));
		}
		return cb(null, true);
	},
});

userRouter.post(
	"/users/me/avatar",
	auth,
	uploads.single("avatar"),
	async (req, res) => {
		if (!req.file) {
			res.status(500).send({ error: "Select a file to upload" });
		}
		const buffer = await sharp(req.file.buffer)
			.resize({
				width: 250,
				height: 250,
			})
			.png()
			.toBuffer();
		req.user.avatar = buffer;
		await req.user.save();
		res.status(200).send();
	},
	(err, req, res, next) => {
		res.status(400).send({ error: err.message });
	}
);

// remove user avatar

userRouter.delete("/users/me/avatar", auth, async (req, res) => {
	try {
		req.user.avatar = undefined;
		await req.user.save();
		res.status(200).send();
	} catch (e) {
		res.status(500).send(e.message);
	}
});

// get user avatar
userRouter.get("/users/:id/avatar", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user || !user.avatar) {
			throw new Error();
		}
		res.set("content-type", "image/png");
		res.send(user.avatar);
	} catch (e) {
		res.status(404).send();
	}
});

module.exports = userRouter;
