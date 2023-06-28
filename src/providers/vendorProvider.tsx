import React, {
    useCallback,
    ReactNode,
    useEffect,
    useState,
    useMemo,
  } from "react";
  import { IVendorBody, Vendor } from "../models/Vendor";
  import {
    createVendor,
    deleteVendor,
    getVendors,
    updateVendor,
  } from "../actions/vendor";
  import CircularProgressPage from "../components/CircularProgressPage";
  import { VendorContext, initialVendorContext } from "../context/vendorsContext";
  
  export const VendorProvider = ({ children }: { children: ReactNode }) => {
  
    const [vendors, setVendors] = useState<Vendor[]>(initialVendorContext.state.vendors);
    const [loadingData, setLoadingData] = useState<boolean>(initialVendorContext.state.loadingData);
    const [isCreating, setIsCreating] = useState<boolean>(initialVendorContext.state.isCreating);
    const [isUpdating, setIsUpdating] = useState<boolean>(initialVendorContext.state.isUpdating);
    const [isDeleting, setIsDeleting] = useState<boolean>(initialVendorContext.state.isDeleting);
    const [createError, setCreateError] = useState<string>(
      initialVendorContext.state.createError
    );
    const [updateError, setUpdateError] = useState<string>(
      initialVendorContext.state.updateError
    );
    const [deleteError, setDeleteError] = useState<string>(
      initialVendorContext.state.deleteError
    );
    const [openSnack, setOpenSnack] = useState(initialVendorContext.state.openSnack);
  
    useEffect(() => {
      const fetchVendors = async () => {
        try {
          setLoadingData(true);
          const res = await getVendors();
          console.log("vendorProvider: res.data", res.data);
          setVendors(res.data);
          setLoadingData(false);
        } catch (error: Error | any) {
          setLoadingData(false);
        }
      };
  
      fetchVendors();
    }, []);
  
    const clearErrorsAndCloseSnack = useCallback(() => {
      setCreateError("");
      setUpdateError("");
      setDeleteError("");
      setOpenSnack(false);
    }, [])
  
    const createNewVendor = useCallback(async (vendorBody: IVendorBody) => {
      try {
        clearErrorsAndCloseSnack();
        setIsCreating(true);
        const createResponse = await createVendor(vendorBody);
        console.log("vendorProvider: createNewVendor", createResponse);
        const { status, data: vendor } = createResponse;
  
        if (vendor && status === 201) {
  
          setVendors([...vendors, vendor]);
  
          setIsCreating(false);
          setCreateError("");
          setOpenSnack(true);
  
        } else {
          setIsCreating(false);
          setCreateError(`Create vendor faild: ${createResponse.status}`);
          setOpenSnack(true);
        }
      } catch (error: Error | any) {
        setIsCreating(false);
        if(error?.response && error?.response?.data && error?.response?.data?.message){
          setCreateError(`Create vendor faild: ${error.response.data.message}`);
        } else {
          setCreateError(`Create vendor faild: ${error.message}`);
        }
        setOpenSnack(true);
      }
    }, [vendors, clearErrorsAndCloseSnack]);
  
    const updateCurrentVendor = useCallback(async (vendorBody: IVendorBody) => {
      try {
        clearErrorsAndCloseSnack();
        setIsUpdating(true);
        const updateResponse = await updateVendor(vendorBody);
        console.log("vendorProvider: updateCurrentVendor", updateResponse);
        const { status, data: vendor } = updateResponse;
        if (vendor && status === 200) {
  
  
          setVendors((prevVendors) =>{
            return prevVendors.map((p) => (p.id === vendor.id ? vendor : p));
          });
  
          setIsUpdating(false);
          setUpdateError("");
          setOpenSnack(true);
  
        } else {
          setIsUpdating(false);
          setUpdateError(`Update vendor faild: ${updateResponse.status}`);
          setOpenSnack(true);
        }
      } catch (error: Error | any) {
        setIsUpdating(false);
        if(error?.response && error?.response?.data && error?.response?.data?.message){
          setUpdateError(`Update vendor faild: ${error.response.data.message}`);
        } else {
          setUpdateError(`Update vendor faild: ${error.message}`);
        }
        setOpenSnack(true);
      }
    }, [clearErrorsAndCloseSnack]);
  
    const deleteCurrentVendor = useCallback(async (vendorId: string) => {
      try {
        clearErrorsAndCloseSnack();
        setIsDeleting(true);
        const deleteResponse = await deleteVendor(vendorId);
        console.log("vendorProvider: deleteResponse", deleteResponse);
        if (deleteResponse.status === 200) {
  
          setVendors(vendors.filter((vendor) => vendor.id !== vendorId));
  
          setIsDeleting(false);
          setDeleteError("");
          setOpenSnack(true);
  
        } else {
          setIsDeleting(false);
          setDeleteError(`Delete vendor faild: ${deleteResponse.status}`);
          setOpenSnack(true);
        }
      } catch (error: Error | any) {
        setIsDeleting(false);
        if(error?.response && error?.response?.data && error?.response?.data?.message){
          setDeleteError(`Delete vendor faild: ${error.response.data.message}`);
        } else {
          setDeleteError(`Delete vendor faild: ${error.message}`);
        }
        setOpenSnack(true);
      }
    }, [vendors, clearErrorsAndCloseSnack]);
  
    const vendorContext = useMemo(
      () => ({
        state: {
          vendors,
          loadingData,
          isCreating,
          isUpdating,
          isDeleting,
          createError,
          updateError,
          deleteError,
          openSnack,
        },
        actions: { createNewVendor, updateCurrentVendor, deleteCurrentVendor, clearErrorsAndCloseSnack },
      }),
      [
        createNewVendor,
        updateCurrentVendor,
        deleteCurrentVendor,
        clearErrorsAndCloseSnack,
        vendors,
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
      <VendorContext.Provider value={vendorContext}>
      {loadingData ? <CircularProgressPage /> : children}
      </VendorContext.Provider>
    );
  };
    