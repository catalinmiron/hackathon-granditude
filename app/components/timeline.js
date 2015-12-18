import React, { Component, PropTypes } from "react";

import { Link } from "react-router";

import { Label, Navbar, Nav, Glyphicon } from "react-bootstrap";

import { NavItemLink } from "react-router-bootstrap";

import AuthStore from "../stores/auth";

export default class Timeline extends Component {
  static displayName = "Timeline";

  static propTypes = { brand: PropTypes.string };

  constructor(props) {
    super(props);
    this.state = { user: props.user };
  }

  render() {
    return <ul className="post-list">
      {this.props.posts.map(function(post, index) {
        return <li key={index} className="post-item">
          <div>
            <img src={post.created_by.avatar} width="60" className="img-circle"/>
            <Label bsStyle={post.isPublic ? "success" : "warning"} className="post-label">{post.isPublic ? 'Public' : 'Private'}</Label>
            <Link to="profile" params={{id: post.created_by.facebook}} className="post-author-link">
              {post.created_by.username}
            </Link>
          </div>
          <p className="post-description">{post.description}</p>
          <p className="post-description">{post.realLocation}</p>
        </li>
      })}
    </ul>;
  }
}
