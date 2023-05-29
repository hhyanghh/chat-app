import React, { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { database, storage } from "../../../firebase";
import { ref, push, set, serverTimestamp } from "firebase/database";
import { useSelector } from "react-redux";
import { ref as sRef, uploadBytes } from "firebase/storage";

function MessageForm() {
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const user = useSelector((state) => state.user.currentUser);
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesRef = ref(database, "messages/" + chatRoom?.id || "");
  const inputOpenImageRef = useRef();

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const createMessage = (fileUrl = null) => {
    const message = {
      timestamp: serverTimestamp(),
      user: {
        id: user.uid,
        name: user.displayName,
        image: user.photoURL,
      },
    };

    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = content;
    }

    return message;
  };

  const handleSubmit = async (content) => {
    if (!content) {
      setErrors((prev) => prev.concat("Type contents first"));
      return;
    }
    setLoading(true);
    // firebase에 메시지 저장
    try {
      const newMessageRef = push(messagesRef);

      await set(newMessageRef, createMessage());
      setLoading(false);
      setContent("");
      setErrors([]);
    } catch (error) {
      setErrors((prev) => prev.concat(error.message));
      setLoading(false);
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
  };

  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    const filePath = `/message/public/${file.name}`;
    const metadata = file.type;
    const storageImageRef = sRef(storage, filePath);

    try {
      await uploadBytes(storageImageRef, file, metadata);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="example">
          <Form.Control
            as="textarea"
            rows={3}
            value={content}
            onChange={handleChange}
          />
        </Form.Group>
      </Form>
      <ProgressBar variant="warning" label="60%" now={60} />
      <div>
        {errors.map((errorMsg) => (
          <p style={{ color: "red" }} key={errorMsg}>
            {errorMsg}
          </p>
        ))}
      </div>
      <Row>
        <Col>
          <button
            onClick={handleSubmit}
            className="message-form-button"
            style={{ width: "100%" }}
          >
            SEND
          </button>
        </Col>
        <Col>
          <button
            className="message-form-button"
            style={{ width: "100%" }}
            onClick={handleOpenImageRef}
          >
            UPLOAD
          </button>
        </Col>
      </Row>

      <input
        style={{ display: "none" }}
        type="file"
        ref={inputOpenImageRef}
        onChange={handleUploadImage}
      />
    </div>
  );
}

export default MessageForm;
