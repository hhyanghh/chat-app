import React, { Component } from "react";

import { BiWinkSmile } from "react-icons/bi";
import { database } from "../../../firebase";
import { ref, onChildAdded, child } from "firebase/database";
import { connect } from "react-redux";

export class DirectMessages extends Component {
  state = {
    usersRef: ref(database, "users"),
  };
  componentDidMount() {
    if (this.props.user.uid) {
      this.addUserListners(this.props.user.uid);
    }
  }

  addUserListners = (currentUserId) => {
    const { usersRef } = this.state;
    let usersArray = [];
    onChildAdded(usersRef, (snapshot) => {
      const user = snapshot.val();
      const userId = snapshot.key;

      if (currentUserId !== userId) {
        user.uid = userId;
        user.status = "offline";
        usersArray.push(user);
        this.setState({ users: usersArray });
      }
    });
  };
  renderDirectMessages = () => {
    // list 그리기 (가입된 다른 유저들)
  };

  render() {
    console.log("users", this.state.users);
    return (
      <div>
        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <BiWinkSmile style={{ marginRight: 3 }} />
          DIRECT MESSAGES (1)
        </div>

        <ul style={{ listStyleType: "none", padding: 0 }}>
          {this.renderDirectMessages()}
        </ul>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
  };
};
export default connect(mapStateToProps)(DirectMessages);
