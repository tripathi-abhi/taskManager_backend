const mongoose = require("mongoose");

// URLs needed

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager-api";

// connecting to database server

mongoose
	.connect(`${connectionURL}/${databaseName}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log("Connection established");
	})
	.catch(error => {
		console.log("Error Establishing database connection");
	});
