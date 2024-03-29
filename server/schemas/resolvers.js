// Imports
const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
	Query: {
		me: async (parent, args, context) => {
			if (context.user) {
				const userData = await User.findOne({ _id: context.user._id }).select(
					"-__v -password"
				);
				return userData;
			}
			throw new AuthenticationError("Please Login first!");
		},
	},

	Mutation: {
		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email });

			if (!user) {
				throw new AuthenticationError(
					"Please enter the correct email or password for your account!"
				);
			}

			const userPassword = await User.isCorrectPassword(password);

			if (!userPassword) {
				throw new AuthenticationError(
					"Please enter the correct email or password for your account!"
				);
			}

			const token = signToken(user);
			return { token, user };
		},
		addUser: async (parent, args) => {
			const user = await User.create(args);
			const token = signToken(user);

			return { token, user };
		},
		saveBook: async (parent, { bookData }, context) => {
			if (context.user) {
				const updatedUser = await User.findByIdAndUpdate(
					{ _id: context.user._id },
					{ $push: { savedBooks: bookData } },
					{ new: true }
				);

				return updatedUser;
			}

			throw new AuthenticationError("Please Login first!");
		},
		removeBook: async (parent, { bookId }, context) => {
			if (context.user) {
				const updatedUser = await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $pull: { savedBooks: { bookId } } },
					{ new: true }
				);

				return updatedUser;
			}

			throw new AuthenticationError("Please Login first!");
		},
	},
};

// Exports
module.exports = resolvers;
