import React, { memo } from 'react';
import { Grid, TextField } from '@mui/material';
import {  useForm } from 'react-hook-form';
import styles from './EditFirstContainer.module.css';
import Button from '../../components/Button';
import { SectionPayload } from '../../models/Page';
import { SECTION_NAME_ENUM } from '.';
import { extractImageSrcFromUrlAsUC } from '../../utils';

var NotFoundImage = require('../../static/not-found.png');

export interface IFirstContainerAttributes {
  image: string;
  title: string;
  subtitle: string;
}
enum FormFieldsEnum {
  image= 'image',
  title= 'title',
  subtitle= 'subtitle',
};

interface Props {
  maxWidth?: string;
  ctaStyle?: any;
  sectionDataId?: string; 
  sectionName: SECTION_NAME_ENUM;
  firstContainerAttributesObject?: Partial<IFirstContainerAttributes>;
  createOrUpdate: (payload: SectionPayload, sectionDataId?: string) => void;
  onCancel: () => void
  isCreatingOrUpdating: boolean;
}
const EditFirstContainer = memo((props: Props) => {
  const {
    maxWidth,
    ctaStyle,
    sectionDataId,
    sectionName,
    firstContainerAttributesObject,
    createOrUpdate,
    onCancel,
    isCreatingOrUpdating,
  } = props;  

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFirstContainerAttributes>({
    shouldUnregister: false,
    ...(firstContainerAttributesObject ? {defaultValues: firstContainerAttributesObject} : {}),
  });

  const handleCancel = () => {
    reset();
    onCancel();
  };
  //TODO: useCalBack
  async function onSubmit(data: IFirstContainerAttributes) {
    const { image, title, subtitle } = data;
    const payload: SectionPayload = {
      name: sectionName,
      attributes: [
        {
          name: FormFieldsEnum.image,
          value: image
        },
        {
          name: FormFieldsEnum.title,
          value: title
        },
        {
          name: FormFieldsEnum.subtitle,
          value: subtitle
        },
      ]
    };
      try {
        await createOrUpdate(payload, sectionDataId);
        // handleClose();      
      } catch (err) {
        console.error(err);    
      }
  }

  return (
    <div className={styles.root} style={{ backgroundImage: `url(${extractImageSrcFromUrlAsUC(firstContainerAttributesObject?.image) || NotFoundImage})` }}>
      <div className={styles.content} style={{ maxWidth: maxWidth }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            container
            spacing={1}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12}>
              <TextField
                InputProps={{
                  classes: {
                    input: styles.subtitle,
                  },
                }}
                InputLabelProps={{
                  sx: {color: 'var(--standard-white)'},
                }}
                autoComplete={FormFieldsEnum.image}
                required
                fullWidth
                id={FormFieldsEnum.image}
                label={FormFieldsEnum.image}
                autoFocus
                {...register(FormFieldsEnum.image, {
                  required: true,
                  minLength: { value: 1, message: "min: 1 character"},
                  maxLength: { value: 255, message: "max: 255 characters"},
                })}
                error={!!errors[FormFieldsEnum.image]}
                helperText={errors[FormFieldsEnum.image] ? errors[FormFieldsEnum.image]?.message : null}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                InputProps={{
                  classes: {
                    input: styles.title,
                  },
                }}
                InputLabelProps={{
                  sx: {color: 'var(--standard-white)'},
                }}
                // multiline// these 2 lines in combination with f(ont-size: 72px; line-height: 86px;) are causing a loop
                // rows={2}
                autoComplete={FormFieldsEnum.title}
                required
                fullWidth
                id={FormFieldsEnum.title}
                label={FormFieldsEnum.title}
                autoFocus
                {...register(FormFieldsEnum.title, {
                  required: true,
                  minLength: { value: 1, message: "min: 1 character"},
                  maxLength: { value: 255, message: "max: 255 characters"},
                })}
                error={!!errors[FormFieldsEnum.title]}
                helperText={errors[FormFieldsEnum.title] ? errors[FormFieldsEnum.title]?.message : null}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                InputProps={{
                  classes: {
                    input: styles.subtitle,
                  },
                }}
                InputLabelProps={{
                  sx: {color: 'var(--standard-white)'},
                }}
                autoComplete={FormFieldsEnum.subtitle}
                required
                fullWidth
                id={FormFieldsEnum.subtitle}
                label={FormFieldsEnum.subtitle}
                autoFocus
                {...register(FormFieldsEnum.subtitle, {
                  required: true,
                  minLength: { value: 1, message: "min: 1 character"},
                  maxLength: { value: 255, message: "max: 255 characters"},
                })}
                error={!!errors[FormFieldsEnum.subtitle]}
                helperText={errors[FormFieldsEnum.subtitle] ? errors[FormFieldsEnum.subtitle]?.message : null}
              />
            </Grid>
            <Grid
              container
              item
              spacing={1}
              justifyContent="center"
              alignItems="center"
              xs={12}
            >
              <Grid item xs={6}>
                <Button
                  className={`${ctaStyle}`}
                  disabled={isCreatingOrUpdating}
                  type="submit"
                  level={'primary'}
                  fullWidth
                >
                  {isCreatingOrUpdating ? 'Please wait..' : 'Submit'}
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  className={`${ctaStyle}`}
                  disabled={isCreatingOrUpdating}
                  level={'primary'}
                  fullWidth
                  onClick={handleCancel}
                >
                  {isCreatingOrUpdating ? 'Please wait..' : 'Cancel'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
});

export default EditFirstContainer;