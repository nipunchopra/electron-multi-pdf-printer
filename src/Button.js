import React, { Component } from "react";

import { Button as MButton } from "@mui/material";

class Button extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <MButton variant="outlined" sx={{ color: "white", backgroundColor: "#1ab844" }} size="small" onClick={this.props.printHandler} disabled={this.props.printDisabled}>
          Print
        </MButton>

        <MButton
          variant="outlined"
          sx={{ color: "white", backgroundColor: "#c92644", marginLeft: "15px" }}
          size="small"
          onClick={this.props.clearHandler}
          disabled={this.props.clearDisabled}
        >
          Clear
        </MButton>
      </>
    );
  }
}

export default Button;
