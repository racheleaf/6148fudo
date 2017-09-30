var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	postTitle: String,
	postCaption: String,
	postAuthor: String,
	postUsername: String,
	imageURL: String,
	imageID: String,
	postLikes: Number,
	userLikes: Array,
	postTime: Number,
	postDate: String,
	hasRecipe: Boolean
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;