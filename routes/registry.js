var express = require("express");
var router  = express.Router({mergeParams: true});
var Youtuber = require("../models/youtuber");
var Upload = require("../models/upload");
var Schedule = require("../models/schedule");
var Notice   = require("../models/notice");
var request = require("request");
var createYoutuber = require("../functions/createYoutuber.js");
var findUploads   = require("../findUploads.js");
var findLatestVids   = require("../findLatestVids.js");
var findLinks     = require("../functions/findLinks.js");

const cheerio = require('cheerio');


//var bodyParser  = require("body-parser");

//router.use(bodyParser.urlencoded({extended: true}));


//INDEX - show all Youtbers
router.get("/", function(req, res){
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get fuzzy match youtubers from DB
        Youtuber.find({ytUsername: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allYoutubers) {
                Youtuber.count({ytUsername: regex}).exec(function (err, count) {
                   if(err){
                       console.log(err);
                       res.redirect("back");
                   } else {
                       console.log(allYoutubers.length);
                     res.render("registry/index", {
                                youtubers: allYoutubers,
                                current: pageNumber,
                                pages: Math.ceil(count / perPage),
                                search: req.query.search
                            });
                   }
                });
        });
        } else{
            
        
        // Get all Youtubers from DB
        Youtuber.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allYoutubers) {
            Youtuber.count().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("registry/index", {
                        youtubers: allYoutubers,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage)
                    });
                }
            });
        });
    }
    
    
    // // Get all Youtbers from DB
    // Youtuber.find({}, function(err, allYoutubers){
    //   if(err){
    //       console.log(err);
    //   } else {
    //           console.log(allYoutubers.length);
    //             res.render("registry/index",{youtubers:allYoutubers});

    //         }
      
    // });
    
});

//CREATE - add new Youtuber to DB
router.post("/", function(req, res) {
  // get data from form
  console.log(req.body);
  console.log(req.body.name);
  console.log(req.body.ytUserID);
  var name = req.body.name;

    console.log(name);
    
    // //call out to Youtube API
    // var opts = {
    //   maxResults: 5,
    //   key: process.env.YOUTUBE_API_KEY
    // };
    
    var searchResults = [];
    
        request(
               {url: "https://www.googleapis.com/youtube/v3/search", qs:{
                part: "snippet",
                q: name,
                type: "channel",
                maxResults: 5,
                key: process.env.YOUTUBE_API_KEY
               }}, function(err, response, body){
                  if(err){
                    console.log(err);
                  } else{
                    
                    var data = JSON.parse(body);
                    console.log(data);
                    console.log(data["items"].length);
                      for(var i=0; i < data["items"].length; i++){
                        console.log("how many times is this running   " + i);
                          var channelId = data["items"][i]["snippet"]["channelId"];
                          var title = data["items"][i]["snippet"]["title"];
                          var image = data["items"][i]["snippet"]["thumbnails"]["default"]["url"];
                          
                          console.log(channelId);
                          console.log(title);
                          console.log(image);
                          
                          searchResults.push({channelId: channelId, title: title, image: image});
                          
                      }
                        res.render("registry/add", {youtubers: searchResults});
                      console.log(searchResults);
                            // console.log(channelId);
      
      
                    // createYoutuber(channelId);
                    
                    // res.redirect("/registry");
                  }
    });
  
});

router.post("/add", function(req, res) {
  console.log(req.body);
  console.log(req.body.channelId);
  var channelId = req.body.channelId;
  
  console.log(channelId);
  createYoutuber(channelId);
  res.redirect("/registry");
  
  
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

//protects against DDOS regex expression in our search
//reuse anywhere a user may input for search
function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;