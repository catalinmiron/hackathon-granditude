"use strict";
var Router = require("koa-router");

var countController = require("../src/controllers/count");
var indexController = require("../src/controllers/index");
var authController = require("../src/controllers/auth");
var postController = require("../src/controllers/post");

var secured = function *(next) {
  if (this.isAuthenticated()) {
    yield next;
  } else {
    this.status = 401;
  }
};

module.exports = function(app, passport) {
  // register functions
  var router = new Router();

  router.use(function *(next) {
    this.type = "json";
    yield next;
  });

  router.get("/", function *() {
    this.type = "html";
    yield indexController.index.apply(this);
  });

  router.get("/auth", authController.getCurrentUser);
  // router.post("/auth", authController.signIn);

  router.all("/signout", authController.signOut);
  // router.post("/signup", authController.createUser);


  router.get('/auth/facebook',
    passport.authenticate('facebook')
  )

  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/#/profile',
      failureRedirect: '/auth/signin'
    })
  )

// exports.getAllPosts = function *() {
// exports.getPublicPosts = function *() {
// exports.getPrivatePosts = function *() {
// exports.getPostsByUser = function *(id) {
// exports.addNewPost = function *(description, created_by, location, public) {

  router.get('/api/posts', postController.getAllPosts)
  router.get('/api/posts/public', postController.getPublicPosts)
  router.get('/api/posts/private', postController.getPrivatePosts)
  router.post('/api/posts/new', postController.addNewPost)
  router.get('/api/profile/:id', postController.getPostsByUserId)
  // router.get('/profile/:id/public', postController.getPublicPostsByUserId)
  router.get('/api/me', postController.getPostsByCurrentUser)

  // secured routes
  router.get("/value", secured, countController.getCount);
  router.get("/inc", secured, countController.increment);
  router.get("/dec", secured, countController.decrement);
  app.use(router.routes());
};
