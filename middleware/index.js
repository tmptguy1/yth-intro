var Youtuber = require("../models/youtuber");


// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkYoutuberOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Youtuber.findById(req.params.id, function(err, foundYoutuber){
           if(err || !foundYoutuber){
            //   req.flash("error", "Creator not found");
            console.log(err);
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundYoutuber._id.equals(req.user.youtuberId) || req.user.isAdmin) {
                next();
            } else {
                // req.flash("error", "You do not have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        // req.flash("error", "You need to be logged in to do that")
        res.redirect("back");
    }
}

// middlewareObj.checkCommentOwnership = function(req, res, next) {
//  if(req.isAuthenticated()){
//         Comment.findById(req.params.comment_id, function(err, foundComment){
//           if(err || !foundComment){
//               req.flash("error", "Comment not found");
//               res.redirect("back");
//           }  else {
//               // does user own the comment?
//             if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
//                 next();
//             } else {
//                 req.flash("error", "You do not have permission to do that");
//                 res.redirect("back");
//             }
//           }
//         });
//     } else {
//         req.flash("error", "You need to be logged into to do that");
//         res.redirect("back");
//     }
// }

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    //this line does not display it. It gives the capability to show the message on the next request
    // req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;