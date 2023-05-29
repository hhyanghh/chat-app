import React, { Component } from "react";

import { BiWinkSmile } from "react-icons/bi";

export class DirectMessages extends Component {
  renderDirectMessages = () => {
    // list 그리기 (가입된 다른 유저들)
  };
  render() {
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
          {this.renderDirectMessages()}
        </ul>
      </div>
    );
  }
}

export default DirectMessages;
