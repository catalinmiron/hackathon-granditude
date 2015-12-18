import React, { Component } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";

import AuthStore from "../stores/auth";
import PostStore from "../stores/posts";
import request from "superagent";
import Timeline from "../components/timeline";

var L = require("leaflet");
var _ = require("lodash");
var Loader = require("react-loader");
var brebex = require("../messages.js");
var $ = require("jquery");

require("../../node_modules/leaflet/dist/leaflet.css");
require("../../node_modules/leaflet.markercluster/dist/MarkerCluster.css");
require("../../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css");
require("../less/world.less");
require("leaflet.markercluster");

L.Icon.Default.imagePath = 'http://api.tiles.mapbox.com/mapbox.js/v1.0.0beta0.0/images';

export default class World extends Component {
  static displayName = "World";
  static defaultProps = { posts: PostStore.getMyPosts() };

  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      posts: props.posts,
      activeMarkers: []
    };
  }

  componentWillMount() {
    request.get('/api/posts/public')
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .end((err, res) => {
        console.log(res.body);
        if (!err && res.body) {
          this.setState({
            posts: res.body
          });
          this._birthMap()
        }
      });
  }

  render() {
    var currentUser = AuthStore.getUser();

    return (
      <div className="world-container">
        <Loader loaded={this.state.loaded} lines={13} length={20} width={10} radius={30}
        corners={1} rotate={0} direction={1} color="#000" speed={1}
        trail={60} shadow={false} hwaccel={false} className="spinner"
        zIndex={2e9} top="50%" left="50%" scale={1.00}>
          </Loader>
        <div id="map"></div>
        <div className="timeline-world">
          <Timeline posts={this.state.activeMarkers} />
        </div>
      </div>
    );
  }

  _birthMap() {
    this.map = L.map("map");
    this.map.setView([50.478483, -13.007813], 3);

    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: "flaviusone.of05oc6k",
      accessToken: "pk.eyJ1IjoiZmxhdml1c29uZSIsImEiOiJjaWlhYzFuaG4wMDFydmFsenplZW56M3NwIn0.ZcOquomxmOYV_QGGqS1qhg",
    }).addTo(this.map);

    var markers = L.markerClusterGroup({
      showCoverageOnHover: false,
      zoomToBoundsOnClick: false,
      spiderfyOnMaxZoom: false,
    });

    markers.on("clusterclick", function(a) {
      // a.layer is actually a cluster
      this.setState({ activeMarkers: a.layer.getAllChildMarkers() })
    }.bind(this));

    markers.on("click", function(a) {
      this.setState({ activeMarkers: [a.layer] })
    }.bind(this));

    _.forEach(this.state.posts, function(post) {
      // FOR YOLO
      // var location = JSON.parse(post.location);
      var location = post.location;
      if (location.length === 0) {
        return;
      }
      var marker = L.marker(location);
      _.extend(marker, {...post});
      console.log('asdasdkhasdhasdkjhaskjdhaskjdhaskjdhaskjhdkjasdhkjashdkjhasdkåß')
      console.log(marker)
      markers.addLayer(marker);
    })

    this.map.addLayer(markers);
    this.setState({ loaded: true });
  }
}
