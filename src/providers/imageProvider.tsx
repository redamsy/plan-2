import React, {
  useCallback,
  ReactNode,
  useEffect,
  useState,
  useMemo,
} from "react";
import { IImageBody, Image } from "../models/Image";
import {
  createImage,
  deleteImage,
  getImages,
  updateImage,
} from "../actions/image";
import CircularProgressPage from "../components/CircularProgressPage";
import { ImageContext, initialImageContext } from "../context/imagesContext";

export const ImageProvider = ({ children }: { children: ReactNode }) => {

  const [images, setImages] = useState<Image[]>(initialImageContext.state.images);
  const [loadingData, setLoadingData] = useState<boolean>(initialImageContext.state.loadingData);
  const [isCreating, setIsCreating] = useState<boolean>(initialImageContext.state.isCreating);
  const [isUpdating, setIsUpdating] = useState<boolean>(initialImageContext.state.isUpdating);
  const [isDeleting, setIsDeleting] = useState<boolean>(initialImageContext.state.isDeleting);
  const [createError, setCreateError] = useState<string>(
    initialImageContext.state.createError
  );
  const [updateError, setUpdateError] = useState<string>(
    initialImageContext.state.updateError
  );
  const [deleteError, setDeleteError] = useState<string>(
    initialImageContext.state.deleteError
  );
  const [openSnack, setOpenSnack] = useState(initialImageContext.state.openSnack);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoadingData(true);
        const res = await getImages();
        console.log("imageProvider: res.data", res.data);
        setImages(res.data);
        setLoadingData(false);
      } catch (error: Error | any) {
        setLoadingData(false);
      }
    };

    fetchImages();
  }, []);

  const clearErrorsAndCloseSnack = useCallback(() => {
    setCreateError("");
    setUpdateError("");
    setDeleteError("");
    setOpenSnack(false);
  }, [])

  const createNewImage = useCallback(async (imageBody: IImageBody) => {
    try {
      clearErrorsAndCloseSnack();
      setIsCreating(true);
      const createResponse = await createImage(imageBody);
      console.log("imageProvider: createNewImage", createResponse);
      const { status, data: image } = createResponse;

      if (image && status === 201) {

        setImages([...images, image]);

        setIsCreating(false);
        setCreateError("");
        setOpenSnack(true);

      } else {
        setIsCreating(false);
        setCreateError(`Create image faild: ${createResponse.status}`);
        setOpenSnack(true);
      }
    } catch (error: Error | any) {
      setIsCreating(false);
      if(error?.response && error?.response?.data && error?.response?.data?.message){
        setCreateError(`Create image faild: ${error.response.data.message}`);
      } else {
        setCreateError(`Create image faild: ${error.message}`);
      }
      setOpenSnack(true);
    }
  }, [images, clearErrorsAndCloseSnack]);

  const updateCurrentImage = useCallback(async (imageBody: IImageBody) => {
    try {
      clearErrorsAndCloseSnack();
      setIsUpdating(true);
      const updateResponse = await updateImage(imageBody);
      console.log("imageProvider: updateCurrentImage", updateResponse);
      const { status, data: image } = updateResponse;
      if (image && status === 200) {


        setImages((prevImages) =>{
          return prevImages.map((p) => (p.id === image.id ? image : p));
        });

        setIsUpdating(false);
        setUpdateError("");
        setOpenSnack(true);

      } else {
        setIsUpdating(false);
        setUpdateError(`Update image faild: ${updateResponse.status}`);
        setOpenSnack(true);
      }
    } catch (error: Error | any) {
      setIsUpdating(false);
      if(error?.response && error?.response?.data && error?.response?.data?.message){
        setUpdateError(`Update image faild: ${error.response.data.message}`);
      } else {
        setUpdateError(`Update image faild: ${error.message}`);
      }
      setOpenSnack(true);
    }
  }, [clearErrorsAndCloseSnack]);

  const deleteCurrentImage = useCallback(async (imageId: string) => {
    try {
      clearErrorsAndCloseSnack();
      setIsDeleting(true);
      const deleteResponse = await deleteImage(imageId);
      console.log("imageProvider: deleteResponse", deleteResponse);
      if (deleteResponse.status === 200) {

        setImages(images.filter((image) => image.id !== imageId));

        setIsDeleting(false);
        setDeleteError("");
        setOpenSnack(true);

      } else {
        setIsDeleting(false);
        setDeleteError(`Delete image faild: ${deleteResponse.status}`);
        setOpenSnack(true);
      }
    } catch (error: Error | any) {
      setIsDeleting(false);
      if(error?.response && error?.response?.data && error?.response?.data?.message){
        setDeleteError(`Delete image faild: ${error.response.data.message}`);
      } else {
        setDeleteError(`Delete image faild: ${error.message}`);
      }
      setOpenSnack(true);
    }
  }, [images, clearErrorsAndCloseSnack]);

  const imageContext = useMemo(
    () => ({
      state: {
        images,
        loadingData,
        isCreating,
        isUpdating,
        isDeleting,
        createError,
        updateError,
        deleteError,
        openSnack,
      },
      actions: { createNewImage, updateCurrentImage, deleteCurrentImage, clearErrorsAndCloseSnack },
    }),
    [
      createNewImage,
      updateCurrentImage,
      deleteCurrentImage,
      clearErrorsAndCloseSnack,
      images,
      isCreating,
      isUpdating,
      isDeleting,
      loadingData,
      createError,
      updateError,
      deleteError,
      openSnack,
    ]
  );

  return (
    <ImageContext.Provider value={imageContext}>
    {loadingData ? <CircularProgressPage /> : children}
    </ImageContext.Provider>
  );
};
  