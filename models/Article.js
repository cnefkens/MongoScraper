// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title is a required string
  headline: {
    type: String,
    required: true,
    unique: true
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
    notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'
}]
  // This only saves one note's ObjectId, ref refers to the Note model

});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
