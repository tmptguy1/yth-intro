var reddit     = require("redwrap"),
    Topgamevid = require("../models/topgamevid"),
    getChannelId  = require("./getChannelId.js"),
    createYoutuber     = require("./createYoutuber.js");


function findTopGameVids(sub){
    console.log(sub);
  reddit.r(sub).limit(50, function(err, data, res){
      console.log(data);
      console.log(sub);
     //lists out all of the youtube links on /r/gaming  first data is for variable, second is for the json structure
      data.data.children.forEach(function(item){
          
          if(item.data.url.indexOf("www.youtube") > -1 || item.data.url.indexOf("youtu.be") > -1){
              if(item.data.media === null){
                  console.log(item.data.url + " this is a bad one");
              } else {
                  
              if(item.data.media.oembed.html && item.data.media.oembed.html.indexOf("https://www.youtube.com/embed/") > -1){
              
                      //get data from API and add to array
                  var title = item.data.secure_media.oembed.title;
                  var longLink = item.data.media.oembed.html;
                  var link = longLink.slice(longLink.indexOf('embed/') + 6, longLink.indexOf('embed') + 17);
                  var author = item.data.secure_media.oembed.author_name;
                  
                  
                                      
                  
                  Topgamevid.findOne({link: link}, function(err, res){
                      if(res){
                          console.log(item.data.url);
                          console.log("we found it, do not add to db");
                      } else{
                                console.log(item.data.url);
                                console.log("NEW, ADD TO DB");
                              var newTopgamevid = {title: title, link: link, author: author};
                              //Create a new Topgamevid and save to db
                              Topgamevid.create(newTopgamevid, function(err, newlyCreated){
                                  if(err){
                                      console.log(err);
                                  } else{
                                      console.log(newlyCreated);
                                      getChannelId(link);
                                      
                                    }
                                });
                                
                            }
                        });
                          
                      }
            
          
              }
              }
              
          });
        }); 
}

module.exports = findTopGameVids;