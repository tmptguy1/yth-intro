var mongoose = require("mongoose");

var blogSchema = mongoose.Schema({
    title: String,
    date: {type: Date, default: Date.now},
    content: String,
});

module.exports = mongoose.model("Blog", blogSchema);