import React, { Component, PropTypes } from "react";

import { Link } from "react-router";

import { Navbar, Nav, Glyphicon } from "react-bootstrap";

import { NavItemLink } from "react-router-bootstrap";

import AuthStore from "../stores/auth";

var logo = require("../images/granditude.png");

export default class AppNavbar extends Component {
  static displayName = "AppNavbar";

  static propTypes = { brand: PropTypes.string };
  static defaultProps = { user: AuthStore.getUser() };

  constructor(props) {
    super(props);
    this.state = { user: props.user };
  }

  componentWillMount() {
    AuthStore.init();
  }

  componentDidMount() {
    AuthStore.addChangeListener(this.onStoreChange);
  }

  componentWillUnmount() {
    AuthStore.removeChangeListener(this.onStoreChange);
  }

  onStoreChange = () => {
    this.setState({
      user: AuthStore.getUser(),
    });
  }

  render() {
    return this.state.user ? this.renderNavLinks() : null
  }

  renderBrand() {
    return <img src={logo} />
  }

  renderNavLinks() {
    return (
      <Navbar brand={this.renderBrand()} fixedTop toggleNavKey={this.state.user ? 0 : undefined }>
        <Nav right eventKey={0}>
          <NavItemLink eventKey={1} to="profile">
            <Glyphicon glyph="user" /> {this.state.user.username}
          </NavItemLink>
          <NavItemLink to="world">
            <Glyphicon glyph="map-marker" /> World
          </NavItemLink>
          <NavItemLink to="sign-out">
            <Glyphicon glyph="off" /> Sign out
          </NavItemLink>
        </Nav>
      </Navbar>
    );
  }
}
