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
   patreonLink: String,
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
   ],
   schedules: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Schedule"
      }
   ],
   notices: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Notice"
      }
   ],
   blogs: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Blog"
      }
   ]
});
 
module.exports = mongoose.model("Youtuber", youtuberSchema);