var mongoose = require("mongoose");


var topGameVidSchema = new mongoose.Schema({
   title: String,
   link: String,
   author: String,
   created: {type: Date, default: Date.now}
   
});
 
module.exports = mongoose.model("Topgamevid", topGameVidSchema);
