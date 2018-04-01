var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    reddit          = require("redwrap"),
    Topgamevid      = require("./models/topgamevid"),
    Upload          = require("./models/upload"),
    Youtuber        = require("./models/youtuber"),
    methodOverride  = require("method-override"),
    mongoose        = require("mongoose"),
    todaysDate      = Date.now(),
    findTopGameVids = require("./functions/findTopGameVids.js");
    // Redditpost = require("./models/redditpost");



    //requiring routes
    var registryRoutes    = require("./routes/registry");
    var scheduleRoutes    = require("./routes/schedule");
    var noticeRoutes      = require("./routes/notice");
    var blogRoutes        = require("./routes/blog");
        // videoRoutes = require("./routes/videos"),
        // indexRoutes       = require("./routes/index");   
    
mongoose.connect("mongodb://localhost/yt_home_page");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static("public"));

//app.use(indexRoutes);
//app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/registry", registryRoutes);
app.use(scheduleRoutes);
app.use(noticeRoutes);
app.use(blogRoutes);


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

 
//  findTopGameVids('games');
           


}); 

// app.get("/registry", function(req, res){
//     res.render("registry/index");
//     });



    
app.listen(process.env.PORT, process.env.IP, function(){
console.log("The YT Page server  has started!")
});