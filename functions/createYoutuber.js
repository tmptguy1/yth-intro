var request = require("request");
var Youtuber = require("../models/youtuber");
var findLatestVids   = require("../findLatestVids.js");
var findLinks     = require("./findLinks.js");
var getTwitchId     = require("./getTwitchId.js");



function createYoutuber(channelId){
        request(
               {url: "https://www.googleapis.com/youtube/v3/channels", qs:{
                part: "snippet,contentDetails",
                id: channelId,
                key: process.env.YOUTUBE_API_KEY
               }}, function(err, response, body){
                  if(err){
                    console.log(err);
                  } else{
                    
                    var data = JSON.parse(body);
                    console.log(body);
                    // for(var i=0; i < 1; i++){
                      console.log("how many times is this running   ");
                      var ytName = data["items"][0]["snippet"]["title"];
                      var desc = data["items"][0]["snippet"]["description"];
                      var ytId = channelId;
                      var link = "https://www.youtube.com/channel/" + channelId;
                      var uploadPlaylist = data["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"];
                      
                      var thumbSmall = data["items"][0]["snippet"]["thumbnails"]["default"]["url"];
                      var thumbMed = data["items"][0]["snippet"]["thumbnails"]["medium"]["url"];
                      var thumbLarge = data["items"][0]["snippet"]["thumbnails"]["high"]["url"];
                      
                      
                     
                      
                      var newYoutuber= {ytUsername: ytName, ytUserId: ytId, ytLink: link, uploadPlaylist: uploadPlaylist, description: desc, thumbSmall: thumbSmall, thumbMed: thumbMed, thumbLarge: thumbLarge};
                          Youtuber.create(newYoutuber, function(err, newlyCreated){
                            if(err){
                                // req.flash('error', err.message);
                                
                            } else {
                                //redirect to the new Youtuber page
                                //console.log(newlyCreated);
                                //res.redirect('/registry' + newlyCreated.id);
                               
                              
                              findLinks(newlyCreated, function(req, res, body){
                                 console.log("twitch id " + newlyCreated.twitchId);
                                 getTwitchId(newlyCreated); 
                              });
                              
                              findLatestVids(newlyCreated);
                              
                                
                            }
                        });
                      
                    // };
                  }
               });
               
}

module.exports = createYoutuber;