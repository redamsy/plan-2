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
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { IImageBody } from "../models/Image";

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
  defaultValues?: IImageBody;
  isCreatingOrUpdating: boolean;
  createOrUpdate: (payload: IImageBody) => void;
}

const CreateOrUpdateImageModal = memo(({ open, onClose, isCreatingOrUpdating, defaultValues, createOrUpdate }: Props) => {

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IImageBody>({
    shouldUnregister: false,
    ...(defaultValues ? {defaultValues} : {}),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  //TODO: useCalBack
  async function onSubmit(data: IImageBody) {
    console.log("UpdateImageModal: onSubmit: data", data);
    const { id, name, url } = data;
    const payload: IImageBody = {
      id,
      name,
      url
    };
      try {
        await createOrUpdate(payload);
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
          {defaultValues ? 'Edit': 'Add'}
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
                  {...register("id")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="name"
                  required
                  fullWidth
                  id="name"
                  label="name"
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
              <Grid item xs={12}>
                <TextField
                  autoComplete="url"
                  required
                  fullWidth
                  id="url"
                  label="Google Drive Public Image Url"
                  {...register("url", {
                    required: true,
                    minLength: { value: 1, message: "min: 1 character"},
                    maxLength: { value: 150, message: "max: 150 characters"},
                  })}
                  error={!!errors.url}
                  helperText={
                    errors.url ? errors.url.message : null
                  }
                />
              </Grid>
            </Grid>
            <Button
              disabled={isCreatingOrUpdating}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              {isCreatingOrUpdating ? <>Please wait..</> : <>Submit</>}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default CreateOrUpdateImageModal;
