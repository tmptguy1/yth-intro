var mongoose = require("mongoose");

var noticeSchema = mongoose.Schema({
    title: String,
    date: {type: Date, default: Date.now},
    link: String,
    linkLabel: String,
    content: String,
});

module.exports = mongoose.model("Notice", noticeSchema);