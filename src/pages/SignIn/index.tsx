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
import { ISignInBody } from "../../models/SignIn";
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

export default function SignIn(): JSX.Element {
  const { signInError, isSigningIn } = useAuthState();
  const { signIn } = useAuthActions();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [openSnack, setOpenSnack] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignInBody>();

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

  async function onSubmit(data: ISignInBody) {
    const updatePayload: ISignInBody = {
      userName: data.userName,
      password: data.password,
    };

    try {
      await signIn(updatePayload);
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
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="userName"
            label="Username"
            autoComplete="userName"
            autoFocus
            {...register("userName", {
              required: "min: 8, max: 50",
              minLength: 8,
              maxLength: 50,
            })}
            error={!!errors.userName}
            helperText={errors.userName ? errors.userName.message : null}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
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
          <Button
            disabled={isSigningIn}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            {isSigningIn ? <>Please wait..</> : <>Sign In</>}
          </Button>
          <Grid container>
            {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={openSnack}
        autoHideDuration={7000}
        onClose={handleClose}>
        {!signInError ? (
          <Alert onClose={handleClose} severity="success">
            you are signed in
          </Alert>
        ) : (
          <Alert onClose={handleClose} severity="error">
            {signInError}
          </Alert>
        )}
      </Snackbar>
    </Container>
  );
}
