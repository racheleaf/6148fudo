var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	name: String,
	phone: String,
	email: String,
	about: String,
	profilepic: String,
	savedPosts: Array
});

var User = mongoose.model('User', userSchema);

module.exports = User;
