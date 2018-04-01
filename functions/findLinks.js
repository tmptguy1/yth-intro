var request  = require("request"),
    cheerio  = require("cheerio"),
    Youtuber = require("../models/youtuber");

function findLinks(req, res, foundYoutuber){
    request(foundYoutuber.ytLink, function(error, response, body) {
              if(error) { return  console.error('There was an error!'); }
              
              var $ = cheerio.load(body);
            
              $('a').each(function() {
                var text = $(this).text();
                var link = $(this).attr('href');
                
                if(link != undefined && (link.indexOf("twitter") > -1 || link.indexOf("facebook") > -1 || link.indexOf("instagram") > -1 || link.indexOf("steam") > -1 || link.indexOf("twitch") > -1 || link.indexOf("discord") > -1)){
                    if(link.indexOf("twitter") > -1){
                      Youtuber.findByIdAndUpdate(foundYoutuber._id, {twitterLink: link}, function(err, doc){
                        console.log("Your twitter link is " + link);
                      });
                      
                      }
                    if(link.indexOf("facebook") > -1){
                      Youtuber.findByIdAndUpdate(foundYoutuber._id, {facebookLink: link}, function(err, doc){
                        console.log("Your facebook link is " + link);
                      });
                    }
                    if(link.indexOf("instagram") > -1){
                      var instaId = link.slice(link.lastIndexOf('instagram.com/') + 14, link.length);
                        if(instaId.slice(-1) === "/"){
                          instaId = instaId.substring(0, instaId.length-1);
                        }
                            console.log("Your instaID is " + instaId);
                            Youtuber.findByIdAndUpdate(foundYoutuber._id, {instaLink: link, instaId: instaId}, function(err, doc){
                              console.log("Your insta link is " + link);
                            });
                          
                    }
                    if(link.indexOf("steam") > -1){
                      Youtuber.findByIdAndUpdate(foundYoutuber._id, {steamGroupLink: link}, function(err, doc){
                        console.log("Your steam group link is " + link);
                      });
                    }
                    if(link.indexOf("twitch") > -1){
                      var twitchId = link.slice(link.lastIndexOf('twitch.tv/') + 10, link.length);
                        if(twitchId.slice(-1) === "/"){
                          twitchId = twitchId.substring(0, twitchId.length-1);
                        }
                            console.log("Your twitchID is " + twitchId);
                            Youtuber.findByIdAndUpdate(foundYoutuber._id, {twitchLink: link, twitchId: twitchId}, function(err, doc){
                              console.log("Your twitch link is " + link);
                            });
                          
                      }
                    if(link.indexOf("discord") > -1){
                      Youtuber.findByIdAndUpdate(foundYoutuber._id, {discordLink: link}, function(err, doc){
                        console.log("Your discord link is " + link);
                      });
                    }
                    
                console.log(text + "----->" + link);
                }
                
                
                
            
                // if(link && link.match(/subjectID/)){
                //   console.log(text + ' --> ' + link);
                // };
              });
            });
}

module.exports = findLinks;