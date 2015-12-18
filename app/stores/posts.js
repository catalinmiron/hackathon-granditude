import request from "superagent";

var geocoder = require('google-geocoder');
var geo = geocoder({
  key: 'AIzaSyBR0Vq80nxm-dwOueLvaw2wUmSC0vGFmHU'
});
let _currentUserPosts = null;
let _post = [];
let _myPosts=null;
let _publicPosts = null;
let _postByProfileId = []
let _changeListeners = [];
let _initCalled = false;


const PostStore = {

  init: function() {
    console.log('init!!!')
    this.getCurrentUserPosts();
    this.getAllPosts();
  },

  addPost: function(data, done) {
    // console.log('-----------------------------');
    console.log(data);
    geo.find(data.location, function(eroareaVietii, resource) {
      data.realLocation = data.location;
      data.location = [resource[0].location.lat, resource[0].location.lng];
      request.post("/api/posts/new")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .send(data)
        .end(function(err, res) {
          if (!err && res.body) {
            _post = res.body;
            /* eslint-disable no-use-before-define */
            PostStore.notifyChange();
            /* eslint-enable no-use-before-define */
          }
          if (done) {
            done(err, _post);
          }
        });
    });
  },

  getPostByProfileId: function(id) {
    _postByProfileId = null;

    request.get('/api/profile/' + id)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .end(function(err, res) {
        if (!err && res.body) {
          console.log(res.body);
          _postByProfileId = res.body;

          PostStore.notifyChange();
        }
      });
  },

  getCurrentUserPosts: function() {
    request.get('/api/me')
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .end(function(err, res) {
        if (!err && res.body) {
          console.log(res.body);
          _myPosts = res.body;

          PostStore.notifyChange();
        }
      });
  },

  getAllPosts: function() {
    request.get('/api/posts/public')
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .end(function(err, res) {
        console.log(res.body);
        if (!err && res.body) {
          _publicPosts = res.body;

          PostStore.notifyChange();
        }
      });
  },

  notifyChange: function() {
    console.log(';notify change')
    _changeListeners.forEach(function(listener) {
      listener();
    });
  },
  addChangeListener: function(listener) {
    _changeListeners.push(listener);
  },
  removeChangeListener: function(listener) {
    _changeListeners = _changeListeners.filter(function(l) {
      return listener !== l;
    });
  },

  getMyPosts: function() {
    return _myPosts;
  },

  getProfilePosts: function() {
    return _postByProfileId;
  },

  getPosts: function() {
    console.log(_publicPosts)
    return _publicPosts;
  }
};

export default PostStore;
