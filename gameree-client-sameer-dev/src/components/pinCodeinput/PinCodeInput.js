import React from "react";
import ReactPinInput from "react-pin-input";

export default class PinInputExamples extends React.Component {
  constructor() {
    super();
    this.state = {
      code: "",
    };
  }

  quickReveal = (value, index) => {
    if (this)
      if (index == 0) {
        return;
      }
    document.querySelector(".pincode-input-container").children[
      index - 1
    ].type = "text";
    setTimeout(() => {
      document.querySelector(".pincode-input-container").children[
        index - 1
      ].type = "password";
    }, 200);
  };

  render() {
    const { code } = this.state;
    return (
      <div
      >
        <ReactPinInput
          length={6}
          initialValue=""
          focus={true}
          // secret
          onChange={this.quickReveal}
          autoSelect="true"
          type="numeric"
          // style={{ padding: "10px" }}
          inputStyle={{
            borderColor: "#000000",
            text: "#fff",
            borderRadius: "8px",
            margin: "0 8px",
            color: "black",
          }}
          inputFocusStyle={{ borderColor: "#000000" }}
          onComplete={(value, index) => {
            this.props.submit(value);
          }}
        />
      </div>
    );
  }
}

