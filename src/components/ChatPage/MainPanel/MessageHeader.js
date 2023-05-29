import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Image } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { BsSearch, BsHeart } from "react-icons/bs";
import { AiOutlineUnlock, AiOutlineLock } from "react-icons/ai";
import Accordion from "react-bootstrap/Accordion";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import Card from "react-bootstrap/Card";
import { useSelector } from "react-redux";

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
              <BsHeart style={{ marginLeft: "8px" }} />
            </h2>
          </Col>
          <Col>
            <Image src="" />
            <p>User Name</p>
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
                  <Card.Body>Hello! I'm the body</Card.Body>
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
                  <Card.Body>Hello! I'm the body</Card.Body>
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
