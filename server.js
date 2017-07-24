var express = require("express");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

var bodyParser = require("body-parser");
var methodOverride = require("method-override");
mongoose.Promise = Promise;

// Connect to localhost if not a production environment
if(process.env.NODE_ENV == 'production'){
  mongoose.connect('mongodb://heroku_60zpcwg0:ubn0n27pi2856flqoedo9glvh8@ds119578.mlab.com:19578/heroku_60zpcwg0');
}
else{
  mongoose.connect('mongodb://localhost/mongoscraper');
  // YOU CAN IGNORE THE CONNECTION URL BELOW (LINE 41) THAT WAS JUST FOR DELETING STUFF ON A RE-DEPLOYMENT
  //mongoose.connect('mongodb://heroku_60zpcwg0:ubn0n27pi2856flqoedo9glvh8@ds119578.mlab.com:19578/heroku_60zpcwg0');
}
var db = mongoose.connection;

// Show any Mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// Once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});


var PORT = process.env.PORT || 3000;
var app = express();
// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + "/public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Database configuration

const routes = require('./routes/routes.js')(express,request, cheerio, db, exphbs, Note, Article, app);
// Main route (simple Hello World Message)
app.use('/',routes);
app.use('/saved',routes);
app.use('/articles/articleId',routes);
app.use('/notes/noteId',routes);
app.use('/scrape',routes);

app.listen(PORT, function() {
  console.log("Listening on port:%s", PORT);
});
