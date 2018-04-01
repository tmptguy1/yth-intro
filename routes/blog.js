var express = require("express");
var router  = express.Router({mergeParams: true});
var Youtuber = require("../models/youtuber");
var Blog   = require("../models/blog");


//NEW - show form to create a notice
router.get("/registry/:id/blogs/new", function(req, res){
    // find youtuber by id
    Youtuber.findById(req.params.id, function(err, youtuber){
        if(err){
            console.log(err);
        } else {
             res.render("blogs/new", {youtuber: youtuber});
        }
    })
});

//blog create
router.post("/registry/:id/blogs", function(req, res){
   //lookup youtuber using ID
   Youtuber.findById(req.params.id, function(err, youtuber){
       if(err){
           console.log(err);
           res.redirect("/registry/:id");
       } else {
           console.log(req.body.blog);
        Blog.create(req.body.blog, function(err, blog){
           if(err){
            //   req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //save schedule
               console.log(blog);
            //   schedule.save();
               youtuber.blogs.push(blog);
               youtuber.save();
            //   req.flash("success", "Successfully Created blog");
               res.redirect('/registry/' + youtuber._id);
           }
        });
       }
   });
 
});

//edit route
router.get("/registry/:id/blogs/:blog_id/edit", function(req,res){
    
    Youtuber.findById(req.params.id, function(err, foundYoutuber){
        if(err || !foundYoutuber){
            // req.flash("error", "No campground found");
            return res.redirect("back");
        }
    
        Blog.findById(req.params.blog_id, function(err, foundBlog){
            if(err){
                res.redirect("back");
            } else {
                res.render("blogs/edit", {youtuber: foundYoutuber, blog: foundBlog});
            }
        });
        
    });
    
});

//update blog route
router.put("/registry/:id/blogs/:blog_id", function(req, res){
    Blog.findByIdAndUpdate(req.params.blog_id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/registry/" + req.params.id);
        }
    });
});

//destroy route
router.delete("/registry/:id/blogs/:blog_id", function(req, res){
    //findbyid and remove
    Blog.findByIdAndRemove(req.params.blog_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            // req.flash("success", "Comment deleted");
            res.redirect("/registry/" + req.params.id);
        }
    });
});

module.exports = router;