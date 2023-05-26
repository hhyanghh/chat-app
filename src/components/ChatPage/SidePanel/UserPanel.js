import React, { useRef } from "react";
import { BsFillChatDotsFill } from "react-icons/bs";
import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth, storage, database } from "../../../firebase";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { setPhotoURL } from "../../../redux/actions/user_action";
import { update, ref as databaseRef } from "firebase/database";

function UserPanel() {
  // redex store에서 유저 정보 가져오기
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

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

  const handleUploadImage = async (e) => {
    // firebase storage에 저장

    const file = e.target.files[0];
    const metadata = file.type;

    // storage에 파일 저장하기
    try {
      const storageImgRef = storageRef(storage, `user_image/${user.uid}`);
      const userRef = databaseRef(database, `users/${user.uid}`);

      const uploadTaskSnapshot = await uploadBytesResumable(
        storageImgRef,
        file,
        metadata
      );

      let downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);

      const userImg = auth.currentUser;

      // firebase 업데이트
      await updateProfile(userImg, {
        photoURL: downloadURL,
      });

      // reducer 로 전체 상태관리, 화면에 표시
      dispatch(setPhotoURL(downloadURL));

      // 변경된 image database에 업데이트
      await update(userRef, {
        image: downloadURL,
      });
    } catch (error) {
      console.log(error);
    }
  };
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
