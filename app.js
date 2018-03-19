var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    reddit     = require("redwrap"),
    Topgamevid = require("./models/topgamevid"),
    Youtuber = require("./models/youtuber"),
    mongoose   = require("mongoose"),
    todaysDate = Date.now();
    // Redditpost = require("./models/redditpost");

    //requiring routes
    var registryRoutes    = require("./routes/registry");
        // videoRoutes = require("./routes/videos"),
        // indexRoutes       = require("./routes/index");   
    
mongoose.connect("mongodb://localhost/yt_home_page");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

//app.use(indexRoutes);
//app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/registry", registryRoutes);


app.get("/", function(req, res){
    var perPage = 10;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    var totalVids = 0;
    var allVidsActual = [];
    var count = 0;
    var skipNum = 0;

    Topgamevid.find({}, function(err, allVids){
        if(err){
                 console.log("err");
             }  else{
        allVidsActual = allVids.reverse();
        console.log("made it to reverse");
        count = allVids.length;
        console.log(count);
        skipNum = count - perPage * pageNumber;
        if(skipNum < 0){
            skipNum = 0;
        }
             }
    
        Topgamevid.find({}).skip(skipNum).limit(perPage).exec(function(err, topgamevids){
            if(err){
                     console.log(err);
                 }  else{
                    console.log(pageNumber);
                    console.log(totalVids);
                    console.log(topgamevids.length);
                    console.log(count - perPage * pageNumber);
            
                        Topgamevid.count().exec(function (err, count){
                             if(err){
                                 console.log("err");
                             }  else{
                                 res.render("landing", {
                                     topgamevids: topgamevids,
                                     current: pageNumber,
                                     pages: Math.ceil(count / perPage)
                                 });
                             }
                        });
                 }
        });
    });

 
//   reddit.r('games').limit(50, function(err, data, res){
//      //lists out all of the youtube links on /r/gaming  first data is for variable, second is for the json structure
//       data.data.children.forEach(function(item){
          
//           if(item.data.url.indexOf("www.youtube") > -1 || item.data.url.indexOf("youtu.be") > -1){
//               if(item.data.media === null){
//                   console.log(item.data.url + " this is a bad one");
//               } else {
                  
//               if(item.data.media.oembed.html && item.data.media.oembed.html.indexOf("https://www.youtube.com/embed/") > -1){
              
//                       //get data from API and add to array
//                   var title = item.data.secure_media.oembed.title;
//                   var longLink = item.data.media.oembed.html;
//                   var link = longLink.slice(longLink.indexOf('embed/') + 6, longLink.indexOf('embed') + 17);
//                   var author = item.data.secure_media.oembed.author_name;
                  
//                   Topgamevid.findOne({link: link}, function(err, res){
//                       if(res){
//                           console.log(item.data.url);
//                           console.log("we found it, do not add to db");
//                       } else{
//                                 console.log(item.data.url);
//                                 console.log("NEW, ADD TO DB");
//                               var newTopgamevid = {title: title, link: link, author: author};
//                               //Create a new Topgamevid and save to db
//                               Topgamevid.create(newTopgamevid, function(err, newlyCreated){
//                                   if(err){
//                                       console.log(err);
//                                   } else{
//                                       console.log(newlyCreated);
//                                     }
//                                 });
//                             }
//                         });
                          
//                       }
            
          
//               }
//               }
//           });
//         }); 
           


}); 

// app.get("/registry", function(req, res){
//     res.render("registry/index");
//     });



    
app.listen(process.env.PORT, process.env.IP, function(){
console.log("The YT Page server  has started!")
});