var express = require("express");
var router  = express.Router({mergeParams: true});
var Youtuber = require("../models/youtuber");
var Upload = require("../models/upload");
var Schedule = require("../models/schedule");
var Notice   = require("../models/notice");
var request = require("request");
var youtubeSearch = require("youtube-search");
var createYoutuber = require("../functions/createYoutuber.js");
var findUploads   = require("../findUploads.js");
var findLatestVids   = require("../findLatestVids.js");
var findLinks     = require("../functions/findLinks.js");

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
    
      // console.dir(results);
      var ytId = results[0].channelId;
      createYoutuber(ytId);
      
    //   //retrieve uploaded playlist from youtube API
      
    
    // //Create a new Youtuber and save to DB, this saves just the first response

      
    //   var ytName = results[0].channelTitle;
    //   var desc = results[0].description;
    //   
    //   var link = results[0].link;
      
      
    //   //get thumbnails from YT API
    //   console.log(results[0].thumbnails.default.url)
      
    //   var thumbSmall = results[0].thumbnails.default.url;
    //   var thumbMed = results[0].thumbnails.medium.url;
    //   var thumbLarge = results[0].thumbnails.high.url;
      
     
    // request(
    //   {url: "https://www.googleapis.com/youtube/v3/channels?", qs:{
    //     part: "snippet,contentDetails,statistics",
    //     id: ytId,
    //     key: process.env.YOUTUBE_API_KEY
    //   }}, function(err, response, body){
    //       if(err){
    //         console.log(err);
    //       }
    //       var data = JSON.parse(body);
    //       console.log(data["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]);
    //       var uploadPlaylist = data["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"];
          
    //       var newYoutuber= {ytUsername: ytName, ytUserId: ytId, ytLink: link, uploadPlaylist: uploadPlaylist, description: desc, thumbSmall: thumbSmall, thumbMed: thumbMed, thumbLarge: thumbLarge};
            
    //         Youtuber.create(newYoutuber, function(err, newlyCreated){
    //           if(err){
    //               req.flash('error', err.message);
    //               return res.redirect('back');
    //           } else {
    //               //redirect to the new Youtuber page
    //               //console.log(newlyCreated);
    //               //res.redirect('/registry' + newlyCreated.id);
                 
    //             findLatestVids(newlyCreated);
    //             findLinks(newlyCreated);
    //               res.redirect("/registry");
    //           }
    //       });
    //   });
      
      res.redirect("/registry");
     
    });
  
});

//NEW - show form to create new youtuber
router.get("/new", function(req, res){
   res.render("registry/new"); 
});

// SHOW - shows more info about one youtuber
router.get("/:id", function(req, res){
    //find the youtuber with provided ID
    Youtuber.findById(req.params.id).populate("uploads").populate("schedules").populate("notices").populate("blogs").exec(function(err, foundYoutuber){
        if(err || !foundYoutuber){
            // req.flash("error", "Creator not found");
            res.redirect("back");
        } else {
            console.log(foundYoutuber)
            //render show template with that youtuber

            
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