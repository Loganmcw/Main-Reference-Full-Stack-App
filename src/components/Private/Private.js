import React, { Component } from "react";
import "./Private.css";
// import axios from "axios";
import { getUserInfo } from "./../../ducks/users";
import { connect } from "react-redux";
class Private extends Component {
  //   constructor(props) {
  //     super(props);
  //     this.state = {
  //       userInfo: {}
  //     };
  //   }
  componentDidMount() {
    this.props.getUserInfo();
    // this.setState({
    //   userInfo: this.props.user
    // });
  }
  bankBalance() {
    return "$" + Math.floor((Math.random() + 1) * 1000) + ".00";
  }
  render() {
    const user = this.props.user;
    return (
      <div className="">
        <h1>Community Bank</h1>
        <hr />
        <h4>Account information:</h4>
        {user.id ? <img className="avatar" src={user.img} alt="" /> : ""}
        <p>Username: {user.id ? user.user_name : ""}</p>
        <p>Email: {user.id ? user.email : ""}</p>
        <p>ID: {user.id ? user.auth_id : ""}</p>
        <h4>Available balance: {user.id ? this.bankBalance() : ""} </h4>
        <a href="http://localhost:3005/auth/logout">
          <button>Log out</button>
        </a>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps, { getUserInfo })(Private);
