import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";

import "styles/index.css";
import theme from "styles/theme";
import IndexPage from "components/IndexPage";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <IndexPage />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
