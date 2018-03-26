var mongoose = require("mongoose");


var youtuberSchema = new mongoose.Schema({
   ytUsername: String,
   ytUserId: String,
   ytLink: String,
   uploadPlaylist: String,
   twitterUsername: String,
   twitterLink: String,
   facebookLink: String,
   googlePlusLink: String,
   steamGroupLink: String,
   instaId: String,
   instaLink: String,
   discordLink: String,
   twitchId: String,
   twitchLink: String,
   storeLink: String,
   description: String,
   location: String,
   image: String,
   ownerClaimed: {type: Boolean, default: false},
   thumbSmall: String,
   thumbMed: String,
   thumbLarge: String,
   created: {type: Date, default: Date.now},
   uploads: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Upload"
      }
   ]
   
});
 
module.exports = mongoose.model("Youtuber", youtuberSchema);