import React, { Component } from "react";
import Message from "./Message";
import MessageHeader from "./MessageHeader";
import MessageForm from "./MessageForm";
import { connect } from "react-redux";
import { ref, onChildAdded, child } from "firebase/database";
import { database } from "../../../firebase";
import { setUserPosts } from "../../../redux/actions/chatRoom_action";

// const database = getDatabase();

// setState가 잘 안되서
export class MainPanel extends Component {
  state = {
    messages: [],
    messagesRef: ref(database, "messages"),
    messagesLoading: true,
    searchTerm: "",
    searchResults: [],
    searchLoading: false,
  };
  componentDidMount() {
    const { chatRoom } = this.props;
    if (chatRoom) {
      this.addMessagesListners(chatRoom.id);
    }
  }

  handleSearchMessages = () => {
    const chatRoomMesages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = chatRoomMesages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults });
  };

  handleSearchChange = (e) => {
    this.setState(
      {
        searchTerm: e.target.value,
        searchLoading: true,
      },
      () => this.handleSearchMessages()
    );
  };

  addMessagesListners = (chatRoomId) => {
    // const messagesRef = ref(database, "messages", chatRoomId);

    let messagesArray = [];
    onChildAdded(child(this.state.messagesRef, chatRoomId), (DataSnapshot) => {
      messagesArray.push(DataSnapshot.val());
      this.setState({ messages: messagesArray, messagesLoading: false });

      this.userPostCount(messagesArray);
    });
  };

  userPostCount = (messages) => {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          image: message.user.image,
          count: 1,
        };
      }
      return acc;
    }, {});

    // MessageHeader에서 사용할꺼기 때문에 redux 에 저장
    this.props.dispatch(setUserPosts(userPosts));
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
    const { messages, searchResults, searchTerm } = this.state;
    return (
      <div style={{ padding: "2rem 2rem 0 2rem" }}>
        <MessageHeader handleSearchChange={this.handleSearchChange} />

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
          {searchTerm
            ? this.renderMessages(searchResults)
            : this.renderMessages(messages)}
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
