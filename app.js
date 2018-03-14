var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    reddit     = require("redwrap"),
    Topgamevid = require("./models/topgamevid"),
    mongoose   = require("mongoose"),
    todaysDate = Date.now();
    // Redditpost = require("./models/redditpost");

console.log(todaysDate);    
    
mongoose.connect("mongodb://localhost/yt_home_page");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));


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

 
//   reddit.r('games').limit(10, function(err, data, res){
//      //lists out all of the youtube links on /r/gaming  first data is for variable, second is for the json structure
//       data.data.children.forEach(function(item){
//           if(item.data.url.indexOf("youtube") > -1 || item.data.url.indexOf("youtu.be") > -1){
//             console.log(item.data.url); 
          
//                   //get data from API and add to array
//               var title = item.data.secure_media.oembed.title;
//               var longLink = item.data.url;
//               var link = "";
//               var author = item.data.secure_media.oembed.author_name;
              
              
//               if(item.data.url.indexOf("watch") > -1){
//                   link = longLink.slice(longLink.indexOf('=') + 1, longLink.indexOf('=') + 12);
//               } else{
//                   link = item.data.url.substring(item.data.url.lastIndexOf('/') + 1);
//                   console.log("This is the else statement");
//               }
//               var newTopgamevid = {title: title, link: link, author: author};
       
//       //Create a new Topgamevid and save to db
//       Topgamevid.create(newTopgamevid, function(err, newlyCreated){
//           if(err){
//               console.log(err);
//           } else{
//               //redirect to campgrounds page
//               console.log(newlyCreated);
//       }
//   });
      
//       //create new card on landing if it does not exist
      
//       //
      
//       }
//   });
// }); 
   


}); 
    
app.listen(process.env.PORT, process.env.IP, function(){
console.log("The YT Page server  has started!")
});