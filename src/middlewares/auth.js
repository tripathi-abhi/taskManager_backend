const jwt = require("jsonwebtoken");
const User = require("../models/user_model");
const auth = async (req, res, next) => {
	try {
		const authToken = req.header("Authorization").replace("Bearer ", "");
		const decodedToken = jwt.verify(authToken, "letitbeseen");
		if (!decodedToken) {
			return res.status(401).send("User Unauthorized");
		}
		const user = await User.findOne({
			_id: decodedToken._id,
			"tokens.token": authToken,
		});
		if (!user) {
			return res.status(401).send("User Unauthorized");
		}
		req.token = authToken;
		req.user = user;
		next();
	} catch (e) {
		res.status(400).send(e.message);
	}
};

module.exports = auth;
