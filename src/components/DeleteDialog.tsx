import React, { memo } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
interface IProps {
  open: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  handleRemove: () => void;
}
// eslint-disable-next-line react/display-name
const DeleteAlertDialog = memo(({ open, isDeleting, onCancel, handleRemove }: IProps) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">delete?</DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          click to delete permenently
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleRemove} color="primary" autoFocus disabled={isDeleting}>
            {isDeleting ? <>Please wait..</> : <>Delete</>}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default DeleteAlertDialog;
