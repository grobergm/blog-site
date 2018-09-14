// Libraries
var express = require("express"),
methodOverride= require("method-override"),
app= express(),
bodyParser=require("body-parser"),
mongoose=require("mongoose");

// App Config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

// Mongoose model config
var blogSchema = new mongoose.Schema ({
	title: String,
	image: String,
	body: String,
	created: {type:Date, default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema)

// RESTful Routes
app.get("/",function(req,res){
	res.redirect("/blogs");
});

// Index Route: show all blogs
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log("Error");
		} else {
			res.render("index",{blogs:blogs});
		}
	});
});

// New Route: show form for creating new blog
app.get("/blogs/new",function(req,res){
	res.render("new");
});

// Create Route: Create new blog from form, then redirect
app.post("/blogs", function(req,res){
	Blog.create(req.body.blog, function(err,newBlog){
		if(err){
			res.render("new");
		} else {res.redirect("/blogs");}
	});
});

// Show Rout: Show more info about one of the blog posts
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show",{blog:foundBlog});
		}
	});
});

// EDIT Route

app.get("/blogs/:id/edit", function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit",{blog:foundBlog})
		}
	});
});

// UPDATE Route
app.put("/blogs/:id",function(req,res){
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/"+req.params.id);
		}
	})
});

// DELETE Route
app.delete("/blogs/:id", function(req,res){
Blog.findByIdAndRemove(req.params.id,function(err){
	if(err){
		res.redirect("/blogs");
	} else {
		res.redirect("/blogs");
	}
})

});


app.listen(100, function(){
	console.log("The server is listening, waiting...");
});