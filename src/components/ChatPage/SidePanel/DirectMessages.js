import React, { Component } from "react";

import { BiWinkSmile } from "react-icons/bi";
import { database } from "../../../firebase";
import { ref, onChildAdded, child } from "firebase/database";
import { connect } from "react-redux";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from "../../../redux/actions/chatRoom_action";

export class DirectMessages extends Component {
  state = {
    usersRef: ref(database, "users"),
    users: [],
    activeChatRoom: "",
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

  getChatRoomId = (userId) => {
    const currentUserId = this.props.user.uid;
    return userId > currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  changeChatRoom = (user) => {
    const chatRoomId = this.getChatRoomId(user.uid);
    const chatRoomData = {
      id: chatRoomId,
      name: user.name,
    };

    this.props.dispatch(setCurrentChatRoom(chatRoomData));
    this.props.dispatch(setPrivateChatRoom(true));
    this.setActiveChatRoom(user.uid);
  };

  setActiveChatRoom = (userId) => {
    this.setState({ activeChatRoom: userId });
  };
  renderDirectMessages = (users) =>
    users.length > 0 &&
    users.map((user) => (
      <li
        key={user.uid}
        onClick={() => this.changeChatRoom(user)}
        style={{
          backgroundColor:
            user.uid === this.state.activeChatRoom && "#FFFFFF45",
          cursor: "pointer",
        }}
      >
        # {user.name}
      </li>
    ));

  render() {
    const { users } = this.state;
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
          {this.renderDirectMessages(users)}
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
