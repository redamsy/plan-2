import React, { memo, useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Controller, useForm  } from "react-hook-form";
import { useAuthActions } from "../../context/authContext";
import { CURRENCY_ENUM, ICurrency, UserProfile } from "../../models/userProfile";

const style = {
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CurrencyAndRateEdit = memo(({open, userProfile, isUpdating, onClose} : {open: boolean; userProfile: UserProfile; isUpdating: boolean; onClose: () => void;}) => {
  const { updateCurrentRate } = useAuthActions();

  const handleClose = () => {
    reset();
    onClose();
  };
  const {
    control,
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICurrency>({
    shouldUnregister: false,
    defaultValues: { rate: userProfile.rate, currency: userProfile.currency },
  });

  //TODO: useCallBack
  async function onSubmit(data: ICurrency) {
    console.log("CurrencyAndRateEdit: onSubmit: data", data);
    const { rate, currency } = data;
    const payload: ICurrency = {
      rate,
      currency
    };
      try {
        await updateCurrentRate(payload);
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
                <Tooltip
                  arrow
                  placement="top"
                  title="If you choose LBP and your products data are in LBP, enter '1'. If you choose USD and your products data are in USD, enter '1'."
                >
                  <TextField
                    autoComplete="rate"
                    required
                    fullWidth
                    id="rate"
                    label="Current Rate"
                    type="number"
                    {...register("rate", {
                      required: 'Rate is required',
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: 'Rate must be a valid number with up to 2 decimal places',
                      },
                    })}
                    error={!!errors.rate}
                    helperText={errors.rate ? errors.rate.message : null}
                  />
                </Tooltip>
              </Grid>
              <Grid item xs={12}>
                <Tooltip arrow placement="top" title="Currency You want to show to visitors">
                  <FormControl sx={{ width: '100%'}}>
                    <InputLabel id={`currency-select-label`}>Currency</InputLabel>
                    <Controller
                      rules={{required: 'Currency is required'}}
                      control={control}
                      name='currency'
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            label="Currency"
                            labelId={`currency-select-label`}
                            id={`currency-select`}
                          >
                            <MenuItem value={CURRENCY_ENUM.LBP}>
                              {CURRENCY_ENUM.LBP}
                            </MenuItem>
                            <MenuItem value={CURRENCY_ENUM.USD}>
                              {CURRENCY_ENUM.USD}
                            </MenuItem>
                          </Select>
                          {errors.currency && (
                            <FormHelperText error={!!errors.currency}>
                              {errors.currency.message}
                            </FormHelperText>
                          )}
                        </>
                      )}
                    />
                  </FormControl>
                </Tooltip>
              </Grid>
            </Grid>
            <Button
              disabled={isUpdating}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              {isUpdating ? <>Please wait..</> : <>Submit</>}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default CurrencyAndRateEdit;
