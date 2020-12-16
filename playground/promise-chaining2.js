require("../src/db/mongoose");
const Task = require("../src/models/task_model");

// Task.findByIdAndDelete(id)
// 	.then((task) => {
// 		console.log(task);
// 		return Task.countDocuments({ completed: false });
// 	})
// 	.then((counts) => {
// 		console.log(counts);
// 	})
// 	.catch((e) => {
// 		console.log(e.message);
// 	});

const deleteByIdAndCountIncomplete = async (id) => {
	const deletedUser = await Task.findByIdAndDelete(id);
	const count = await Task.countDocuments({ completed: false });
	return { deletedUser, count };
};

deleteByIdAndCountIncomplete("5fd3e105b6b6c80d1ce88c99").then(
	({ deletedUser, count }) => {
		console.log(deletedUser);
		console.log(count);
	}
);
