module.exports = (express, request, cheerio, db,exphbs, Scrape, Article, Note, app)=>{

    //Declare router variable 
    const router = express.Router();

       router.route("/")
        .get((req, res) => {
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
                // console.log(data);
                res.render('saved',{articles: data});
            }
            });
        })
        .delete((req, res) => {
            console.log(req.body);
            Note.find({article_id: req.body._id},{multi: true}).remove()
            .exec(function(err,data) {
                Article.remove({_id: req.body._id})
                .exec(function(err, data) {
                        if (err) {
                             console.log(err);
                             res.sendStatus(500);
                         }
            // Otherwise, send the result of this query to the browser
                         else {
                            res.redirect('/saved');
                        }
                })}); 
        });

        
        
        router.route("/newscrape")
            .get((req, res) => {
                Scrape.remove()
                .exec(function(err,data) {
                request("http://www.theonion.com/", function(error, response, html) {

                    // Load the HTML into cheerio
                    var $ = cheerio.load(html);
                    // With cheerio, look at each award-winning site, enclosed in "figure" tags with the class name "site"
                    $("article").each(function(i, element) {
        
                        var headline = $(element).find(".headline").find("a").attr("title");
                        var link = "http://www.theonion.com" + $(element).find(".headline").find("a").attr("href");
                        var summary = $(element).find(".desc").text().replace('\n','').trim();
                        if (summary==='') {
                            summary="N\\A"
                        }
                        //var pubDate =  $(element).find(".summary").find('.handler').attr("data-pubdate");      
                        // Save these results in an object that we'll push into the results array we defined earlier
                         var result = {
                            headline: headline,
                            summary: summary,
                            link:      link,
                            createDt: Date.now(),
                            savedFlag: 0
                        };

                // Using the Comment model, create a new comment entry
                var entry = new Scrape (result);

                // Save the entry to the database
                entry.save(function(err, doc) {
                    // log any errors
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    } 
                    // Or, relate the comment to the article
                    else {
                  
                         console.log(doc);
                    }
                });
                 });
                        //console.log(results);
                    //res.json(results);
                    res.redirect('/viewscrape');
                     
                });
                });         
            });

            router.route("/viewscrape")
            .get((req,res)=> {
                Scrape.find({savedFlag: false}).sort({_id: -1})
                .exec(function(err, data) {
                // Log any errors if the server encounters one
                if (err) {
                    console.log(err);
                }
                // Otherwise, send the result of this query to the browser
                else {
                    //console.log(data);
                    res.render('scrape',{articles: data});
                }
                
                });
                })
            .post((req, res) => {
                //console.log(req.body);
                 // console.log(req.body);
                            var headline = req.body.headline;
                            var summary = req.body.summary;
                             var link=req.body.link
                             var createDt=req.body.createDt
                
                            var result = {
                                headline: headline,
                                summary: summary,
                                link:      link,
                                createDt: Date.now()
                            };
                            var entry = new Article (result);
                            
                Article.findOne({headline:req.body.headline}, function(err, data) {
                    if (!data) {
                          
                            // Save the entry to the database
                             entry.save(function(err, doc) {
                            // log any errors
                            if (err) {
                                //console.log(err);
                                res.sendStatus(500);
                            } 
                            // Or, relate the comment to the article
                            else {
                                console.log('doc:' + doc.headline);
                                Scrape.update({headline: doc.headline},{$set: {savedFlag: true}},{multi: true}, function(err, doc) {
                                        if (err) {
                                            console.log(err);
                                            res.sendStatus(500);
                                        }
                                        else {
                                            res.redirect('/viewscrape');
                                        }
                                });
                            }
                         });
                        }
                    else {
                        console.log('body' + req.body.headline);
                        Scrape.update({headline: req.body.headline},{$set: {savedFlag: true}},{multi: true}, function(err,data) {
                              res.redirect('/viewscrape');
                        })
                      
                    }
                });
        });

        router.route("/notes")
          .post((req, res) => {
                //console.log(req.body);
                 // console.log(req.body);

                            var result = {
                                note: req.body.newNote,
                                createDt: Date.now(),
                                article_id: req.body.article_id
                            };

                            console.log(result);
                            var entry = new Note (result);
                            
                            // Save the entry to the database
                             entry.save(function(err, doc) {
                                 console.log(doc);
                            // log any errors
                            if (err) {
                                console.log(err);
                                res.sendStatus(500);
                            } 
                            // Or, relate the comment to the article
                            else {
                                Article.findOneAndUpdate({ "_id": entry.article_id }, {$push: { "notes": doc._id } }, { new: true })
                                // Execute the above query
                                .exec(function(err, doc) {
                                // Log any errors
                                if (err) {
                                    console.log(err);
                                    res.sendStatus(500);
                                }
                                else {
                                    // Or send the document to the browser
                                    res.redirect('/saved');
                                }
                                });
                            }                   
                               
                         });
          })
        .delete((req, res) => {
            console.log(req.body);
            Note.remove({_Id: req.body._id}, function(err,data) {
                  Article.update({ _id: req.body.article_id }, { $pull: { notes: req.body._id } } , function(err, data) {
                        if (err) {
                             console.log(err);
                             res.sendStatus(500);
                         }
            // Otherwise, send the result of this query to the browser
                         else {
                            res.redirect('/saved');
                        }
                })}); 
        });


        


       
   
        
    //returns router back to request
    return router;
};
