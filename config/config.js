"use strict";
var path = require("path");
var _ = require("lodash");

var env = process.env.NODE_ENV = process.env.NODE_ENV || "development";

var base = {
  app: {
    root: path.normalize(path.join(__dirname, "/..")),
    env: env,
  },
};

var specific = {
  development: {
    app: {
      port: 3000,
      name: "Granditude",
      keys: [ "super-secret-hurr-durr" ],
    },
    mongo: {
      url: "mongodb://granditude:brebex123@ds057944.mongolab.com:57944/granditude",
    },
    facebook: {
      // clientID: '1703073076602804',
      // clientSecret: '93174f1800a8fcfcd38b71e9746de533'
      clientID: '1703068979936547',
      clientSecret: 'adbe549ca5af0da38b420157a234e56a'
    }
  },
  test: {
    app: {
      port: 3001,
      name: "Granditude",
      keys: [ "super-secret-hurr-durr" ],
    },
    mongo: {
      url: "mongodb://granditude:brebex123@ds057944.mongolab.com:57944/granditude",
    },
    facebook: {
      // clientID: '1703073076602804',
      // clientSecret: '93174f1800a8fcfcd38b71e9746de533'
      clientID: '1703068979936547',
      clientSecret: 'adbe549ca5af0da38b420157a234e56a'
    }
  },
  production: {
    app: {
      port: process.env.PORT || 3000,
      name: "Koa React Gulp Mongoose Mocha",
    },
    mongo: {
      url: "mongodb://granditude:brebex123@ds057944.mongolab.com:57944/granditude",
    },
    facebook: {
      // clientID: '1703073076602804',
      // clientSecret: '93174f1800a8fcfcd38b71e9746de533'
      clientID: '1703068979936547',
      clientSecret: 'adbe549ca5af0da38b420157a234e56a'
    }
  },
};

module.exports = _.merge(base, specific[env]);
