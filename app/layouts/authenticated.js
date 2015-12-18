import React, { Component } from "react";
import { Link, RouteHandler } from "react-router";

import { Jumbotron, Nav, Row, Col } from "react-bootstrap";

import { NavItemLink } from "react-router-bootstrap";

import AuthStore from "../stores/auth";
import SignIn from "../pages/signin";

export default class MainLayout extends Component {
  static displayName = "MainLayout";
  constructor() {
    super();
  }

  static willTransitionTo(transition) {
    if (!AuthStore.isLoggedIn()) {
      SignIn.attemptedTransition = transition;
      transition.redirect("sign-in");
    }
  }

  render() {
    return (
      <div>
      <div className="container">
        <Row>
          <Col md={12} >
            <RouteHandler />
          </Col>
        </Row>
      </div>
      </div>
    );
  }
}
