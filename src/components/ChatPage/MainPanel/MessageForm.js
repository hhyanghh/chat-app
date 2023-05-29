import React, { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { database, storage } from "../../../firebase";
import { ref, push, set, serverTimestamp } from "firebase/database";
import { useSelector } from "react-redux";
import {
  ref as sRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

function MessageForm() {
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const user = useSelector((state) => state.user.currentUser);
  const [percentage, setPercentage] = useState(0);
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const isPrivateChatRoom = useSelector(
    (state) => state.chatRoom.isPrivateChatRoom
  );

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

  const getPath = () => {
    if (isPrivateChatRoom) {
      return `/message/private/${chatRoom.id}`;
    } else {
      return `/message/public`;
    }
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    const filePath = `${getPath()}/${file.name}`;
    const metadata = file.type;
    const storageImageRef = sRef(storage, filePath);

    setLoading(true);

    try {
      // 파일 먼저 스토리지에 저장
      let uploadTask = uploadBytesResumable(storageImageRef, file, metadata);
      // 파일 저장되는 percentage 구하기
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percentage = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setPercentage(percentage);
        },
        (err) => {
          console.log(err);
          setLoading(false);
        },
        () => {
          // 저장이 다 된 후에 파일 메시지 전송 (database에 저장)
          // 저장된 파일을 다운로드 받을 수 있는 URL 가져오기
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            push(messagesRef, createMessage(downloadURL)); // 수정된 부분
            setLoading(false);
          });
        }
      );
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
      {percentage !== 0 && percentage !== 100 && (
        <ProgressBar
          variant="warning"
          label={`${percentage}%`}
          now={percentage}
        />
      )}
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
            disabled={loading ? true : false}
          >
            SEND
          </button>
        </Col>
        <Col>
          <button
            className="message-form-button"
            style={{ width: "100%" }}
            onClick={handleOpenImageRef}
            disabled={loading ? true : false}
          >
            UPLOAD
          </button>
        </Col>
      </Row>

      <input
        accept="image/jpeg, image/png, image/jpg"
        style={{ display: "none" }}
        type="file"
        ref={inputOpenImageRef}
        onChange={handleUploadImage}
      />
    </div>
  );
}

export default MessageForm;
