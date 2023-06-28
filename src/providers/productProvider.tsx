import React, {
  useCallback,
  ReactNode,
  useEffect,
  useState,
  useMemo,
} from "react";
import { Product, IProductBody } from "../models/Product";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../actions/product";
import CircularProgressPage from "../components/CircularProgressPage";
import { ProductContext, initialProductContext } from "../context/productsContext";

export const ProductProvider = ({ children }: { children: ReactNode }) => {

  const [products, setProducts] = useState<Product[]>(initialProductContext.state.products);
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingData(true);
        const res = await getProducts();
        console.log("productProvider: res.data", res.data);
        setProducts(res.data);
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
      const { status, data: product } = createResponse;

      if (product && status === 201) {

        setProducts([...products, product]);

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
  }, [products, clearErrorsAndCloseSnack]);

  const updateCurrentProduct = useCallback(async (productBody: IProductBody) => {
    try {
      clearErrorsAndCloseSnack();
      setIsUpdating(true);
      const updateResponse = await updateProduct(productBody);
      console.log("productProvider: updateCurrentProduct", updateResponse);
      const { status, data: product } = updateResponse;
      if (product && status === 200) {


        setProducts((prevProducts) =>{
          return prevProducts.map((p) => (p.id === product.id ? product : p));
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

        setProducts(products.filter((product) => product.id !== productId));

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
  }, [products, clearErrorsAndCloseSnack]);

  const productContext = useMemo(
    () => ({
      state: {
        products,
        loadingData,
        isCreating,
        isUpdating,
        isDeleting,
        createError,
        updateError,
        deleteError,
        openSnack,
      },
      actions: { createNewProduct, updateCurrentProduct, deleteCurrentProduct, clearErrorsAndCloseSnack },
    }),
    [
      createNewProduct,
      updateCurrentProduct,
      deleteCurrentProduct,
      clearErrorsAndCloseSnack,
      products,
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
    <ProductContext.Provider value={productContext}>
    {loadingData ? <CircularProgressPage /> : children}
    </ProductContext.Provider>
  );
};
