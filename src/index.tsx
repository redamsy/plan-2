import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { AuthProvider } from "./providers/authProvider";

const Main = (): JSX.Element => {
  return (
    //TODO: wrapp dashboard with this 
    // <ThemeProvider theme={theme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    // </ThemeProvider>
  );
};
const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
