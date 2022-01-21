import React, { Component } from "react";
import { alpha, styled } from "@mui/system";
import { TextField } from "@mui/material";

const RedditTextField = styled((props) => <TextField InputProps={{ disableUnderline: true }} {...props} />)(({ theme }) => ({
  "& .MuiInputLabel-root": {
    padding: "0px 0px 0px 0px",
    fontSize: "13px",
  },
  "& .MuiFilledInput-root": {
    border: "1px solid #e2e2e1",
    overflow: "hidden",
    borderRadius: 4,
    backgroundColor: theme.palette.mode === "light" ? "#fcfcfb" : "#2b2b2b",
    transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&.Mui-focused": {
      backgroundColor: "transparent",
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      borderColor: theme.palette.primary.main,
    },
  },
  "& .MuiFilledInput-input": {
    margin: "17px 0px 2px 10px ",
    padding: "0px 0px 0px 0px ",
    fontSize: "16px",
    "&::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
}));

class Copies extends Component {
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
      <RedditTextField
        sx={{ width: "70px", marginRight: "15px" }}
        label="Copies"
        variant="filled"
        type="number"
        value={this.props.value}
        onChange={(e) => this.props.handler(e.target.value)}
      />
    );
  }
}

export default Copies;
