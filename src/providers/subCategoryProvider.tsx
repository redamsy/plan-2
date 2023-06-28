import React, {
  useCallback,
  ReactNode,
  useEffect,
  useState,
  useMemo,
} from "react";
import { ISubCategoryBody, SubCategory } from "../models/SubCategory";
import {
  createSubCategory,
  deleteSubCategory,
  getSubCategories,
  updateSubCategory,
} from "../actions/subCategory";
import CircularProgressPage from "../components/CircularProgressPage";
import { SubCategoryContext, initialSubCategoryContext } from "../context/subCategoriesContext";

export const SubCategoryProvider = ({ children }: { children: ReactNode }) => {

  const [subCategories, setSubCategories] = useState<SubCategory[]>(initialSubCategoryContext.state.subCategories);
  const [loadingData, setLoadingData] = useState<boolean>(initialSubCategoryContext.state.loadingData);
  const [isCreating, setIsCreating] = useState<boolean>(initialSubCategoryContext.state.isCreating);
  const [isUpdating, setIsUpdating] = useState<boolean>(initialSubCategoryContext.state.isUpdating);
  const [isDeleting, setIsDeleting] = useState<boolean>(initialSubCategoryContext.state.isDeleting);
  const [createError, setCreateError] = useState<string>(
    initialSubCategoryContext.state.createError
  );
  const [updateError, setUpdateError] = useState<string>(
    initialSubCategoryContext.state.updateError
  );
  const [deleteError, setDeleteError] = useState<string>(
    initialSubCategoryContext.state.deleteError
  );
  const [openSnack, setOpenSnack] = useState(initialSubCategoryContext.state.openSnack);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        setLoadingData(true);
        const res = await getSubCategories();
        console.log("subCategoryProvider: res.data", res.data);
        setSubCategories(res.data);
        setLoadingData(false);
      } catch (error: Error | any) {
        setLoadingData(false);
      }
    };

    fetchSubCategories();
  }, []);

  const clearErrorsAndCloseSnack = useCallback(() => {
    setCreateError("");
    setUpdateError("");
    setDeleteError("");
    setOpenSnack(false);
  }, [])

  const createNewSubCategory = useCallback(async (subCategoryBody: ISubCategoryBody) => {
    try {
      clearErrorsAndCloseSnack();
      setIsCreating(true);
      const createResponse = await createSubCategory(subCategoryBody);
      console.log("subCategoryProvider: createNewSubCategory", createResponse);
      const { status, data: subCategory } = createResponse;

      if (subCategory && status === 201) {

        setSubCategories([...subCategories, subCategory]);

        setIsCreating(false);
        setCreateError("");
        setOpenSnack(true);

      } else {
        setIsCreating(false);
        setCreateError(`Create subCategory faild: ${createResponse.status}`);
        setOpenSnack(true);
      }
    } catch (error: Error | any) {
      setIsCreating(false);
      if(error?.response && error?.response?.data && error?.response?.data?.message){
        setCreateError(`Create subCategory faild: ${error.response.data.message}`);
      } else {
        setCreateError(`Create subCategory faild: ${error.message}`);
      }
      setOpenSnack(true);
    }
  }, [subCategories, clearErrorsAndCloseSnack]);

  const updateCurrentSubCategory = useCallback(async (subCategoryBody: ISubCategoryBody) => {
    try {
      clearErrorsAndCloseSnack();
      setIsUpdating(true);
      const updateResponse = await updateSubCategory(subCategoryBody);
      console.log("subCategoryProvider: updateCurrentSubCategory", updateResponse);
      const { status, data: subCategory } = updateResponse;
      if (subCategory && status === 200) {


        setSubCategories((prevSubCategories) =>{
          return prevSubCategories.map((p) => (p.id === subCategory.id ? subCategory : p));
        });

        setIsUpdating(false);
        setUpdateError("");
        setOpenSnack(true);

      } else {
        setIsUpdating(false);
        setUpdateError(`Update subCategory faild: ${updateResponse.status}`);
        setOpenSnack(true);
      }
    } catch (error: Error | any) {
      setIsUpdating(false);
      if(error?.response && error?.response?.data && error?.response?.data?.message){
        setUpdateError(`Update subCategory faild: ${error.response.data.message}`);
      } else {
        setUpdateError(`Update subCategory faild: ${error.message}`);
      }
      setOpenSnack(true);
    }
  }, [clearErrorsAndCloseSnack]);

  const deleteCurrentSubCategory = useCallback(async (subCategoryId: string) => {
    try {
      clearErrorsAndCloseSnack();
      setIsDeleting(true);
      const deleteResponse = await deleteSubCategory(subCategoryId);
      console.log("subCategoryProvider: deleteResponse", deleteResponse);
      if (deleteResponse.status === 200) {

        setSubCategories(subCategories.filter((subCategory) => subCategory.id !== subCategoryId));

        setIsDeleting(false);
        setDeleteError("");
        setOpenSnack(true);

      } else {
        setIsDeleting(false);
        setDeleteError(`Delete subCategory faild: ${deleteResponse.status}`);
        setOpenSnack(true);
      }
    } catch (error: Error | any) {
      setIsDeleting(false);
      if(error?.response && error?.response?.data && error?.response?.data?.message){
        setDeleteError(`Delete subCategory faild: ${error.response.data.message}`);
      } else {
        setDeleteError(`Delete subCategory faild: ${error.message}`);
      }
      setOpenSnack(true);
    }
  }, [subCategories, clearErrorsAndCloseSnack]);

  const subCategoryContext = useMemo(
    () => ({
      state: {
        subCategories,
        loadingData,
        isCreating,
        isUpdating,
        isDeleting,
        createError,
        updateError,
        deleteError,
        openSnack,
      },
      actions: { createNewSubCategory, updateCurrentSubCategory, deleteCurrentSubCategory, clearErrorsAndCloseSnack },
    }),
    [
      createNewSubCategory,
      updateCurrentSubCategory,
      deleteCurrentSubCategory,
      clearErrorsAndCloseSnack,
      subCategories,
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
    <SubCategoryContext.Provider value={subCategoryContext}>
    {loadingData ? <CircularProgressPage /> : children}
    </SubCategoryContext.Provider>
  );
};
