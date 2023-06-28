import React, { memo, useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm  } from "react-hook-form";
import { IProductBody } from "../models/Product";
import Grid from "@mui/material/Grid";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { useProductActions, useProductState } from "../context/productsContext";
import { useImageState } from "../context/imagesContext";

const style = {
  width: '100%',
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface Props {
  open: boolean;
  onClose: () => void;
}

// eslint-disable-next-line react/display-name
const CreateProductModal = memo(({ open, onClose }: Props) => {
  const productActions = useProductActions();
  const { isCreating } = useProductState();
  const { images } = useImageState();


  const {
    control,
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProductBody>({
    shouldUnregister: false,
    defaultValues: {
      imageId: '',
    }
  });

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  //TODO: useCalBack
  const onSubmit = useCallback(async (data: IProductBody) => {
    console.log("CreateProductModal: data", data);
    const { id, itemCode, title, description, imageId, price, originalPrice, remaining } = data;
    //the unary plus operator (+) is used before the value variable to cast it to a number
    //If the value cannot be parsed as a valid number, it will result in NaN (Not a Number).
    //You can use the isNaN() function to check for NaN
    const payload: IProductBody = {
      id,
      itemCode,
      title,
      description,
      imageId,
      price: +price,
      originalPrice: originalPrice ? +originalPrice : undefined,
      remaining,
    };
    if (productActions) {
      try {
        await productActions.createNewProduct(payload);
        handleClose(); 
      } catch (err) {
        console.error(err);     
      }
    }
  }, [handleClose, productActions]);

  return (
    <div>
      <Dialog
        maxWidth={'md'}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            Add
            <IconButton onClick={handleClose}>
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={style}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  disabled
                  fullWidth
                  id="id"
                  label="id"
                  {...register("id")}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  autoComplete="itemCode"
                  required
                  fullWidth
                  id="itemCode"
                  label="Item Code"
                  autoFocus
                  {...register("itemCode", {
                    required: true,
                    minLength: { value: 8, message: "min: 8 character"},
                    maxLength: { value: 50, message: "max: 50 characters"},
                  })}
                  error={!!errors.itemCode}
                  helperText={errors.itemCode ? errors.itemCode.message : null}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  autoComplete="title"
                  required
                  fullWidth
                  id="title"
                  label="title"
                  autoFocus
                  {...register("title", {
                    required: true,
                    minLength: { value: 1, message: "min: 1 character"},
                    maxLength: { value: 50, message: "max: 50 characters"},
                  })}
                  error={!!errors.title}
                  helperText={errors.title ? errors.title.message : null}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  autoComplete="price"
                  required
                  fullWidth
                  id="price"
                  label="Price"
                  type="number"
                  {...register("price", {
                    required: 'Product price is required',
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: 'Product price must be a valid number with up to 2 decimal places',
                    },
                  })}
                  error={!!errors.price}
                  helperText={errors.price ? errors.price.message : null}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  autoComplete="originalPrice"
                  fullWidth
                  id="originalPrice"
                  label="Original Price"
                  type="number"
                  {...register("originalPrice", {
                    required: false,
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: 'Product Original Price must be a valid number with up to 2 decimal places',
                    },
                  })}
                  error={!!errors.originalPrice}
                  helperText={errors.originalPrice ? errors.originalPrice.message : null}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  autoComplete="remaining"
                  required
                  fullWidth
                  id="remaining"
                  label="Number of Remaining Products"
                  type="number"
                  inputProps={{ step: '1' }} // Set step attribute to '1' to allow only whole numbers
                  {...register('remaining', {
                    required: 'Number of remaining products is required',
                    min: { value: 0, message: 'Number of remaining products must be at least 0' },
                    max: { value: 9999, message: 'Number of remaining products cannot exceed 9999' },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Number of remaining products must be an integer',
                    },
                  })}
                  error={!!errors.remaining}
                  helperText={errors.remaining?.message || null}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  multiline
                  maxRows={4}
                  autoComplete="description"
                  required
                  fullWidth
                  id="description"
                  label="description"
                  {...register("description", {
                    required: true,
                    minLength: { value: 1, message: "min: 1 character"},
                    maxLength: { value: 255, message: "max: 255 characters"},
                  })}
                  error={!!errors.description}
                  helperText={
                    errors.description ? errors.description.message : null
                  }
                />
              </Grid>
              <Grid item xs={12} md={12}>
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
              disabled={isCreating}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              {isCreating ? <>Please wait..</> : <>Create</>}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default CreateProductModal;
