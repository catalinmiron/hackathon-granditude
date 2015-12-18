import React, { Component } from "react";
import { Col,Input, Button, Row } from "react-bootstrap";
import request from "superagent";
import Loader from "react-loader";
import _ from "lodash";

import Timeline from "../components/timeline";

import AuthStore from "../stores/auth";
import PostStore from "../stores/posts";

export default class Profile extends Component {
  static displayName = "Profile";
  static defaultProps = { currentUserPosts: PostStore.getMyPosts() };


  constructor(props) {
    super(props);

    this.state = {
      currentUser: AuthStore.getUser(),
      currentUserPosts: PostStore.getMyPosts()
    }
  }

  componentDidUpdate() {
    PostStore.getMyPosts();
  }

  componentWillMount() {
    PostStore.init();
  }

  onStoreChange = () => {
    this.setState({
      currentUserPosts: PostStore.getMyPosts()
    });
  }

  componentDidMount() {
    PostStore.addChangeListener(this.onStoreChange);
  }

  componentWillUnmount() {
    PostStore.removeChangeListener(this.onStoreChange);
  }

  getUserPosts = () => {
    request.get('/api/me')
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .end((err, res) => {
        console.log(res.body);
        if (!err && res.body) {
          this.setState({
            currentUserPosts: res.body
          });
          PostStore.init();
        }
      });
  }

  handleSubmit(e){
    e.preventDefault();
    const description = this.refs.description.getValue();
    const location = this.refs.location.getValue();
    const isPublic = this.refs.isPublic.getChecked();

    const data = {
      description: description,
      location: location,
      isPublic: isPublic,
      userId: this.state.currentUser.id
    };

    PostStore.addPost(data, (err, data) => {
      if (err || !data) {
        return this.setState({ error: true });
      }
      console.log(data);
    });
  }

  render() {
    const {currentUser, currentUserPosts} = this.state;
    if (_.isEmpty(currentUserPosts)) {
      return <Loader loaded={this.state.loaded} lines={13} length={20} width={10} radius={30}
      corners={1} rotate={0} direction={1} color="#000" speed={1}
      trail={60} shadow={false} hwaccel={false} className="spinner"
      zIndex={2e9} top="50%" left="50%" scale={1.00}>
        </Loader>
    }
    return (
      <div>
        <h3>{currentUser.username}</h3>
        <h3>{currentUser.id}</h3>
        <h3>{currentUser._id}</h3>
        <img src={currentUser.avatar} />

        <form onSubmit={(e) => this.handleSubmit(e)} className={this.state.error ? "has-error" : null}>
          <Input type="text" ref="username" placeholder="username" label="Username" value={currentUser.id}  disabled />
          <Input type="text" ref="location" placeholder="location" label="location" />
          <Input type="textarea" ref="description" label="description" placeholder="description" />
          <Input type="checkbox" ref="isPublic" label="Public?" checked />
          <Button type="submit" bsStyle="success" className="pull-right">Publish</Button>
        </form>
        <Timeline posts={currentUserPosts.posts} />
      </div>
    );
  }
}
