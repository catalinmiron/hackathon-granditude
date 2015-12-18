"use strict";
var mongoose = require("mongoose");
var Post = mongoose.model("Post");
var User = mongoose.model("User");

exports.getAllPosts = function *() {
  var res = yield Post.find({});
  this.body = res;
};

exports.getPublicPosts = function *() {
  var res = yield Post.find({isPublic: true})

  this.body = res;
};

exports.getPrivatePosts = function *() {
  var res = yield Post.find({isPublic: false})

  this.body = res;
};

exports.getPostsByUserId = function *(id) {
  var posts = yield Post.find({"created_by.facebook": this.params.id, isPublic: true});
  var user = yield User.findOne({facebook: this.params.id});

  console.log(this.session);

  this.body = {
    user: user,
    posts: posts
  };
};

exports.getPostsByCurrentUser = function *() {
  var currentUserId = this.passport.user.facebook;

  var posts = yield Post.find({"created_by.facebook": currentUserId});
  var user = yield User.findOne({"facebook": currentUserId});

  this.body = {
    user: user,
    posts: posts
  };
};

exports.addNewPost = function *() {
  console.log(this.request.body);

  var userDetails = yield User.findOne({facebook: this.request.body.userId});

  var res = new Post({
    description: this.request.body.description,
    created_by: userDetails,
    realLocation: this.request.body.realLocation,
    location: this.request.body.location,
    isPublic: this.request.body.isPublic
  })

  yield res.save();

  this.body = res;
}
