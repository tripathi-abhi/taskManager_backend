require("../src/db/mongoose");
const User = require("../src/models/user_model");

// User.findByIdAndUpdate("5fd2995139e36c23ac0dda16", {
// 	age,
// })
// 	.then((updatedUser) => {
// 		console.log(updatedUser);
// 		return User.countDocuments({ age });
// 	})
// 	.then((users) => {
// 		console.log(users);
// 	})
// 	.catch((e) => {
// 		console.log(e);
// 	});

const updateAgeAndCount = async (id, age) => {
	const user = await User.findByIdAndUpdate(id, { age });
	const counts = await User.countDocuments({ age });
	return { user, counts };
};

updateAgeAndCount("5fd2991239e36c23ac0dda15", 2).then(({ user, counts }) => {
	console.log(user);
	console.log(counts);
});
