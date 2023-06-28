import React, {
  useCallback,
  ReactNode,
  useEffect,
  useState,
  useMemo,
} from "react";
import { DetailedProduct, IProductBody } from "../models/Product";
import {
  createProduct,
  deleteProduct,
  getDetailedProducts,
  updateProduct,
} from "../actions/product";
import CircularProgressPage from "../components/CircularProgressPage";
import { ProductContext, initialProductContext } from "../context/productsContext";
import { generateCategoriesWithSub, generateSizesAndColors } from "../utils";

export const ProductProvider = ({ children }: { children: ReactNode }) => {

  const [detailedProducts, setDetailedProducts] = useState<DetailedProduct[]>(initialProductContext.state.detailedProducts);
  const [loadingData, setLoadingData] = useState<boolean>(initialProductContext.state.loadingData);
  const [isCreating, setIsCreating] = useState<boolean>(initialProductContext.state.isCreating);
  const [isUpdating, setIsUpdating] = useState<boolean>(initialProductContext.state.isUpdating);
  const [isDeleting, setIsDeleting] = useState<boolean>(initialProductContext.state.isDeleting);
  const [createError, setCreateError] = useState<string>(
    initialProductContext.state.createError
  );
  const [updateError, setUpdateError] = useState<string>(
    initialProductContext.state.updateError
  );
  const [deleteError, setDeleteError] = useState<string>(
    initialProductContext.state.deleteError
  );
  const [openSnack, setOpenSnack] = useState(initialProductContext.state.openSnack);

  const categoriesWithSubFilters = useMemo(() => generateCategoriesWithSub(detailedProducts), [detailedProducts]);
  const { sizes: sizeFilters, colors: colorFilters } = useMemo(() => generateSizesAndColors(detailedProducts), [detailedProducts]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingData(true);
        const res = await getDetailedProducts();
        console.log("productProvider: res.data", res.data);
        setDetailedProducts(res.data);
        setLoadingData(false);
      } catch (error: Error | any) {
        setLoadingData(false);
      }
    };

    fetchProducts();
  }, []);

  const clearErrorsAndCloseSnack = useCallback(() => {
    setCreateError("");
    setUpdateError("");
    setDeleteError("");
    setOpenSnack(false);
  }, [])

  const createNewProduct = useCallback(async (productBody: IProductBody) => {
    try {
      clearErrorsAndCloseSnack();
      setIsCreating(true);
      const createResponse = await createProduct(productBody);
      console.log("productProvider: createNewProduct", createResponse);
      const { status, data: detailedProduct } = createResponse;

      if (detailedProduct && status === 201) {

        setDetailedProducts([...detailedProducts, detailedProduct]);

        setIsCreating(false);
        setCreateError("");
        setOpenSnack(true);

      } else {
        setIsCreating(false);
        setCreateError(`Create product faild: ${createResponse.status}`);
        setOpenSnack(true);
      }
    } catch (error: Error | any) {
      console.log("productProvider: createNewProduct error", error);
      setIsCreating(false);
      if(error?.response && error?.response?.data && error?.response?.data?.message){
        setCreateError(`Create product faild: ${error.response.data.message}`);
      } else {
        setCreateError(`Create product faild: ${error.message}`);
      }
      setOpenSnack(true);
    }
  }, [detailedProducts, clearErrorsAndCloseSnack]);

  const updateCurrentProduct = useCallback(async (productBody: IProductBody) => {
    try {
      clearErrorsAndCloseSnack();
      setIsUpdating(true);
      const updateResponse = await updateProduct(productBody);
      console.log("productProvider: updateCurrentProduct", updateResponse);
      const { status, data: detailedProduct } = updateResponse;
      if (detailedProduct && status === 200) {


        setDetailedProducts((prevDetailedProducts) =>{
          return prevDetailedProducts.map((p) => (p.id === detailedProduct.id ? detailedProduct : p));
        });

        setIsUpdating(false);
        setUpdateError("");
        setOpenSnack(true);

      } else {
        setIsUpdating(false);
        setUpdateError(`Update product faild: ${updateResponse.status}`);
        setOpenSnack(true);
      }
    } catch (error: Error | any) {
      console.log("productProvider: updateCurrentProduct error", error);
      setIsUpdating(false);
      if(error?.response && error?.response?.data && error?.response?.data?.message){
        setUpdateError(`Update product faild: ${error.response.data.message}`);
      } else {
        setUpdateError(`Update product faild: ${error.message}`);
      }
      setOpenSnack(true);
    }
  }, [clearErrorsAndCloseSnack]);

  const deleteCurrentProduct = useCallback(async (productId: string) => {
    try {
      clearErrorsAndCloseSnack();
      setIsDeleting(true);
      const deleteResponse = await deleteProduct(productId);
      console.log("productProvider: deleteResponse", deleteResponse);
      if (deleteResponse.status === 200) {

        setDetailedProducts(detailedProducts.filter((detailedProduct) => detailedProduct.id !== productId));

        setIsDeleting(false);
        setDeleteError("");
        setOpenSnack(true);

      } else {
        setIsDeleting(false);
        setDeleteError(`Delete product faild: ${deleteResponse.status}`);
        setOpenSnack(true);
      }
    } catch (error: Error | any) {
      console.log("productProvider: deleteCurrentProduct error", error);
      setIsDeleting(false);
      if(error?.response && error?.response?.data && error?.response?.data?.message){
        setDeleteError(`Delete product faild: ${error.response.data.message}`);
      } else {
        setDeleteError(`Delete product faild: ${error.message}`);
      }
      setOpenSnack(true);
    }
  }, [detailedProducts, clearErrorsAndCloseSnack]);

  const productContext = useMemo(
    () => ({
      state: {
        detailedProducts,
        loadingData,
        isCreating,
        isUpdating,
        isDeleting,
        createError,
        updateError,
        deleteError,
        openSnack,
        categoriesWithSubFilters,
        sizeFilters,
        colorFilters,
      },
      actions: { createNewProduct, updateCurrentProduct, deleteCurrentProduct, clearErrorsAndCloseSnack },
    }),
    [
      createNewProduct,
      updateCurrentProduct,
      deleteCurrentProduct,
      clearErrorsAndCloseSnack,
      detailedProducts,
      isCreating,
      isUpdating,
      isDeleting,
      loadingData,
      createError,
      updateError,
      deleteError,
      openSnack,
      categoriesWithSubFilters,
      sizeFilters,
      colorFilters,
    ]
  );

  return (
    <ProductContext.Provider value={productContext}>
    {loadingData ? <CircularProgressPage /> : children}
    </ProductContext.Provider>
  );
};
