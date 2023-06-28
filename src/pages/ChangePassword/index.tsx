import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { IChangePasswordBody } from "../../models/ChangePassword";

const style = {
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface Props {
    isChangingPassword: boolean;
    open: boolean;
    onChangePassword: (data: IChangePasswordBody) => Promise<void>;
    onClose: () => void;
}
export default function ChangePassword({ isChangingPassword, open, onChangePassword, onClose}: Props): JSX.Element {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IChangePasswordBody>();

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const handleClickShowNewPassword = () => {
    setShowNewPassword((prevShowNewPassword) => !showNewPassword);
  };

  const handleClose = () => {
    reset();
    onClose();
  };
  
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  async function onSubmit(data: IChangePasswordBody) {
    const updatePayload: IChangePasswordBody = {
      password: data.password,
      newPassword: data.newPassword,
    };

    try {
      await onChangePassword(updatePayload);
      handleClose();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-name"
        aria-describedby="modal-modal-name"
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          Edit Dollar Rate (Sayrafa)
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={style}
          >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="password"
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
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                autoComplete="newPassword"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowNewPassword}
                        onMouseDown={handleMouseDownPassword}>
                        {showNewPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...register("newPassword", {
                  required: "min: 8, max: 50",
                  minLength: 8,
                  maxLength: 50,
                })}
                error={!!errors.newPassword}
                helperText={errors.newPassword ? errors.newPassword.message : null}
              />
            </Grid>
          </Grid>
          <Button
            disabled={isChangingPassword}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            {isChangingPassword ? <>Please wait..</> : <>Submit</>}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="signin" variant="body2">
                Sign in
              </Link>
            </Grid>
          </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
