import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

import { Col, Input, Button, Row } from "react-bootstrap";

import AuthStore from "../stores/auth";
var logo = require("../images/granditude.png");
var facebookButton = require("../images/facebook-button.png");

export default class SignIn extends Component {
  static displayName = "SignInPage";

  static contextTypes = { router: PropTypes.func.isRequired };
  static attemptedTransition = null;
  static defaultProps = { initialError: false };

  constructor(props) {
    super(props);
    this.state = { error: props.initialError };
    this.retryTransition();
  }

  componentDidMount() {
    AuthStore.addChangeListener(this.retryTransition);
  }

  componentWillUnmount() {
    AuthStore.removeChangeListener(this.retryTransition);
  }

  retryTransition = () => {
    if (SignIn.attemptedTransition) {
      let transition = SignIn.attemptedTransition;
      SignIn.attemptedTransition = null;
      transition.retry();
    } else {
      this.context.router.replaceWith("index");
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const username = this.refs.username.getValue();
    const password = this.refs.password.getValue();
    AuthStore.signIn(username, password, (err, user) => {
      if (err || !user) {
        return this.setState({ error: true });
      }
      this.retryTransition();
    });
  }

  render() {
    return (
      <div className="login-wrapper">
        <img src={logo}/>
        <br/>
        <a href="/auth/facebook">
          <img src={facebookButton} title="login with facebook" />
        </a>
      </div>
    );
  }

  renderErrorBlock() {
    return this.state.error ? (<p className="help-block">Bad login information</p>) : null;
  }
}
