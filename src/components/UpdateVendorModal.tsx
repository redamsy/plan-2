import React, { memo } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import { useForm } from "react-hook-form";
import { IVendorBody, Vendor } from "../models/Vendor";
import { useVendorActions, useVendorState } from "../context/vendorsContext";

const style = {
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
interface Props {
  open: boolean;
  onClose: () => void;
  vendor: Vendor;
}

// eslint-disable-next-line react/display-name
const UpdateVendorModal = memo(({ open, onClose, vendor }: Props) => {
  const vendorActions = useVendorActions();
  const { isUpdating } = useVendorState();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IVendorBody>({
    defaultValues: {
      id: vendor.id,
      name: vendor.name,
    },
    shouldUnregister: false,
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  //TODO: useCalBack
  async function onSubmit(data: IVendorBody) {
    console.log("UpdateVendorModal: onSubmit: data", data);
    const { id, name } = data;
    const payload: IVendorBody = {
      id,
      name,
    };
    if (vendorActions) {
      try {
        await vendorActions.updateCurrentVendor(payload);
        handleClose();      
      } catch (err) {
        console.error(err);    
      }
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
            Edit
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
                  disabled
                  fullWidth
                  id="id"
                  label="id"
                  autoFocus
                  {...register("id")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                  {...register("name", {
                    required: true,
                    minLength: { value: 1, message: "min: 1 character"},
                    maxLength: { value: 50, message: "max: 50 characters"},
                  })}
                  error={!!errors.name}
                  helperText={errors.name ? errors.name.message : null}
                />
              </Grid>
            </Grid>
            <Button
              disabled={isUpdating}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              {isUpdating ? <>Please wait..</> : <>Update</>}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default UpdateVendorModal;
