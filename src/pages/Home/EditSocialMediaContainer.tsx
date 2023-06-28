import React, { memo } from 'react';
import { Grid, TextField } from '@mui/material';
import {  useForm } from 'react-hook-form';
import styles from './Home.module.css';
import Button from '../../components/Button';
import { SectionPayload } from '../../models/Page';
import { SECTION_NAME_ENUM } from '.';
import { extractImageSrcFromUrlAsUC } from '../../utils';

var NotFoundImage = require('../../static/not-found.png');

export interface ISocialMediaContainerAttributes {
  name: string;
  subtitle: string;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
}
enum FormFieldsEnum {
  name = 'name',
  subtitle= 'subtitle',
  image1 = 'image1',
  image2= 'image2',
  image3= 'image3',
  image4= 'image4',
};

interface Props {
  sectionDataId?: string; 
  sectionName: SECTION_NAME_ENUM;
  socialMediaContainerAttributesObject?: Partial<ISocialMediaContainerAttributes>;
  createOrUpdate: (payload: SectionPayload, sectionDataId?: string) => void;
  onCancel: () => void
  isCreatingOrUpdating: boolean;
}
const EditSocialMediaContainer = memo((props: Props) => {
  const {
    sectionDataId,
    sectionName,
    socialMediaContainerAttributesObject,
    createOrUpdate,
    onCancel,
    isCreatingOrUpdating,
  } = props;  

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISocialMediaContainerAttributes>({
    shouldUnregister: false,
    ...(socialMediaContainerAttributesObject ? {defaultValues: socialMediaContainerAttributesObject} : {}),
  });

  const handleCancel = () => {
    reset();
    onCancel();
  };
  //TODO: useCalBack
  async function onSubmit(data: ISocialMediaContainerAttributes) {
    const { name, subtitle, image1, image2, image3, image4 } = data;
    const payload: SectionPayload = {
      name: sectionName,
      attributes: [
        {
          name: FormFieldsEnum.name,
          value: name
        },
        {
          name: FormFieldsEnum.subtitle,
          value: subtitle
        },
        {
          name: FormFieldsEnum.image1,
          value: image1
        },
        {
          name: FormFieldsEnum.image2,
          value: image2
        },
        {
          name: FormFieldsEnum.image3,
          value: image3
        },
        {
          name: FormFieldsEnum.image4,
          value: image4
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

  const CustomFieldInput = ({fieldName, fieldValue}:{fieldName: FormFieldsEnum; fieldValue?: string;}) => (
    <TextField
      InputProps={{
        classes: {
          input: styles.title,
        },
      }}
      InputLabelProps={{
        sx: {color: 'var(--standard-white)'},
      }}
      autoComplete={fieldName}
      required
      fullWidth
      id={fieldName}
      label={fieldName}
      autoFocus
      {...register(fieldName, {
        required: true,
        minLength: { value: 1, message: "min: 1 character"},
        maxLength: { value: 255, message: "max: 255 characters"},
      })}
      error={!!errors[fieldName]}
      helperText={errors[fieldName] ? errors[fieldName]?.message : null}
    />
  )
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        direction={'column'}
        container
        spacing={1}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={6}>
          <CustomFieldInput fieldName={FormFieldsEnum.name} fieldValue={socialMediaContainerAttributesObject?.name} />
        </Grid>
        <Grid item xs={6}>
          <CustomFieldInput fieldName={FormFieldsEnum.subtitle} fieldValue={socialMediaContainerAttributesObject?.subtitle} />
        </Grid>
      </Grid>
      <div className={styles.socialContentGrid}>
        <img src={extractImageSrcFromUrlAsUC(socialMediaContainerAttributesObject?.image1) || NotFoundImage} alt={'social media 1'} />
        <img src={extractImageSrcFromUrlAsUC(socialMediaContainerAttributesObject?.image2) || NotFoundImage} alt={'social media 2'} />
        <img src={extractImageSrcFromUrlAsUC(socialMediaContainerAttributesObject?.image3) || NotFoundImage} alt={'social media 3'} />
        <img src={extractImageSrcFromUrlAsUC(socialMediaContainerAttributesObject?.image4) || NotFoundImage} alt={'social media 4'} />
      </div>
      <div className={styles.EditSocialContainer}>
        <div className={styles.socialContentGrid}>
          <CustomFieldInput fieldName={FormFieldsEnum.image1} fieldValue={socialMediaContainerAttributesObject?.image1} />
          <CustomFieldInput fieldName={FormFieldsEnum.image2} fieldValue={socialMediaContainerAttributesObject?.image2} />
          <CustomFieldInput fieldName={FormFieldsEnum.image3} fieldValue={socialMediaContainerAttributesObject?.image3} />
          <CustomFieldInput fieldName={FormFieldsEnum.image4} fieldValue={socialMediaContainerAttributesObject?.image4} />
        </div>
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
              disabled={isCreatingOrUpdating}
              level={'primary'}
              fullWidth
              onClick={handleCancel}
            >
              {isCreatingOrUpdating ? 'Please wait..' : 'Cancel'}
            </Button>
          </Grid>
        </Grid>
      </div>
    </form>
  );
});

export default EditSocialMediaContainer;