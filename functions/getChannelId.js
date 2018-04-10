var request = require("request");
var createYoutuber = require("./createYoutuber.js");


function getChannelId(videoId){
         request(
               {url: "https://www.googleapis.com/youtube/v3/videos", qs:{
                part: "snippet",
                id: videoId,
                key: process.env.YOUTUBE_API_KEY
               }}, function(err, response, body){
                  if(err){
                    console.log(err);
                  } else{
                    
                    var data = JSON.parse(body);
                    console.log(data);
                    // for(var i=0; i < 1; i++){
                    //   console.log("how many times is this running   " + i);
                      var channelId = data["items"][0]["snippet"]["channelId"];
                        console.log(channelId);
                      
                      createYoutuber(channelId);
                    // };
                  }
               });
}

module.exports = getChannelId;