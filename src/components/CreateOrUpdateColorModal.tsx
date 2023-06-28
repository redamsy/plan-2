import React, { memo } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import { IColorBody } from "../models/Color";

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
  defaultValues: IColorBody;
  isCreatingOrUpdating: boolean;
  createOrUpdate: (payload: IColorBody) => void;
}

const CreateOrUpdateColorModal = memo(({ open, onClose, isCreatingOrUpdating, defaultValues, createOrUpdate }: Props) => {

  const {
    watch,
    control,
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IColorBody>({
    shouldUnregister: false,
    defaultValues
  });
  const watchColorCode = watch("colorCode", defaultValues.colorCode)
  const handleClose = () => {
    reset();
    onClose();
  };

  //TODO: useCalBack
  async function onSubmit(data: IColorBody) {
    console.log("UpdateColorModal: onSubmit: data", data);
    const { id, name, colorCode } = data;
    const payload: IColorBody = {
      id,
      name,
      colorCode,
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
              {watchColorCode ? (
                <Grid item xs={12}>
                  <FormControl sx={{ width: '100%'}}>
                    <Controller
                      rules={{
                        required: true,
                        minLength: { value: 1, message: "min: 1 character"},
                        maxLength: { value: 50, message: "max: 50 characters"},
                      }}
                      control={control}
                      name='colorCode'
                      render={({ field }) => (
                        <TextField
                          required
                          fullWidth
                          id="colorCode"
                          label="Color Code"
                          autoFocus
                          type='color'
                          {...field}
                          error={!!errors.colorCode}
                          helperText={errors.colorCode ? errors.colorCode.message : null}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              ) : <></>}
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

export default CreateOrUpdateColorModal;
