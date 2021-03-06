var request = require("request");
var Upload = require("./models/upload");

function findUploads(req, res, foundYoutuber){
        request(
               {url: "https://www.googleapis.com/youtube/v3/playlistItems?", qs:{
                part: "snippet,contentDetails",
                maxResults: "6",
                playlistId: foundYoutuber.uploadPlaylist,
                key: process.env.YOUTUBE_API_KEY
               }}, function(err, response, body){
                  if(err){
                    console.log(err);
                  } else{
                    
                    var data = JSON.parse(body);
                    for(var i=0; i < data["items"].length; i++){
                      console.log("how many times is this running   " + i);
                      var uploadLink = data["items"][i]["contentDetails"]["videoId"];
                      var date = data["items"][i]["contentDetails"]["videoPublishedAt"];
                      var title = data["items"][i]["snippet"]["title"];
                      
                      var newUpload = {link: uploadLink, date: date, title: title};
                      console.log("this is my new upload" + newUpload);
                      
                      
                    
                      Upload.create(newUpload, function(err, upload){
                        console.log("Is this creating too many uploads  " + i);
                        if(err){
                            // req.flash('error', err.message);
                            return res.redirect('back');
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

module.exports = findUploads;