require('dotenv').config();
var express = require("express");
var bodyparser = require("body-parser");
var methodoverride = require("method-override");
var mongoose = require("mongoose");
var app = express();


// APP CONNECT CONFIG
mongoose.connect(process.env.DATABASEURL , { 
    useNewUrlParser: true, 
    useUnifiedTopology : true,
    keepAlive : true 
}).then(() => {
    console.log("connected to DB")
}).catch(err => {
    console.log("Got Error ===> " , err.message);
});

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodoverride("_method"));
// MONGOOSE SCHEMA
var blogSchema = new mongoose.Schema({
    username : "string",
    title: "string", 
    img: "string",
    body: "string",
    infolink : "string",
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);


// ROUTES
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log("error in finding your blog");
        }
        else {
            res.render("index.ejs", { blogs: blogs });
        }
    });
});

//ADD BLOGS TO HOME PAGE NEW ROUTE
app.get("/blogs/new", function(req, res) {
    res.render("new.ejs");
});

// 
app.post("/blogs", function(req, res) {
    var username = req.body.blogs.username;
    var title = req.body.blogs.title;
    var image = req.body.blogs.image;
    var body = req.body.blogs.body;
    var infolink = req.body.blogs.infolink;
    Blog.create({
        username : username,
        title: title,
        img: image,
        body: body,
        infolink : infolink
    }, function(err, blogs) {
        if (err) {
            console.log("ERROR IN UPDATING CONTENTS!!");
        }
        else {
            res.redirect("/blogs");
        }
    });
});

//   SHOW PAGE
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundblog) {
        if (err) {
            console.log("ERROR IN FINDING BLOG!");
        }
        else {
            res.render("show.ejs", { blog: foundblog });
        }
    });
});

//  EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
   Blog.findById(req.params.id , function(err , foundblog){
      if(err){
          console.log("ERROR IN EDATING!!");
      } else {
           res.render("edit.ejs" , { blog : foundblog});
      }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id" , function(req ,res){
    
   Blog.findByIdAndUpdate(req.params.id ,  req.body.blogs , function(err , updatedblog){
       if(err){
           console.log("UPDATING ISSUE");
       }else {
           res.redirect("/blogs/" + req.params.id);
       }
   });
});

// DELETE BLOG
app.delete("/blogs/:id" , function(req ,res){
    // DESTROY BLOG
    Blog.findByIdAndRemove(req.params.id , function(err){
        if(err){
            console.log("  ERROR IN DELETEING BLOG");
        } else {
            res.redirect("/blogs");
        }
    });
    // REDIRECT TO HOME PAGE
});


app.listen(process.env.PORT || 3000, function() {
    console.log("server strated now of restful blog app");
});
