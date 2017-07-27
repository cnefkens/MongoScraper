var express = require("express");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
var Scrape = require("./models/Scrape.js");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

var bodyParser = require("body-parser");
var methodOverride = require("method-override");
mongoose.Promise = Promise;
var databaseUri='mongodb://localhost/mongoscraper';

// Connect to localhost if not a production environment
if(process.env.MONGODB_URI) {
  mongoose.connect('(process.env.MONGODB_UR');
}
else{
  mongoose.connect(databaseUri);
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

const routes = require('./routes/routes.js')(express,request, cheerio, db, exphbs, Scrape, Article, Note, app);
// Main route (simple Hello World Message)
app.use('/',routes);
app.use('/saved',routes);
app.use('/notes',routes);
app.use('/scrape',routes);

app.listen(PORT, function() {
  console.log("Listening on port:%s", PORT);
});
