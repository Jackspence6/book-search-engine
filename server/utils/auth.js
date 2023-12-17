// Imports
const jwt = require("jsonwebtoken");

const secret = "Z4E{47g*h5@IB2iVmfZEyc7J\fkl;}~£Vh";
const expiration = "2h";

// Exports
module.exports = {
	authMiddleware: function ({ req }) {
		let token = req.body.token || req.query.token || req.headers.authorization;

		// ["Bearer", "<tokenvalue>"]
		if (req.headers.authorization) {
			token = token.split(" ").pop().trim();
		}

		if (!token) {
			return req;
		}

		try {
			const { data } = jwt.verify(token, secret, { maxAge: expiration });
			req.user = data;
		} catch {
			console.log("Invalid token!");
		}

		return req;
	},
	signToken: function ({ username, email, _id }) {
		const payload = { username, email, _id };

		return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
	},
};
