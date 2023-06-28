import React, {
  useCallback,
  ReactNode,
  useEffect,
  useState,
  useMemo,
} from "react";
import { ICategoryBody, Category } from "../models/Category";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../actions/category";
import CircularProgressPage from "../components/CircularProgressPage";
import { CategoryContext, initialCategoryContext } from "../context/categoriesContext";

export const CategoryProvider = ({ children }: { children: ReactNode }) => {

  const [categories, setCategories] = useState<Category[]>(initialCategoryContext.state.categories);
  const [loadingData, setLoadingData] = useState<boolean>(initialCategoryContext.state.loadingData);
  const [isCreating, setIsCreating] = useState<boolean>(initialCategoryContext.state.isCreating);
  const [isUpdating, setIsUpdating] = useState<boolean>(initialCategoryContext.state.isUpdating);
  const [isDeleting, setIsDeleting] = useState<boolean>(initialCategoryContext.state.isDeleting);
  const [createError, setCreateError] = useState<string>(
    initialCategoryContext.state.createError
  );
  const [updateError, setUpdateError] = useState<string>(
    initialCategoryContext.state.updateError
  );
  const [deleteError, setDeleteError] = useState<string>(
    initialCategoryContext.state.deleteError
  );
  const [openSnack, setOpenSnack] = useState(initialCategoryContext.state.openSnack);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingData(true);
        const res = await getCategories();
        console.log("categoryProvider: res.data", res.data);
        setCategories(res.data);
        setLoadingData(false);
      } catch (error: Error | any) {
        setLoadingData(false);
      }
    };

    fetchCategories();
  }, []);

  const clearErrorsAndCloseSnack = useCallback(() => {
    setCreateError("");
    setUpdateError("");
    setDeleteError("");
    setOpenSnack(false);
  }, [])

  const createNewCategory = useCallback(async (categoryBody: ICategoryBody) => {
    try {
      clearErrorsAndCloseSnack();
      setIsCreating(true);
      const createResponse = await createCategory(categoryBody);
      console.log("categoryProvider: createNewCategory", createResponse);
      const { status, data: category } = createResponse;

      if (category && status === 201) {

        setCategories([...categories, category]);

        setIsCreating(false);
        setCreateError("");
        setOpenSnack(true);

      } else {
        setIsCreating(false);
        setCreateError(`Create category faild: ${createResponse.status}`);
        setOpenSnack(true);
      }
    } catch (error: Error | any) {
      setIsCreating(false);
      if(error?.response && error?.response?.data && error?.response?.data?.message){
        setCreateError(`Create category faild: ${error.response.data.message}`);
      } else {
        setCreateError(`Create category faild: ${error.message}`);
      }
      setOpenSnack(true);
    }
  }, [categories, clearErrorsAndCloseSnack]);

  const updateCurrentCategory = useCallback(async (categoryBody: ICategoryBody) => {
    try {
      clearErrorsAndCloseSnack();
      setIsUpdating(true);
      const updateResponse = await updateCategory(categoryBody);
      console.log("categoryProvider: updateCurrentCategory", updateResponse);
      const { status, data: category } = updateResponse;
      if (category && status === 200) {


        setCategories((prevCategories) =>{
          return prevCategories.map((p) => (p.id === category.id ? category : p));
        });

        setIsUpdating(false);
        setUpdateError("");
        setOpenSnack(true);

      } else {
        setIsUpdating(false);
        setUpdateError(`Update category faild: ${updateResponse.status}`);
        setOpenSnack(true);
      }
    } catch (error: Error | any) {
      setIsUpdating(false);
      if(error?.response && error?.response?.data && error?.response?.data?.message){
        setUpdateError(`Update category faild: ${error.response.data.message}`);
      } else {
        setUpdateError(`Update category faild: ${error.message}`);
      }
      setOpenSnack(true);
    }
  }, [clearErrorsAndCloseSnack]);

  const deleteCurrentCategory = useCallback(async (categoryId: string) => {
    try {
      clearErrorsAndCloseSnack();
      setIsDeleting(true);
      const deleteResponse = await deleteCategory(categoryId);
      console.log("categoryProvider: deleteResponse", deleteResponse);
      if (deleteResponse.status === 200) {

        setCategories(categories.filter((category) => category.id !== categoryId));

        setIsDeleting(false);
        setDeleteError("");
        setOpenSnack(true);

      } else {
        setIsDeleting(false);
        setDeleteError(`Delete category faild: ${deleteResponse.status}`);
        setOpenSnack(true);
      }
    } catch (error: Error | any) {
      setIsDeleting(false);
      if(error?.response && error?.response?.data && error?.response?.data?.message){
        setDeleteError(`Delete category faild: ${error.response.data.message}`);
      } else {
        setDeleteError(`Delete category faild: ${error.message}`);
      }
      setOpenSnack(true);
    }
  }, [categories, clearErrorsAndCloseSnack]);

  const categoryContext = useMemo(
    () => ({
      state: {
        categories,
        loadingData,
        isCreating,
        isUpdating,
        isDeleting,
        createError,
        updateError,
        deleteError,
        openSnack,
      },
      actions: { createNewCategory, updateCurrentCategory, deleteCurrentCategory, clearErrorsAndCloseSnack },
    }),
    [
      createNewCategory,
      updateCurrentCategory,
      deleteCurrentCategory,
      clearErrorsAndCloseSnack,
      categories,
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
    <CategoryContext.Provider value={categoryContext}>
    {loadingData ? <CircularProgressPage /> : children}
    </CategoryContext.Provider>
  );
};
