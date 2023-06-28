import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useForm } from "react-hook-form";
import { useAuthActions, useAuthState } from "../../context/authContext";
import { useState } from "react";
import {
  Alert,
  IconButton,
  InputAdornment,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ISignUpBody } from "../../models/SignUp";

export default function SignUp(): JSX.Element {
  const { signUpError, isSigningUp } = useAuthState();
  const { signUp } = useAuthActions();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [openSnack, setOpenSnack] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUpBody>();

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleClose = (
    event: React.SyntheticEvent<any> | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason && reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  async function onSubmit(data: ISignUpBody) {
    const updatePayload: ISignUpBody = {
      name: data.name,
      userName: data.userName,
      password: data.password,
    };

    try {
      await signUp(updatePayload);
      setOpenSnack(true);
    } catch (err) {
      console.error(err);
      setOpenSnack(true);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-name"
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
                {...register("name", {
                  required: "min: 8, max: 50",
                  minLength: 8,
                  maxLength: 50,
                })}
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : null}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="userName"
                label="Username"
                autoComplete="userName"
                {...register("userName", {
                  required: "min: 8, max: 50",
                  minLength: 8,
                  maxLength: 50,
                })}
                error={!!errors.userName}
                helperText={errors.userName ? errors.userName.message : null}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...register("password", {
                  required: "min: 8, max: 50",
                  minLength: 8,
                  maxLength: 50,
                })}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : null}
              />
            </Grid>
          </Grid>
          <Button
            disabled={isSigningUp}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            {isSigningUp ? <>Please wait..</> : <>Sign Up</>}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={openSnack}
          autoHideDuration={7000}
          onClose={handleClose}>
          {!signUpError ? (
            <Alert onClose={handleClose} severity="success">
              you signed up successfully
            </Alert>
          ) : (
            <Alert onClose={handleClose} severity="error">
              {signUpError}
            </Alert>
          )}
        </Snackbar>
      </Box>
    </Container>
  );
}
