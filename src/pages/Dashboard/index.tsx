import * as React from "react";
import HomeIcon from "@mui/icons-material/Home";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import AppBarWrapper from "../../components/AppBarWrapper";
import Tabs from "../../components/Tabs";
import { useAuthState } from "../../context/authContext";
import { Navigate } from "react-router-dom";

export default function Dashboard(): JSX.Element {
  const { isAuthenticated } = useAuthState();

  return isAuthenticated ? (
    <AppBarWrapper
      pageName="Dashboard"
      buttonIcon={<HomeIcon />}
      buttonPath="">
      <Container component="main" maxWidth='xl'>
        <CssBaseline />
        <Tabs/>
      </Container>
    </AppBarWrapper>
  ) : (
    // we can remove this and add a dialog inside ProdutProvider
    //"Your session has expired"
    //"Please log in again to continue using the app."
    <Navigate to="/signin" />

);
}
