var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    reddit          = require("redwrap"),
    cron            = require('cron'),
    Topgamevid      = require("./models/topgamevid"),
    Upload          = require("./models/upload"),
    User            = require("./models/user"),
    Youtuber        = require("./models/youtuber"),
    methodOverride  = require("method-override"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    todaysDate      = Date.now(),
    createYoutuber  = require("./functions/createYoutuber.js"),
    getChannelId  = require("./functions/getChannelId.js"),
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

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Maya is the best dog!",
    resave: false,
    saveUninitialized: false
    
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

//app.use(indexRoutes);
//app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/registry", registryRoutes);
app.use(scheduleRoutes);
app.use(noticeRoutes);
app.use(blogRoutes);

//cronjob to get youtube links
var sub = "games"
var job = new cron.CronJob('00 25 17 * * *', function() {
  findTopGameVids(sub);
  console.log("job ran");
}, null, true, 'America/Los_Angeles');



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
                                // getChannelId("_K1ocyRKGdA");
                                
                             }
                        });
                 }
        });
    });
});    
//AUTH ROUTES

//show sign up form
app.get("/register", function(req, res){
    res.render("register");
});

//handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username, email: req.body.email})
   User.register(newUser, req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req, res, function(){
           res.redirect("/registry");
       })
   })
});

//show login form
app.get("/login", function(req, res) {
   res.render("login"); 
});

//login
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/registry",
        failureRedirect: "/login"
    }), function(req, res){
    
});

//logout route
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/registry");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
 
//  findTopGameVids(req, res, sub);
    // getChannelId(req, res, "_K1ocyRKGdA", function(channelId){
    //     console.log(channelId);
    // });
    // var channelId = getChannelId(req, res, "_K1ocyRKGdA");
    // console.log(channelId);
    // createYoutuber(req, res, channelId);
          


 

// app.get("/registry", function(req, res){
//     res.render("registry/index");
//     });



    
app.listen(process.env.PORT, process.env.IP, function(){
console.log("The YT Page server  has started!")
});