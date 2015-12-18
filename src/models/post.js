"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var User = require('./user');


var PostSchema = mongoose.Schema({
  description: { type: "string", required: true},
  created_by: Object,
  created_at: { type: "date", default: Date.now },
  location: {type: "array"},
  realLocation: {type: "string"},
  isPublic: {type: "boolean", default: true}
})

mongoose.model("Post", PostSchema);
