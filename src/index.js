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

app.listen(usedPort, () => {
	console.log(`listening at port ${usedPort}`);
});
