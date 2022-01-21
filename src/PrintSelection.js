import React, { Component } from "react";

import { styled } from "@mui/system";
import { FormControl, Select, MenuItem, InputBase } from "@mui/material";

const BootstrapInput = styled(InputBase)(({ theme }) => ({}));

class PrintSelection extends Component {
  render() {
    return (
      <FormControl>
        <Select
          sx={{ fontSize: "14px", width: "150px" }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={this.props.value}
          onChange={(e) => {
            this.props.handler(e.target.value);
          }}
          input={<BootstrapInput />}
        >
          <MenuItem sx={{ fontSize: "15px" }} value="all">
            All Pages
          </MenuItem>
          <MenuItem sx={{ fontSize: "12px" }} value="even">
            Only Even
          </MenuItem>
          <MenuItem sx={{ fontSize: "12px" }} value="odd">
            Only Odd
          </MenuItem>
        </Select>
      </FormControl>
    );
  }
}

export default PrintSelection;
