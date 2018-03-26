var express = require("express");
var router  = express.Router({mergeParams: true});
var Youtuber = require("../models/youtuber");
var Upload = require("../models/upload");
var request = require("request");
var youtubeSearch = require("youtube-search");
var ChannelsById = require("../quickstart.js");
var findUploads      = require("../findUploads.js")

const cheerio = require('cheerio');
//var bodyParser  = require("body-parser");

//router.use(bodyParser.urlencoded({extended: true}));

//INDEX - show all Youtbers
router.get("/", function(req, res){
    // Get all Youtbers from DB
    Youtuber.find({}, function(err, allYoutubers){
      if(err){
          console.log(err);
      } else {
              console.log(allYoutubers.length);
                res.render("registry/index",{youtubers:allYoutubers});

            }
      
    });
});

//CREATE - add new Youtuber to DB
router.post("/", function(req, res) {
  // get data from form
  console.log(req.body);
  console.log(req.body.name);
  console.log(req.body.ytUserID);
  var name = req.body.name;

    console.log(name);
    
    //call out to Youtube API
    var opts = {
      maxResults: 5,
      key: process.env.YOUTUBE_API_KEY
    };
    
    youtubeSearch(name, opts, function(err, results) {
      if(err){ return console.log(err);}
    
      //console.dir(results);
      
      //retrieve uploaded playlist from youtube API
      
    
    //Create a new Youtuber and save to DB, this saves just the first response

      
      var ytName = results[0].channelTitle;
      var desc = results[0].description;
      var ytId = results[0].channelId;
      var link = results[0].link;
      
      
      //get thumbnails from YT API
      console.log(results[0].thumbnails.default.url)
      
      var thumbSmall = results[0].thumbnails.default.url;
      var thumbMed = results[0].thumbnails.medium.url;
      var thumbLarge = results[0].thumbnails.high.url;
      
     
     request(
       {url: "https://www.googleapis.com/youtube/v3/channels?", qs:{
        part: "snippet,contentDetails,statistics",
        id: ytId,
        key: process.env.YOUTUBE_API_KEY
       }}, function(err, response, body){
          if(err){
            console.log(err);
          }
          var data = JSON.parse(body);
          console.log(data["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]);
          var uploadPlaylist = data["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"];
          
           var newYoutuber= {ytUsername: ytName, ytUserId: ytId, ytLink: link, uploadPlaylist: uploadPlaylist, description: desc, thumbSmall: thumbSmall, thumbMed: thumbMed, thumbLarge: thumbLarge};
            Youtuber.create(newYoutuber, function(err, newlyCreated){
              if(err){
                  req.flash('error', err.message);
                  return res.redirect('back');
              } else {
                  //redirect to the new Youtuber page
                  //console.log(newlyCreated);
                  //res.redirect('/registry' + newlyCreated.id);
                 
                findUploads(req, res, newlyCreated);
                  res.redirect("/registry");
              }
          });
       });
      
     
    });
  
});

//NEW - show form to create new youtuber
router.get("/new", function(req, res){
   res.render("registry/new"); 
});

// SHOW - shows more info about one youtuber
router.get("/:id", function(req, res){
    //find the youtuber with provided ID
    Youtuber.findById(req.params.id).populate("uploads").exec(function(err, foundYoutuber){
        if(err || !foundYoutuber){
            req.flash("error", "Creator not found");
            res.redirect("back");
        } else {
            console.log(foundYoutuber)
            //render show template with that youtuber

            request(foundYoutuber.ytLink, function(error, response, body) {
              if(error) { return  console.error('There was an error!'); }
            
              var $ = cheerio.load(body);
            
              $('a').each(function() {
                var text = $(this).text();
                var link = $(this).attr('href');
                
                if(link != undefined && (link.indexOf("twitter") > -1 || link.indexOf("facebook") > -1 || link.indexOf("instagram") > -1 || link.indexOf("steam") > -1 || link.indexOf("twitch") > -1 || link.indexOf("discord") > -1)){
                    if(link.indexOf("twitter") > -1){
                      Youtuber.findByIdAndUpdate(req.params.id, {twitterLink: link}, function(err, doc){
                        console.log("Your twitter link is " + link);
                      });
                      
                      }
                    if(link.indexOf("facebook") > -1){
                      Youtuber.findByIdAndUpdate(req.params.id, {facebookLink: link}, function(err, doc){
                        console.log("Your facebook link is " + link);
                      });
                    }
                    if(link.indexOf("instagram") > -1){
                      var instaId = link.slice(link.lastIndexOf('instagram.com/') + 14, link.length);
                        if(instaId.slice(-1) === "/"){
                          instaId = instaId.substring(0, instaId.length-1);
                        }
                            console.log("Your instaID is " + instaId);
                            Youtuber.findByIdAndUpdate(req.params.id, {instaLink: link, instaId: instaId}, function(err, doc){
                              console.log("Your insta link is " + link);
                            });
                          
                    }
                    if(link.indexOf("steam") > -1){
                      Youtuber.findByIdAndUpdate(req.params.id, {steamGroupLink: link}, function(err, doc){
                        console.log("Your steam group link is " + link);
                      });
                    }
                    if(link.indexOf("twitch") > -1){
                      var twitchId = link.slice(link.lastIndexOf('twitch.tv/') + 10, link.length);
                        if(twitchId.slice(-1) === "/"){
                          twitchId = twitchId.substring(0, twitchId.length-1);
                        }
                            console.log("Your twitchID is " + twitchId);
                            Youtuber.findByIdAndUpdate(req.params.id, {twitchLink: link, twitchId: twitchId}, function(err, doc){
                              console.log("Your twitch link is " + link);
                            });
                          
                      }
                    if(link.indexOf("discord") > -1){
                      Youtuber.findByIdAndUpdate(req.params.id, {discordLink: link}, function(err, doc){
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
            
            console.log(foundYoutuber.uploadPlaylist);
            // if(!foundYoutuber.uploads.slice(-1)[0]){
            //   console.log("We hit the if statement");
            //     findUploads(req, res, foundYoutuber);
                  
                    res.render("registry/show", {youtuber: foundYoutuber});
                  
            // } else{
            // res.render("registry/show", {youtuber: foundYoutuber});
            // }
        }
    });
});

module.exports = router;