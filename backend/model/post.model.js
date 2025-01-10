import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		text: {
			type: String,
		},
		img: {
			type: String,
            //Why a String? The image itself isn't stored in the database. Instead, it's stored in cloud storage (e.g., AWS S3, Cloudinary) or a file system, and only its URL is saved here.
		},
		likes: [ //This is an array that stores the list of users who liked the post.

			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",//Establishes a relationship between the PostModel and the UserModel.
			},
		],
		comments: [
			{
				text: { //Stores the actual comment text.
					type: String,
					required: true,
				},
				user: { //Stores the _id of the user who made the comment.
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
			},
		],
	},
	{ timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;