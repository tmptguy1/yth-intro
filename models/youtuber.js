var mongoose = require("mongoose");


var youtuberSchema = new mongoose.Schema({
   ytUsername: String,
   ytUserId: String,
   ytLink: String,
   twitterUsername: String,
   twitterLink: String,
   facebookLink: String,
   googlePlusLink: String,
   steamGroupLink: String,
   discordLink: String,
   storeLink: String,
   description: String,
   location: String,
   image: String,
   ownerClaimed: {type: Boolean, default: false},
   thumbSmall: String,
   thumbMed: String,
   thumbLarge: String,
   created: {type: Date, default: Date.now}
   
});
 
module.exports = mongoose.model("Youtuber", youtuberSchema);