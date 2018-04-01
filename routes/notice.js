var express = require("express");
var router  = express.Router({mergeParams: true});
var Youtuber = require("../models/youtuber");
var Notice   = require("../models/notice");


//NEW - show form to create a notice
router.get("/registry/:id/notice/new", function(req, res){
    // find youtuber by id
    Youtuber.findById(req.params.id, function(err, youtuber){
        if(err){
            console.log(err);
        } else {
             res.render("notice/new", {youtuber: youtuber});
        }
    })
});

//Notice create
router.post("/registry/:id/notice", function(req, res){
   //lookup youtuber using ID
   Youtuber.findById(req.params.id, function(err, youtuber){
       if(err){
           console.log(err);
           res.redirect("/registry/:id");
       } else {
           console.log(req.body.notice);
        Notice.create(req.body.notice, function(err, notice){
           if(err){
            //   req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //save schedule
               console.log(notice);
            //   schedule.save();
               youtuber.notices.push(notice);
               youtuber.save();
            //   req.flash("success", "Successfully Created Notice");
               res.redirect('/registry/' + youtuber._id);
           }
        });
       }
   });
 
});

//edit route
router.get("/registry/:id/notice/:notice_id/edit", function(req,res){
    
    Youtuber.findById(req.params.id, function(err, foundYoutuber){
        if(err || !foundYoutuber){
            // req.flash("error", "No campground found");
            return res.redirect("back");
        }
    
        Notice.findById(req.params.notice_id, function(err, foundNotice){
            if(err){
                res.redirect("back");
            } else {
                res.render("notice/edit", {youtuber: foundYoutuber, notice: foundNotice});
            }
        });
        
    });
    
});

//update notice route
router.put("/registry/:id/notice/:notice_id", function(req, res){
    Notice.findByIdAndUpdate(req.params.notice_id, req.body.notice, function(err, updatedNotice){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/registry/" + req.params.id);
        }
    });
});

//destroy route
router.delete("/registry/:id/notice/:notice_id", function(req, res){
    //findbyid and remove
    Notice.findByIdAndRemove(req.params.notice_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            // req.flash("success", "Comment deleted");
            res.redirect("/registry/" + req.params.id);
        }
    });
});

module.exports = router;