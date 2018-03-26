var mongoose = require("mongoose");

var uploadSchema = mongoose.Schema({
    title: String,
    date: Date,
    link: String,
    checkedDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Upload", uploadSchema);