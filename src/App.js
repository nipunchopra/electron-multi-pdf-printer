import React from "react";
import Directory from "./Directory";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import { StylesProvider } from "@mui/styles";
import blue from "@mui/material/colors/blue";

export default function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: blue[200],
      },
      secondary: {
        main: "#11cb5f",
      },
    },
  });

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Directory></Directory>
      </ThemeProvider>
    </StylesProvider>
  );
}
