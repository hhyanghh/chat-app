import React, { Component } from "react";
import Message from "./Message";
import MessageHeader from "./MessageHeader";
import MessageForm from "./MessageForm";
import { connect } from "react-redux";
import { ref, onChildAdded, child } from "firebase/database";
import { database } from "../../../firebase";

// const database = getDatabase();

// setState가 잘 안되서
export class MainPanel extends Component {
  state = {
    messages: [],
    messagesRef: ref(database, "messages"),
    messagesLoading: true,
  };
  componentDidMount() {
    const { chatRoom } = this.props;
    if (chatRoom) {
      this.addMessagesListners(chatRoom.id);
    }
  }

  addMessagesListners = (chatRoomId) => {
    // const messagesRef = ref(database, "messages", chatRoomId);

    let messagesArray = [];
    onChildAdded(child(this.state.messagesRef, chatRoomId), (DataSnapshot) => {
      messagesArray.push(DataSnapshot.val());
      console.log("messagesArray:", messagesArray);
      this.setState({ messages: messagesArray, messagesLoading: false });
    });
  };

  renderMessages = (messages) =>
    messages.length > 0 &&
    messages.map((message) => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.props.user}
      />
    ));

  render() {
    const { messages } = this.state;
    console.log(messages, "messages");
    return (
      <div style={{ padding: "2rem 2rem 0 2rem" }}>
        <MessageHeader />

        <div
          style={{
            width: "100%",
            height: "450px",
            border: ".2rem solid #ececec",
            borderRadius: "4px",
            padding: "1rem",
            marginBottom: "1rem",
            overflowY: "auto",
          }}
        >
          {this.renderMessages(messages)}
        </div>
        <MessageForm />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
    chatRoom: state.chatRoom.currentChatRoom,
  };
};
export default connect(mapStateToProps)(MainPanel);
