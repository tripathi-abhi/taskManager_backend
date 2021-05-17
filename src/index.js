const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/userRouter");
const taskRouter = require("./routers/taskRouter");
const app = express();

const usedPort = process.env.PORT || 3000;

app.use(express.json());

// creating a new router. see userRouter or taskRouter

// const router = new express.Router();

// has same methods like get,post,patch,delete,etc.

// router.get('/test', (req,res) =>{
// 	res.send("From new router");
// })

// register the router with app then only we can use it
// app.use(userRouter);

// registering user router. see ./routers/userRouter

app.use(userRouter);

// registering task router. see ./routers/taskRouter

app.use(taskRouter);

const multer = require("multer");

const uploads = multer({
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error("Upload a jpg/jpeg/png file only"));
		}
		return cb(null, true);
	},
});

app.post(
	"/uploads",
	uploads.single("upload"),
	(req, res) => {
		res.sendStatus(200);
	},
	(err, req, res, next) => {
		res.status(400).send({ error: err.message });
	}
);

app.listen(usedPort, () => {
	console.log(`listening at port ${usedPort}`);
});
