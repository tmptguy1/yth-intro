var express = require("express");
var router  = express.Router({mergeParams: true});
var Youtuber = require("../models/youtuber");
var Blog   = require("../models/blog");
var sanitizeHtml = require("sanitize-html");
var middleware = require("../middleware");


//NEW - show form to create a notice
router.get("/registry/:id/blogs/new", middleware.checkYoutuberOwnership, function(req, res){
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
router.post("/registry/:id/blogs", middleware.checkYoutuberOwnership, function(req, res){
   //lookup youtuber using ID
   Youtuber.findById(req.params.id, function(err, youtuber){
       if(err){
           console.log(err);
           res.redirect("/registry/:id");
       } else {
           var title = req.body.title;
           console.log(title);
           var dirty = req.body.content;
           var clean = sanitizeHtml(dirty, {
              allowedTags: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
                  'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
                  'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img', 'span' ],
                  allowedAttributes: {
                  a: [ 'href', 'name', 'target' ],
                  img: [ 'src' ],
                  blockquote: [ 'class'],
                  table: [ 'class'],
                  span: [ 'style']
                },
                // Lots of these won't come up by default because we don't allow them
                selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ],
                // URL schemes we permit
                allowedSchemes: [ 'http', 'https', 'ftp', 'mailto' ],
                allowedSchemesByTag: {},
                allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
                allowProtocolRelative: true,
                allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
            });
           console.log(req.body.content);
           console.log("======CLEAN========");
           console.log(clean);
            Blog.create({title: title, content: clean}, function(err, blog){
               if(err){
                //   req.flash("error", "Something went wrong");
                   console.log(err);
               } else {
                   //save blog
                   console.log(blog);
                //   blog.save();
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
router.get("/registry/:id/blogs/:blog_id/edit", middleware.checkYoutuberOwnership, function(req,res){
    
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
router.put("/registry/:id/blogs/:blog_id", middleware.checkYoutuberOwnership, function(req, res){
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