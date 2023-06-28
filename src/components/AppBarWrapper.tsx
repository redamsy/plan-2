import React, {useCallback, useState} from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import {
  Tooltip,
  Alert,
  Snackbar,
} from "@mui/material";
import { CurrencyExchange } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuthActions, useAuthState } from "../context/authContext";
import CurrencyAndRateEdit from "./CurrencyAndRateEdit";
import ChangePassword from "../pages/ChangePassword";

export default function AppBarWrapper({
  children,
  pageName,
  buttonIcon,
  buttonPath,
}: {
  children: React.ReactNode;
  pageName: string;
  buttonPath: string;
  buttonIcon: React.ReactNode;
}): JSX.Element {
  const navigate = useNavigate();
  const { signOut, clearErrorsAndCloseSnack, changePassword } = useAuthActions();
  const { openSnack, isUpdating, updateError, changePasswordError, isChangingPassword, userProfile } = useAuthState();

  const handleClose = useCallback(() => {
    clearErrorsAndCloseSnack();
  }, [clearErrorsAndCloseSnack]);

  function handleClick() {
    navigate(`/${buttonPath}`);
  }

  function handleSignOut() {
    signOut();
  }

  const [openCurrencyModal, setOpenCurrencyModal] = useState(false);
  const handleOpenCurrencyModal = () => {
    setOpenCurrencyModal(true);
  };
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const handleOpenChangePasswordModal = () => {
    setOpenChangePasswordModal(true);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Tooltip arrow placement="left" title="Go Home">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={handleClick}>
                {buttonIcon}
              </IconButton>
            </Tooltip>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {pageName}
            </Typography>
            <div style={{ marginRight: '5%'}}>
              <Tooltip arrow placement="left" title="Edit Sayrafa Rate">
                <IconButton onClick={handleOpenCurrencyModal}>
                  <CurrencyExchange />
                </IconButton>
              </Tooltip>
            </div>
            <div style={{ marginRight: '1%'}}>
              <Button color="secondary"  variant="contained" onClick={handleOpenChangePasswordModal}>
                Change Password
              </Button>
            </div>
            <Button color="secondary"  variant="contained" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Toolbar>
        </AppBar>
        {openCurrencyModal && userProfile && (
          <CurrencyAndRateEdit
            open={openCurrencyModal}
            userProfile={userProfile}
            isUpdating={isUpdating}
            onClose={() => setOpenCurrencyModal(false)}
          />
        )}
        {openChangePasswordModal && (
          <ChangePassword
            open={openChangePasswordModal}
            isChangingPassword={isChangingPassword}
            onClose={() => setOpenChangePasswordModal(false)}
            onChangePassword={(data) => changePassword(data)}
          />
        )}
        {children}
      </Box>
      {openSnack ? (
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={openSnack}
          autoHideDuration={7000}
          onClose={handleClose}
        >
          {(!changePasswordError && !updateError) ? (
            <Alert onClose={handleClose} severity="success">
              Succesful
            </Alert>
          ) : (
            <Alert onClose={handleClose} severity="error">
              {changePasswordError || updateError}
            </Alert>
          )}
        </Snackbar>
      ) : (<></>)}
    </>
  );
}
