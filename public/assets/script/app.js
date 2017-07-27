

// Button Interactions
// ======================
$("#homeBtn").on("click", function() {
    var newUrl = window.location.origin+"/";
    window.location.href=newUrl;
});
// When user clicks the weight sort button, display table sorted by weight
$("#viewScrapeBtn").on("click", function() {
    var newUrl = window.location.origin+"/viewscrape";
    window.location.href=newUrl;
});

$("#savedBtn").on("click", function() {
    var newUrl = window.location.origin+"/saved";
    window.location.href=newUrl;
});

$("#newScrapeBtn").on("click", function(e) {
    var newUrl = window.location.origin+"/newscrape";
    window.location.href=newUrl;
});


$(".btn-addNote").on("click", function(e) {
    $("#newnote-articleId").val($(this).attr("data-value"));
    // console.log($(this).attr("data-value"));
});




