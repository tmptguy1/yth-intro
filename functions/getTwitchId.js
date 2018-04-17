var request  = require("request"),
    Youtuber = require("../models/youtuber");

function getTwitchId(foundYoutuber){
    
    console.log("twitch id " + foundYoutuber.twitchId);
 request(
       {headers: {'Client-ID': 'juyxgfqzk25e9mhqz8s08q28z849kd'}, url: "https://api.twitch.tv/helix/users?", qs:{
        login: foundYoutuber.twitchId
       }}, function(err, response, body){
          if(err){
            console.log(err);
          } else{
    
            var twitchData = JSON.parse(body);
            console.log(body);
            console.log(twitchData);
            
            for(var i=0; i < twitchData["data"].length; i++){
            console.log("how many times is this running   " + i);
              var twitchNumId = twitchData["data"][i]["id"];
              Youtuber.findByIdAndUpdate(foundYoutuber._id, {twitchNumId: twitchNumId}, function(err, doc){
                 console.log("This is your Twitch NumId " + twitchNumId);
      
      
                });
            }
          }
       });
}      
module.exports = getTwitchId;                               