// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ScrapeSchema = new Schema({
  // title is a required string
  headline: {
    type: String,
    required: true
  },
   summary: {
    type: String,
    required: false
  },
  // link is a required string
  link: {
    type: String,
    required: true
  },  
  createDt: {
    type: Date,
    required: true
  },
    savedFlag: {
    type: Boolean,
    default: 0
  }

});

// Create the Scrape model with the ScrapeSchema
var Scrape = mongoose.model("Scrape", ScrapeSchema);

// Export the model
module.exports = Scrape;