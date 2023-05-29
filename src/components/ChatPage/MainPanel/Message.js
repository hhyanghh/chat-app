import React from "react";
import moment from "moment";
import Image from "react-bootstrap/Image";

function Message({ message, user }) {
  const timeFromNow = (timestamp) => moment(timestamp).fromNow();

  const isImage = (message) => {
    return (
      message.hasOwnProperty("image") && !message.hasOwnProperty("content")
    );
  };

  const isMessageMine = (message, user) => {
    return message.user.id === user?.uid;
  };
  return (
    <div>
      <div
        className="d-flex"
        style={{
          marginBottom: "3px",
        }}
      >
        <Image
          roundedCircle
          src={message.user.image}
          alt={message.user.name}
          style={{ width: "48px", height: "48px", borderRadius: "10px" }}
        />
        <div
          style={{
            backgroundColor: isMessageMine(message, user) && "#EcEcEc",
            width: "100%",
          }}
        >
          <h5 className="fw-bold">
            {message.user.name}
            <small className="text-muted">
              {timeFromNow(message.timestamp)}
            </small>
          </h5>
          {isImage(message) ? (
            <Image
              rounded
              style={{ maxWidth: "300px" }}
              alt="이미지"
              src={message.image}
            />
          ) : (
            <p>{message.content}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;
