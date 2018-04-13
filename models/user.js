var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true},
    username: {type: String, unique: true, required: true},
    password: String,
    channelId: String,
    youtuberId: String,
    firstName: String,
    lastName: String,
    createdAt: {type: Date, default: Date.now }, 
    isAdmin: {type: Boolean, default: false}
    
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);