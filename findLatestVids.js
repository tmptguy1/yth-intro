var request = require("request");
var Upload = require("./models/upload");

function findLatestVids(foundYoutuber){
        request(
               {url: "https://www.googleapis.com/youtube/v3/search?", qs:{
                part: "snippet",
                maxResults: "6",
                channelId: foundYoutuber.ytUserId,
                order: "date",
                key: process.env.YOUTUBE_API_KEY
               }}, function(err, response, body){
                  if(err){
                    console.log(err);
                  } else{
                    
                    var data = JSON.parse(body);
                    for(var i=0; i < data["items"].length; i++){
                      console.log("how many times is this running   " + i);
                      var uploadLink = data["items"][i]["id"]["videoId"];
                      var date = data["items"][i]["snippet"]["publishedAt"];
                      var title = data["items"][i]["snippet"]["title"];
                      
                      var newUpload = {link: uploadLink, date: date, title: title};
                      console.log("this is my new upload" + newUpload);
                      
                      
                    
                      Upload.create(newUpload, function(err, upload){
                        console.log("Is this creating too many uploads  " + i);
                        if(err){
                            // req.flash('error', err.message);
                            
                        } else {
                          
                          
                          foundYoutuber.uploads.push(upload);
                                    foundYoutuber.save();
                                    console.log("Created new upload" + upload._id);
                          
                        }
                      });
                      
                    };
                  }
               });
}

module.exports = findLatestVids;