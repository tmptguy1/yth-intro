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
                    data["items"].forEach(function(vid){
                      console.log("how many times is this running   ");
                      var uploadLink = vid["id"]["videoId"];
                      var date = vid["snippet"]["publishedAt"];
                      var title = vid["snippet"]["title"];
                      
                      
                            var newUpload = {link: uploadLink, date: date, title: title};
                            console.log("this is my new upload" + newUpload);
                              Upload.create(newUpload, function(err, upload){
                              console.log("ADD TO DB");
                              console.log(newUpload);
                              if(err){
                                  // req.flash('error', err.message);
                                  
                              } else {
                                
                                
                                foundYoutuber.uploads.push(upload);
                                          foundYoutuber.save();
                                          console.log("Created new upload" + upload._id);
                                        
                              }
                            });
                          
                    });
                    
                    console.log("findlatestvids " + foundYoutuber.uploads);
                    
                  }
               });
               
}

module.exports = findLatestVids;