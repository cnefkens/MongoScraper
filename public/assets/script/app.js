

// 2: Button Interactions
// ======================

// When user clicks the weight sort button, display table sorted by weight
$("#scrapeBtn").on("click", function() {
    // e.preventDefault();
    var url      = window.location.href;
    //alert(url.indexOf("scrape"));
    if (url.replace('saved','').indexOf("scrape") === -1) {
        var newUrl=url.replace('saved','')+"scrape";
      }
    else {
        newUrl=url.replace('saved','');
     }

    window.location.href=newUrl;
    // $.ajax({
    //         url: "/scrape",
    //         type: "GET",
    //         //dataType:"html"
    //         })
            // .done(function(response) {
            //   console.log("ajax done");
            //   console.log(response);
     //});
});

$("#savedBtn").on("click", function() {
    // e.preventDefault();
    var url      = window.location.href;
    //alert(url.indexOf("scrape"));
    
    if (url.replace('scrape','').indexOf("saved") === -1) {
        var newUrl=url.replace('scrape','')+'saved';
      }
    else {
        newUrl=url.replace('scrape','');
     }

    window.location.href=newUrl;
    // $.ajax({
    //         url: "/scrape",
    //         type: "GET",
    //         //dataType:"html"
    //         })
            // .done(function(response) {
            //   console.log("ajax done");
            //   console.log(response);
     //});
});




