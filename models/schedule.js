var mongoose = require("mongoose");

var scheduleSchema = new mongoose.Schema({
    uploadFrequency: String,
    streamLocation: String,
    sunday: String,
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    timeZone: String
});

module.exports = mongoose.model("Schedule", scheduleSchema);