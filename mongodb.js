// CRUD operations

// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;

const { MongoClient, ObjectID } = require("mongodb");
const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(
	connectionURL,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	(error, client) => {
		if (error) {
			return console.log(error);
		}

		const db = client.db(databaseName);

		// db.collection("users")
		// 	.deleteOne({
		// 		_id: new ObjectID("5fc95bb07f48f70f3034aafb"),
		// 	})
		// 	.then((result) => {
		// 		console.log(result.deletedCount);
		// 	})
		// 	.catch((error) => {
		// 		console.log(error);
		// 	});

		db.collection("tasks")
			.deleteMany({
				completion: true,
			})
			.then((result) => console.log(result.deletedCount))
			.catch((error) => console.log(error));
	}
);
