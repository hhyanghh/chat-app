import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Image } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { BsSearch, BsHeart, BsHeartFill } from "react-icons/bs";
import { AiOutlineUnlock, AiOutlineLock } from "react-icons/ai";
import Accordion from "react-bootstrap/Accordion";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import Card from "react-bootstrap/Card";
import { useSelector } from "react-redux";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  child,
  update,
} from "firebase/database";

function CustomToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log("totally custom!")
  );

  return (
    <button
      type="button"
      style={{ backgroundColor: "pink", padding: "2px" }}
      onClick={decoratedOnClick}
    >
      {children}
    </button>
  );
}

function MessageHeader({ handleSearchChange }) {
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const isPrivateChatRoom = useSelector(
    (state) => state.chatRoom.isPrivateChatRoom
  );

  const [isFavorited, setIsFavorited] = useState(false);
  const usersRef = ref(getDatabase(), "users");
  const user = useSelector((state) => state.user.currentUser);
  const userPosts = useSelector((state) => state.chatRoom.userPosts);

  useEffect(() => {
    if (chatRoom && user) {
      addFavoriteListener(chatRoom.id, user.uid);
    }
  }, []);

  const addFavoriteListener = (chatRoomId, userId) => {
    onValue(child(usersRef, `${userId}/favorited`), (data) => {
      if (data.val() !== null) {
        const chatRoomIds = Object.keys(data.val());
        const isAlreadyFavorited = chatRoomIds.includes(chatRoomId);
        setIsFavorited(isAlreadyFavorited);
      }
    });
  };

  const handleFavorite = () => {
    if (isFavorited) {
      setIsFavorited((prev) => !prev);
      remove(child(usersRef, `${user.uid}/favorited/${chatRoom.id}`));
    } else {
      setIsFavorited((prev) => !prev);
      update(child(usersRef, `${user.uid}/favorited`), {
        [chatRoom.id]: {
          name: chatRoom.name,
          description: chatRoom.description,
          createdBy: {
            name: chatRoom.createdBy.name,
            image: chatRoom.createdBy.image,
          },
        },
      });
    }
  };

  const renderUserPosts = (userPosts) =>
    Object.entries(userPosts)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([key, val], i) => (
        <div key={i}>
          <img
            src={val.image}
            alt={val.name}
            style={{ borderRadius: 25 }}
            width={48}
            height={48}
          />
          {key}
          <p>{val.count} 개</p>
        </div>
      ));

  return (
    <div
      style={{
        width: "100%",
        height: "170px",
        // border: ".2rem solid #ececec",
        backgroundColor: "#ececec70",
        borderRadius: "16px",
        padding: "1rem",
        marginBottom: "1rem",
      }}
    >
      <Container>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <BsSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search Messages"
                aria-label="Search"
                aria-describedby="basic-addon1"
                onChange={handleSearchChange}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2 style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {isPrivateChatRoom ? <AiOutlineUnlock /> : <AiOutlineLock />}
              <div>{chatRoom && chatRoom.name}</div>
              {!isPrivateChatRoom && (
                <span
                  style={{ cursor: "pointer", marginLeft: "8px" }}
                  onClick={handleFavorite}
                >
                  {isFavorited ? <BsHeartFill /> : <BsHeart />}
                </span>
              )}
            </h2>
          </Col>
          <Col>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Image
                roundedCircle
                src={chatRoom?.createdBy.image}
                style={{
                  marginRight: "4px",
                  width: "36px",
                  height: "36px",
                }}
              />
              <div>{chatRoom?.createdBy.name}</div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Accordion>
              <Card>
                <Card.Header>
                  <CustomToggle eventKey="0">
                    Chat Room Description
                  </CustomToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>{chatRoom && chatRoom.description}</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
          <Col>
            <Accordion>
              <Card>
                <Card.Header>
                  <CustomToggle eventKey="0">Count Posts</CustomToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    {userPosts && renderUserPosts(userPosts)}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MessageHeader;
