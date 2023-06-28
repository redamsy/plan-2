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
import { Controller, useForm, useFieldArray  } from "react-hook-form";
import { IProductBody } from "../models/Product";
import Grid from "@mui/material/Grid";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { useProductActions, useProductState } from "../context/productsContext";
import { useCategoryState } from "../context/categoriesContext";
import { useSubCategoryState } from "../context/subCategoriesContext";
import { useColorState } from "../context/colorsContext";
import { useSizeState } from "../context/sizesContext";
import { useImageState } from "../context/imagesContext";
import { useVendorState } from "../context/vendorsContext";

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
  const { categories } = useCategoryState();
  const { subCategories } = useSubCategoryState();
  const { colors } = useColorState();
  const { sizes } = useSizeState();
  const { images } = useImageState();
  const { vendors } = useVendorState();


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
      vendorId: '',
      pSCCs: [{ categoryId: '', subCategoryId: '' }],
      galleries: [{ imageId: '', sizeId: '', colorId: '', itemSubCode: '', subPrice: 0, subOriginalPrice: 0 }]
    }
  });

  const { fields: fields1, append: append1, remove: remove1 } = useFieldArray({
    control,
    name: 'pSCCs'
  });
  const { fields: fields2, append: append2, remove: remove2 } = useFieldArray({
    control,
    name: 'galleries'
  });

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  //TODO: useCalBack
  const onSubmit = useCallback(async (data: IProductBody) => {
    console.log("CreateProductModal: data", data);
    const { id, itemCode, title, description, vendorId, imageId, price, originalPrice, remaining, pSCCs, galleries } = data;
    //the unary plus operator (+) is used before the value variable to cast it to a number
    //If the value cannot be parsed as a valid number, it will result in NaN (Not a Number).
    //You can use the isNaN() function to check for NaN
    const payload: IProductBody = {
      id,
      itemCode,
      title,
      description,
      imageId,
      vendorId,
      price: +price,
      originalPrice: originalPrice ? +originalPrice : undefined,
      remaining,
      pSCCs: pSCCs.map((el) => {
        return {
          categoryId: el.categoryId,
          subCategoryId: el.subCategoryId
        }
      }),
      galleries: (galleries && (galleries.length > 0)) ? galleries.map((el) => {
        return {
          imageId: el.imageId,
          sizeId: el.sizeId,
          colorId: el.colorId,
          itemSubCode: el.itemSubCode,
          subPrice: el.subPrice,
          subOriginalPrice: el.subOriginalPrice,
        }
      }) : [],
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
  
  // Render function for the PSCC array
  const renderPSCCArray = () => (
    <>
      {fields1.map((fieldEl, index) => (
        <div key={index}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <FormControl sx={{ width: '100%'}}>
                <InputLabel id={`${fieldEl.id}-category-select-label`}>Category</InputLabel>
                <Controller
                  rules={{required: 'Category is required'}}
                  control={control}
                  name={`pSCCs.${index}.categoryId`}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        label="Category"
                        labelId={`${fieldEl.id}-category-select-label`}
                        id={`${fieldEl.id}-category-select`}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors?.pSCCs?.[index]?.categoryId && (
                        <FormHelperText error={!!errors?.pSCCs?.[index]?.categoryId}>
                          {errors?.pSCCs?.[index]?.categoryId?.message}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={5}>
              <FormControl sx={{ width: '100%'}}>
                <InputLabel id={`${fieldEl.id}-subcategory-select-label`}>Sub Category</InputLabel>
                <Controller
                  rules={{required: 'Sub Category is required'}}
                  control={control}
                  name={`pSCCs.${index}.subCategoryId`}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        label="Sub Category"
                        labelId={`${fieldEl.id}-subcategory-select-label`}
                        id={`${fieldEl.id}-subcategory-select`}
                      >
                        {subCategories.map((subCategory) => (
                          <MenuItem key={subCategory.id} value={subCategory.id}>
                            {subCategory.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors?.pSCCs?.[index]?.subCategoryId && (
                        <FormHelperText error={!!errors?.pSCCs?.[index]?.subCategoryId}>
                          {errors?.pSCCs?.[index]?.subCategoryId?.message}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                onClick={() => remove1(index)}
              >
                Remove
              </Button>
            </Grid>
          </Grid>
        </div>
      ))}
    </>
  );

  // Render function for the gallery array
  const renderGalleryArray = () => (
    <>
      {fields2.map((fieldEl, index) => (
        <div key={index}>
          <Grid container spacing={2}>

            <Grid item xs={12} md={12}>
              <FormControl sx={{ width: '100%'}}>
                <InputLabel id={`${fieldEl.id}-image-select-label`}>Google Drive Public Image Url</InputLabel>
                <Controller
                  rules={{required: 'Image is required'}}
                  control={control}
                  name={`galleries.${index}.imageId`}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        label="Image"
                        labelId={`${fieldEl.id}-image-select-label`}
                        id={`${fieldEl.id}-image-select`}
                      >
                        {images.map((image) => (
                          <MenuItem key={image.id} value={image.id}>
                            name: {image.name}, url: {image.url}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors?.galleries?.[index]?.imageId && (
                        <FormHelperText error={!!errors?.galleries?.[index]?.imageId}>
                          {errors?.galleries?.[index]?.imageId?.message}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl sx={{ width: '100%'}}>
                <InputLabel id={`${fieldEl.id}-color-select-label`}>Color</InputLabel>
                <Controller
                  rules={{required: 'Color is required'}}
                  control={control}
                  name={`galleries.${index}.colorId`}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        label="Color"
                        labelId={`${fieldEl.id}-color-select-label`}
                        id={`${fieldEl.id}-color-select`}
                      >
                        {colors.map((color) => (
                          <MenuItem key={color.id} value={color.id}>
                            {color.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors?.galleries?.[index]?.colorId && (
                        <FormHelperText error={!!errors?.galleries?.[index]?.colorId}>
                          {errors?.galleries?.[index]?.colorId?.message}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl sx={{ width: '100%'}}>
                <InputLabel id={`${fieldEl.id}-size-select-label`}>Size</InputLabel>
                <Controller
                  rules={{required: 'Size is required'}}
                  control={control}
                  name={`galleries.${index}.sizeId`}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        label="Size"
                        labelId={`${fieldEl.id}-size-select-label`}
                        id={`${fieldEl.id}-size-select`}
                      >
                        {sizes.map((size) => (
                          <MenuItem key={size.id} value={size.id}>
                            {size.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors?.galleries?.[index]?.sizeId && (
                        <FormHelperText error={!!errors?.galleries?.[index]?.sizeId}>
                          {errors?.galleries?.[index]?.sizeId?.message}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                autoComplete="itemSubCode"
                required
                fullWidth
                id="itemSubCode"
                label="Item Sub Code"
                autoFocus
                {...register(`galleries.${index}.itemSubCode`, {
                  required: true,
                  minLength: { value: 8, message: "min: 8 character"},
                  maxLength: { value: 50, message: "max: 50 characters"},
                })}
                error={!!errors?.galleries?.[index]?.itemSubCode}
                helperText={errors?.galleries?.[index]?.itemSubCode ? errors?.galleries?.[index]?.itemSubCode?.message : null}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                autoComplete="subPrice"
                required
                fullWidth
                id="subPrice"
                label="Sub Price"
                type="number"
                {...register(`galleries.${index}.subPrice`, {
                  required: 'Product price is required',
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: 'Product Sub price must be a valid number with up to 2 decimal places',
                  },
                })}
                error={!!errors?.galleries?.[index]?.subPrice}
                helperText={errors?.galleries?.[index]?.subPrice ? errors?.galleries?.[index]?.subPrice?.message : null}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                autoComplete="subOriginalPrice"
                fullWidth
                id="subOriginalPrice"
                label="Sub Original Price"
                type="number"
                {...register(`galleries.${index}.subOriginalPrice`, {
                  required: false,
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: 'Product Sub Original Price must be a valid number with up to 2 decimal places',
                  },
                })}
                error={!!errors?.galleries?.[index]?.subOriginalPrice}
                helperText={errors?.galleries?.[index]?.subOriginalPrice ? errors?.galleries?.[index]?.subOriginalPrice?.message : null}
              />
            </Grid>
              
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                onClick={() => remove2(index)}
              >
                Remove
              </Button>
            </Grid>
          </Grid>
        </div>
      ))}
    </>
  );

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
                  <InputLabel id={`vendor-select-label`}>Vendor</InputLabel>
                  <Controller
                    rules={{required: 'Vendor is required'}}
                    control={control}
                    name='vendorId'
                    render={({ field }) => (
                      <>
                        <Select
                          {...field}
                          label="Vendor"
                          labelId={`vendor-select-label`}
                          id={`vendor-select`}
                        >
                          {vendors.map((vendor) => (
                            <MenuItem key={vendor.id} value={vendor.id}>
                              {vendor.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.vendorId && (
                          <FormHelperText error={!!errors.vendorId}>
                            {errors.vendorId.message}
                          </FormHelperText>
                        )}
                      </>
                    )}
                  />
                </FormControl>
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
              <Grid item xs={12} md={12}>
                <Button onClick={() => append1({ categoryId: '', subCategoryId: '' })}>
                  Add PSCC
                </Button>
              </Grid>
              <Grid item xs={12} md={12}>
                {renderPSCCArray()}
              </Grid>
              <Grid item xs={12} md={12}>
                <Button
                  onClick={
                    () => append2({
                      imageId: '',
                      sizeId: '',
                      colorId: '',
                      itemSubCode: '',
                      subPrice: 0,
                      subOriginalPrice: 0
                    })
                  }
                 >
                  Add Gallery item
                </Button>
              </Grid>
              <Grid item xs={12} md={12}>
                {renderGalleryArray()}
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
