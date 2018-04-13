var express = require("express");
var router  = express.Router({mergeParams: true});
var Youtuber = require("../models/youtuber");
var Schedule = require("../models/schedule");
var request = require("request");
var middleware = require("../middleware");


//NEW - show form to create a schedule
router.get("/registry/:id/schedule/new", middleware.checkYoutuberOwnership, function(req, res){
    // find youtuber by id
    Youtuber.findById(req.params.id, function(err, youtuber){
        if(err){
            console.log(err);
        } else {
             res.render("schedule/new", {youtuber: youtuber});
        }
    })
});

//Schedule create
router.post("/registry/:id/schedule", middleware.checkYoutuberOwnership, function(req, res){
   //lookup youtuber using ID
   Youtuber.findById(req.params.id, function(err, youtuber){
       if(err){
           console.log(err);
           res.redirect("/registry/:id");
       } else {
           console.log(req.body.schedule);
        Schedule.create(req.body.schedule, function(err, schedule){
           if(err){
            //   req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //save schedule
               console.log(schedule);
            //   schedule.save();
               youtuber.schedules.push(schedule);
               youtuber.save();
            //   req.flash("success", "Successfully Created Schedule");
               res.redirect('/registry/' + youtuber._id);
           }
        });
       }
   });
 
});

//edit route
router.get("/registry/:id/schedule/:schedule_id/edit", middleware.checkYoutuberOwnership, function(req,res){
    
    Youtuber.findById(req.params.id, function(err, foundYoutuber){
        if(err || !foundYoutuber){
            // req.flash("error", "No campground found");
            return res.redirect("back");
        }
    
        Schedule.findById(req.params.schedule_id, function(err, foundSchedule){
            if(err){
                res.redirect("back");
            } else {
                res.render("schedule/edit", {youtuber: foundYoutuber, schedule: foundSchedule});
            }
        });
        
    });
    
});

//update schedule route
router.put("/registry/:id/schedule/:schedule_id", middleware.checkYoutuberOwnership, function(req, res){
    Schedule.findByIdAndUpdate(req.params.schedule_id, req.body.schedule, function(err, updatedSchedule){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/registry/" + req.params.id);
        }
    });
});

//destroy route
router.delete("/registry/:id/schedule/:schedule_id", middleware.checkYoutuberOwnership, function(req, res){
    //findbyid and remove
    Schedule.findByIdAndRemove(req.params.schedule_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            // req.flash("success", "Comment deleted");
            res.redirect("/registry/" + req.params.id);
        }
    });
});

module.exports = router;