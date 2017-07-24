module.exports = (express, request, cheerio, db,exphbs, Note, Article, app)=>{

    //Declare router variable 
    const router = express.Router();

       router.route("/")
        .get((req, res) => {
        //     db.articles.find({}, function(err, data) {
        //     // Log any errors if the server encounters one
        //     if (err) {
        //          console.log(err);
        //     }
        //     // Otherwise, send the result of this query to the browser
        //     else {
        //         res.json(data);
        //     }
        //     });
           res.render("index");
        });

         router.route("/saved")
        .get((req, res) => {
            Article.find().sort({_id: -1})
            .populate("notes")
            .exec(function(err, data) {
            // Log any errors if the server encounters one
            if (err) {
                 console.log(err);
            }
            // Otherwise, send the result of this query to the browser
            else {
                console.log(data);
                res.render('saved',{articles: data});
            }
            });
        });

        
        
        router.route("/scrape")
            .get((req, res) => {
               
                request("http://www.theonion.com/", function(error, response, html) {

                    // Load the HTML into cheerio
                    var $ = cheerio.load(html);
                     var results = [];
                    // With cheerio, look at each award-winning site, enclosed in "figure" tags with the class name "site"
                    $("article").each(function(i, element) {

                        //console.log(element);

                        /* Cheerio's find method will "find" the first matching child element in a parent.
                        *    We start at the current element, then "find" its first child a-tag.
                        *    Then, we "find" the lone child img-tag in that a-tag.
                        *    Then, .attr grabs the imgs src value.
                        * So: <figure>  ->  <a>  ->  <img src="link">  ->  "link"  */
                        var headline = $(element).find(".headline").find("a").attr("title");
                        var link = "http://www.theonion.com" + $(element).find(".headline").find("a").attr("href");
                        var summary = $(element).find(".desc").text().replace('\n','').trim();
                        if (summary==='') {
                            summary="N\\A"
                        }
                        //var pubDate =  $(element).find(".summary").find('.handler').attr("data-pubdate");      
                        // Save these results in an object that we'll push into the results array we defined earlier
                       results.push({
                            headline: headline,
                            summary: summary,
                            link:  link,
                            createdAt: Date().toLocaleString()
                        });
                });
                   
                    //console.log(results);
                    //res.json(results);
                    res.render('scrape',{articles: results});
                    //res.render('scrape', {articles: {results}});  
            });    
            })
            .post((req, res) => {
                console.log(req.body);
                  // Collect article id
               
                
                // Collect Author Name
                var headline = req.body.headline;

                // Collect Comment Content
                var summary = req.body.summary;

                var link=req.body.link

                var createDt=req.body.createDt

                // "result" object has the exact same key-value pairs of the "Comment" model
                var result = {
                    headline: headline,
                    summary: summary,
                    link:      link,
                    createDt: Date.now()
                };

                // Using the Comment model, create a new comment entry
                var entry = new Article (result);

                // Save the entry to the database
                entry.save(function(err, doc) {
                    // log any errors
                    if (err) {
                    console.log(err);
                     res.sendStatus(500);
                    } 
                    // Or, relate the comment to the article
                    else {
                  
                        res.redirect('/scrape');
                    }



            //     db.articles.insert({
            //                 headline: req.body.headline,
            //                 summary: req.body.summary,
            //                 link:  req.body.link,
            //                 createdAt: req.body.createdAt
            //             }, function(err, data) {
            // // Log any errors if the server encounters one
            //     if (err) {
            //      console.log(err);
            //     }
            // // Otherwise, send the result of this query to the browser
            //     else {
            //             res.json(data);
            //     }
            // });
        });
    });

        router.route("/article/:articleId?")
        .delete((req, res) => {
            db.notes.remove({articleId: req.body.articleId}, function(err,data) {
                db.articles.remove({articleId: req.params.articleId}, function(err, data) {
                        if (err) {
                             console.log(err);
                         }
            // Otherwise, send the result of this query to the browser
                         else {
                            res.json(data);
                        }
                })}); 
        });


       
   
        
    //returns router back to request
    return router;
};
