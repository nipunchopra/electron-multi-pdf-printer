import React, { Component } from "react";

import { styled } from "@mui/system";
import { FormControl, Select, MenuItem, InputBase } from "@mui/material";

const BootstrapInput = styled(InputBase)(({ theme }) => ({}));

class Printers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      printers: [],
    };
  }

  componentDidMount() {
    window.api.receiveAllPrinters.add(this.handlerPrinterList);
    window.api.fetchAllPrinters();
  }

  componentWillUnmount() {
    window.api.receiveAllPrinters.remove(this.handlerPrinterList);
  }

  handlerPrinterList = (_, list) => {
    this.setState({ printers: list });
  };

  render() {
    return (
      <FormControl>
        <Select
          sx={{ fontSize: "12px", width: "225px" }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={this.props.value}
          onChange={(e) => {
            this.props.handler(e.target.value);
          }}
          input={<BootstrapInput />}
        >
          <MenuItem sx={{ fontSize: "12px" }} value="none">
            Select Printer
          </MenuItem>
          {this.state.printers.map(({ name, displayName }) => (
            <MenuItem key={name} sx={{ fontSize: "12px" }} value={displayName}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

export default Printers;
