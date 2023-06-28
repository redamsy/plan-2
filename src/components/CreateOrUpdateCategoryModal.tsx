import React, { memo } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { ICategoryBody } from "../models/Category";
import { useImageState } from "../context/imagesContext";

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
  defaultValues?: ICategoryBody;
  isCreatingOrUpdating: boolean;
  createOrUpdate: (payload: ICategoryBody) => void;
}

const CreateOrUpdateCategoryModal = memo(({ open, onClose, isCreatingOrUpdating, defaultValues, createOrUpdate }: Props) => {
  const { images } = useImageState();
  const {
    control,
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICategoryBody>({
    shouldUnregister: false,
    ...(defaultValues ? {defaultValues} : {}),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  //TODO: useCalBack
  async function onSubmit(data: ICategoryBody) {
    console.log("UpdateCategoryModal: onSubmit: data", data);
    const { id, name, imageId } = data;
    const payload: ICategoryBody = {
      id,
      name,
      imageId,
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
                <FormControl sx={{ width: '100%'}}>
                  <InputLabel id={`image-select-label`}>Google Drive Public Image Url</InputLabel>
                  <Controller
                    rules={{required: 'Image is required'}}
                    control={control}
                    name='imageId'
                    render={({ field }) => (
                      <>
                        <Select
                          {...field}
                          label="Image Url"
                          labelId={`image-select-label`}
                          id={`image-select`}
                        >
                          {images.map((image) => (
                            <MenuItem key={image.id} value={image.id}>
                              name: {image.name}, url: {image.url}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.imageId && (
                          <FormHelperText error={!!errors.imageId}>
                            {errors.imageId.message}
                          </FormHelperText>
                        )}
                      </>
                    )}
                  />
                </FormControl>
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

export default CreateOrUpdateCategoryModal;
