var mongoose = require("mongoose");
var redditjs = require('reddit.js');
 
var redditpostSchema = new mongoose.Schema({
   title: String,
   content: String,
   link: String 
});
 
module.exports = mongoose.model("Redditpost", redditpostSchema);