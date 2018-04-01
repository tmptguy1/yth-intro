var request = require("request");


function getChannelId(req, res, videoId){
        request(
               {url: "https://www.googleapis.com/youtube/v3/videos", qs:{
                part: "snippet",
                videoId: videoId,
                key: process.env.YOUTUBE_API_KEY
               }}, function(err, response, body){
                  if(err){
                    console.log(err);
                  } else{
                    
                    var data = JSON.parse(body);
                    for(var i=0; i < data["items"].length; i++){
                      console.log("how many times is this running   " + i);
                      var channelId = data["items"][i]["snippet"]["channelId"];
                    
                      
                      return channelId;
                      
                      
                    
                      
                      
                    };
                  }
               });
}

module.exports = getChannelId;