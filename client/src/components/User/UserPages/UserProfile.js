import React, { Component } from "react";
import { connect } from "react-redux";
import { getUserByUsername, sendRequest } from "../../../actions";
import Main from "../../Headers/Main";
import UserPostList from "./Posts/UserPostList";
import axios from "axios";
import history from "../../../history";
import img from "../../../image/user.png";
import { Link } from "react-router-dom";
import Loader from "../../Loader";

class Profile extends Component {
  state = {
    follow: "",
    follower: null,
  };

  async componentDidMount() {
    const status = await axios.get(
      `/api/req/${this.props.match.params.userName}/status`
    );
    this.setState({ follow: status.data });
    await this.props.getUserByUsername(this.props.match.params.userName);
    this.setState({ follower: this.props.user.follower });
  }

  renderNav = () => {
    if (this.props.admin.userName) {
      return <Main></Main>;
    }
  };

  toBase64 = (arr) => {
    return btoa(
      arr.reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
  };

  onFollowClick = async () => {
    if (this.state.follow == "Follow") {
      this.setState({ follow: "Requested" });
    } else if (this.state.follow == "Requested") {
      this.setState({ follow: "Follow" });
    } else {
      this.setState({ follow: "Follow", follower: this.state.follower - 1 });
    }
    await this.props.sendRequest(this.props.match.params.userName);
  };

  renderButton = () => {
    return (
      <button
        class="ui button blue small fluid"
        onClick={() => {
          this.onFollowClick();
        }}
      >
        {this.state.follow}
      </button>
    );
  };

  render() {
    if (!this.props.user) {
      return <Loader></Loader>;
    }
    return (
      <div>
        {this.renderNav()}
        <div
          className="ui divided items"
          style={{
            paddingTop: "50px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <div className="item">
            <div className="image">
              <img
                style={{ borderRadius: "10px" }}
                src={
                  this.props.user.avatar
                    ? `data:image/gif;base64,${this.toBase64(
                        this.props.user.avatar.data
                      )}`
                    : img
                }
              />
            </div>
            <div className="content">
              <h4 className="header">
                {this.props.user.name} | {this.props.user.age}
              </h4>
              <div className="description">
                <p>{this.props.user.caption || "Add Caption"}</p>
              </div>
              <div className="extra">
                <div
                  className="ui label"
                  onClick={() =>
                    history.push(`/following/${this.props.user.userName}`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  {this.props.user.following || "0"} Following
                </div>
                <div
                  className="ui label"
                  onClick={() =>
                    history.push(`/followers/${this.props.user.userName}`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  {this.state.follower || "0"} Follower
                </div>
                <div className="ui label">
                  {this.props.user.posts || "0"} Posts
                </div>
                <br></br>
                <div class="two ui buttons">
                  {this.renderButton()}
                  <div class="or"></div>
                  <Link
                    to={`/message/${this.props.user.userName}`}
                    class="ui button small fluid"
                  >
                    Message
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ui divider"></div>
        <UserPostList
          userName={this.props.match.params.userName}
        ></UserPostList>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.otherUser,
    admin: state.user,
  };
};

export default connect(mapStateToProps, { getUserByUsername, sendRequest })(
  Profile
);
