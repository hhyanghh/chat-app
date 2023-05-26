import React, { useRef } from "react";
import { BsFillChatDotsFill } from "react-icons/bs";
import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image";
import { useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";

function UserPanel() {
  // redex store에서 유저 정보 가져오기
  const user = useSelector((state) => state.user.currentUser);

  const inputOpenImageRef = useRef();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        alert("로그아웃 완료");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };

  const handleUploadImage = () => {};
  return (
    <div>
      <h3>
        <BsFillChatDotsFill /> Chat App
      </h3>

      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <Image
          src={user && user.photoURL}
          roundedCircle
          style={{ width: "30px", height: "30px", marginTop: "3px" }}
        />
        <input
          type="file"
          ref={inputOpenImageRef}
          style={{ display: "none" }}
          accept="image/jpeg, image/png"
          onChange={handleUploadImage}
        />
        <Dropdown>
          <Dropdown.Toggle
            id="dropdown-basic"
            style={{ background: "transparent", border: "0px" }}
          >
            {user && user.displayName}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleOpenImageRef}>
              프로필 사진 변경
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default UserPanel;
