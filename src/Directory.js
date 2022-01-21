import React, { Component } from "react";
import { styled } from "@mui/system";
import TablePaginationUnstyled from "@mui/base/TablePaginationUnstyled";
import Printers from "./Printers";
import PrintSelection from "./PrintSelection";
import Copies from "./Copies";
import ProgressBar from "./ProgressBar";
import Button from "./Button";

const blue = {
  200: "#A5D8FF",
  400: "#3399FF",
};

const grey = {
  50: "#F3F6F9",
  100: "#E7EBF0",
  200: "#E0E3E7",
  300: "#CDD2D7",
  400: "#B2BAC2",
  500: "#A0AAB4",
  600: "#6F7E8C",
  700: "#3E5060",
  800: "#2D3843",
  900: "#1A2027",
};

const Root = styled("div")(
  ({ theme }) => `
  table {
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    border-collapse: collapse;
    width: 100%;
  }

  td,
  th {
    border: 1px solid ${theme.palette.mode === "dark" ? grey[800] : grey[200]};
    text-align: left;
    padding: 6px;
  }

  th {
    background-color: ${theme.palette.mode === "dark" ? grey[900] : grey[100]};
  }
  `
);

const CustomTablePagination = styled(TablePaginationUnstyled)(
  ({ theme }) => `
  & .MuiTablePaginationUnstyled-spacer {
    display: none;
  }
  & .MuiTablePaginationUnstyled-toolbar {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }
  & .MuiTablePaginationUnstyled-selectLabel {
    margin: 0;
  }
  & .MuiTablePaginationUnstyled-select {
    padding: 2px;
    border: 1px solid ${theme.palette.mode === "dark" ? grey[800] : grey[200]};
    border-radius: 50px;
    background-color: transparent;
    &:hover {
      background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[50]};
    }
    &:focus {
      outline: 1px solid ${theme.palette.mode === "dark" ? blue[400] : blue[200]};
    }
  }
  & .MuiTablePaginationUnstyled-displayedRows {
    margin: 0;

    @media (min-width: 768px) {
      margin-left: auto;
    }
  }
  & .MuiTablePaginationUnstyled-actions {
    padding: 2px;
    border: 1px solid ${theme.palette.mode === "dark" ? grey[800] : grey[200]};
    border-radius: 50px;
    text-align: center;
  }
  & .MuiTablePaginationUnstyled-actions > button {
    margin: 0 8px;
    border: transparent;
    border-radius: 2px;
    background-color: transparent;
    &:hover {
      background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[50]};
    }
    &:focus {
      outline: 1px solid ${theme.palette.mode === "dark" ? blue[400] : blue[200]};
    }
  }
  `
);

const intialData = [];

const intialState = {
  page: 0,
  data: intialData,
  copies: 1,
  subset: "all",
  printer: "none",
  printing: false,
  filesPrinted: 0,
  progress: 0,
  clearPending: false,
};

class Directory extends Component {
  constructor(props) {
    super(props);

    this.rowsPerPage = 10;

    this.state = intialState;
  }

  componentDidMount() {
    this.dragDropListener();
    window.api.receiveVerifiedFiles.add(this.handleVerifiedList);
    window.api.receivePrintedFiles.add(this.handlePrintedFiles);
    window.api.receivePrintingCompleted.add(this.handlePrintingComp);
    window.api.receiveClear.add(this.handleClearConfirm);
  }

  componentWillUnmount() {
    // window.removeEventListener("dragover");
    // window.removeEventListener("drag");
    window.api.receiveVerifiedFiles.remove(this.handleVerifiedList);
    window.api.receivePrintedFiles.remove(this.handlePrintedFiles);
    window.api.receivePrintingCompleted.remove(this.handlePrintingComp);
    window.api.receiveClear.remove(this.handleClearConfirm);
  }

  dragDropListener = () => {
    window.addEventListener("dragover", (event) => {
      event.stopPropagation();
      event.preventDefault();
    });

    window.addEventListener("drop", (event) => {
      event.stopPropagation();
      event.preventDefault();

      if (this.state.clearPending === false || this.state.printing === false) {
        const files = [...event.dataTransfer.files];

        const fileList = files.map(function (file) {
          return { name: file.name, path: file.path };
        });

        window.api.fetchFilesToVerify(fileList);
      }
    });
  };

  handleVerifiedList = (_, files) => {
    this.setState((state) => {
      return { data: state.data.concat(files) };
    });
  };

  handlePrintCmd = () => {
    this.setState({ printing: true, clearPending: true });
    window.api.fetchFilesToPrint({ files: this.state.data, copies: this.state.copies, subset: this.state.subset, printer: this.state.printer });
  };

  handlePrintedFiles = (_, { printed, id }) => {
    this.setState((state) => {
      if (printed) {
        Object.assign(state.data[id], { printer: state.printer });
      } else {
        Object.assign(state.data[id], { printer: "Failed" });
      }

      let printedF = state.filesPrinted + 1;

      let pro = Math.floor((printedF * 100) / state.data.length);

      return { data: state.data, progress: pro, filesPrinted: printedF };
    });
  };

  handlePrintingComp = () => {
    this.setState({ printing: false });
  };

  handleClear = () => {
    window.api.fetchClear();
  };

  handleClearConfirm = () => {
    this.setState({
      page: 0,
      data: intialData,
      printing: false,
      filesPrinted: 0,
      progress: 0,
      clearPending: false,
    });
  };

  // Avoid a layout jump when reaching the last page with empty data.
  emptyRows = () => {
    return this.state.page > 0 ? Math.max(0, (1 + this.state.page) * this.rowsPerPage - this.state.data.length) : 0;
  };

  handleChangePage = (_, newPage) => {
    this.setState({
      page: newPage,
    });
  };

  render() {
    return (
      <Root sx={{ maxWidth: "100%" }}>
        <table aria-label="Pagination table">
          <thead>
            <tr>
              <th>File Directory</th>
              <th>Size</th>
              <th>Printer</th>
            </tr>
          </thead>
          <tbody>
            {(this.rowsPerPage > 0 ? this.state.data.slice(this.state.page * this.rowsPerPage, this.state.page * this.rowsPerPage + this.rowsPerPage) : this.state.data).map(
              (row) => (
                <tr key={row.name + `${Math.random(5)}`}>
                  <td style={{ width: 170 }}>{row.name}</td>
                  <td align="right">{row.path}</td>
                  <td style={{ width: 230 }} align="right">
                    {row.printer}
                  </td>
                </tr>
              )
            )}

            {this.emptyRows > 0 && (
              <tr style={{ height: 41 * this.emptyRows }}>
                <td colSpan={3} />
              </tr>
            )}
          </tbody>
          <tfoot style={{ display: "table", position: "fixed", bottom: "0", minWidth: "100%" }}>
            <tr>
              <td>
                <ProgressBar progress={this.state.progress} />
              </td>
              <CustomTablePagination
                sx={{ width: "35%" }}
                rowsPerPageOptions={[]}
                colSpan={1}
                count={this.state.data.length}
                rowsPerPage={this.rowsPerPage}
                page={this.state.page}
                componentsProps={{
                  actions: {
                    showFirstButton: true,
                    showLastButton: true,
                  },
                }}
                onPageChange={this.handleChangePage}
              />
            </tr>
            <tr>
              <td colSpan={3}>
                <div style={{ float: "left", paddingLeft: "5px" }}>
                  <PrintSelection handler={(type) => this.setState({ subset: type })} value={this.state.subset} />
                </div>
                {/* <Copies handler={(copies) => this.setState({ copies: copies })} value={this.state.copies} /> */}
                <div style={{ float: "left", paddingLeft: "10px" }}>
                  <Printers handler={(printer) => this.setState({ printer: printer })} value={this.state.printer} />
                </div>
                <div style={{ float: "left", paddingLeft: "20px" }}>
                  <Button
                    clearHandler={this.handleClear}
                    clearDisabled={this.state.printing === true}
                    printHandler={this.handlePrintCmd}
                    printDisabled={this.state.printer === "none" || this.state.printing === true || this.state.clearPending === true || this.state.data.length === 0}
                  ></Button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </Root>
    );
  }
}

export default Directory;

// Math.floor((this.state.filesPrinted * 100) / (this.state.data.length() + 1));
//
