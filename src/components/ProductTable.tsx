import React, { useCallback, useState, memo } from 'react';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'material-react-table';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useProductActions, useProductState } from '../context/productsContext';
import { Product } from '../models/Product';
import DeleteDialog from './DeleteDialog';
import CreateProductModal from './CreateProductModal';
import UpdateProductModal from './UpdateProductModal';
import CircularProgressPage from './CircularProgressPage';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { extractImageSrcFromUrlAsThumbnail } from '../utils';
import { ExportToCsv, Options } from 'export-to-csv-fix-source-map';

var NotFoundImage = require('../static/not-found.png');

const columns: MRT_ColumnDef<Product>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      enableColumnOrdering: false,
      enableEditing: false, //disable editing on this column
      enableSorting: false,
    },
    {
      accessorKey: 'itemCode',
      header: 'Item Code',
    },
    {
      accessorFn: (row) => `${row.title}`, //accessorFn used to join multiple data into a single cell
      accessorKey: 'title',
      header: 'Title',
      Cell: ({ renderedCellValue, row }) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <img
            alt="avatar"
            height={30}
            src={extractImageSrcFromUrlAsThumbnail(row.original.image.url) || NotFoundImage}
            loading="lazy"
            style={{ borderRadius: '50%' }}
          />
          {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
          <span>{renderedCellValue}</span>
        </Box>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      Cell: ({ row }) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span
            style={{wordBreak: 'break-word', wordWrap: 'break-word', overflowWrap: 'break-word'}}
          >{row.original.description}
          </span>
        </Box>
      ),
    },
    {
      accessorFn: (row) => `${row.image.name} : ${row.image.url}`, 
      accessorKey: 'image',
      header: 'Google Drive Public Image Url',
      enableColumnOrdering: false,
      enableEditing: false, //disable editing on this column
      enableSorting: false,
    },
    {
      accessorKey: 'price',
      header: 'Price $',
    },
    {
      accessorKey: 'originalPrice',
      header: 'Original Price $',
    },
    {
      accessorKey: 'remaining',
      header: 'Remaining',
    },
    {
      accessorFn: (row) => new Date(row.createdAt), //convert to Date for sorting and filtering
      id: 'createdAt',
      header: 'Created At',
      // filterFn: 'lessThanOrEqualTo',
      enableColumnFilter: false,
      sortingFn: 'datetime',
      Cell: ({ cell }) => cell.getValue<Date>()?.toLocaleDateString(), //render Date as a string
      Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
    },
    {
      accessorFn: (row) => new Date(row.updatedAt), //convert to Date for sorting and filtering
      id: 'updatedAt',
      header: 'Updated At',
      // filterFn: 'lessThanOrEqualTo',
      enableColumnFilter: false,
      sortingFn: 'datetime',
      Cell: ({ cell }) => cell.getValue<Date>()?.toLocaleDateString(), //render Date as a string
      Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
    },
  ];

const csvOptions: Options = {
  fieldSeparator: ',',
  quoteStrings: '"',
  decimalSeparator: '.',
  showLabels: true,
  showTitle: true,
  filename: 'Product Table',
  title: 'Products Table',
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: false,
  headers: columns.map((c) => c.header),// <-- Won't work with useKeysAsHeaders present!
};
const csvExporter = new ExportToCsv(csvOptions);

const ProductTable = memo(() => {
  const productActions = useProductActions();
  const { products, loadingData, isDeleting, createError, updateError, deleteError, openSnack } = useProductState();

  const [createOpen, setCreateOpen] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState<Product | null>(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string>("");

  const handleClose = useCallback(() => {
    productActions.clearErrorsAndCloseSnack();
  }, [productActions]);

  const handleCreateOpen = () => {
    setCreateOpen(true);
  };
  const handleCreateClose = () => {
    setCreateOpen(false);
  };

  const handleUpdateClose = () => {
    setUpdateOpen(false);
    setProductToUpdate(null);
  };
  const handleUpdateOpen = useCallback(
    (row: MRT_Row<Product>) => {
      // const id = row.getValue('id');
      // const product = products.find((el) => el.id === id);
      const product = row.original;
      if(product ) {
        setProductToUpdate(product);
        setUpdateOpen(true);
      } else alert("something went wrong")
    },
    [],
  );

  // const handleSaveRowEdits: MaterialReactTableProps<Product>['onEditingRowSave'] =
  //   async ({ exitEditingMode, row, values }) => {
  //     if (!Object.keys(validationErrors).length) {
  //       tableData[row.index] = values;
  //       //send/receive api updates here, then refetch or update local table data for re-render
  //       setTableData([...tableData]);
  //       exitEditingMode(); //required to exit editing mode and close modal
  //     }
  //   };

  // const handleCancelRowEdits = () => {
  //   setValidationErrors({});
  // };

  const handleDeleteOpen = useCallback(
    (row: MRT_Row<Product>) => {
      setIdToDelete(row.getValue('id'));
      setDeleteOpen(true);
    },
    [],
  );
  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };
  const handleRemove = useCallback(async () => {
    if (productActions) {
      await productActions.deleteCurrentProduct(idToDelete);
      handleDeleteClose();
    }
  }, [productActions, idToDelete]);

  const handleExportRows = (rows: MRT_Row<Product>[]) => {
    // the order of the columns are based on the order of objects entries in the array
    csvExporter.generateCsv(rows.map((row) => {
      const { id, itemCode, title, description, image, price, originalPrice, remaining, createdAt, updatedAt } = row.original;
      return { id, itemCode, title, description, imageName: image.name, imageUrl: image.url, price, originalPrice, remaining, createdAt, updatedAt };
    }));
  };
  const handleExportData = useCallback(() => {
    // the order of the columns are based on the order of objects entries in the array
    csvExporter.generateCsv(products.map((product) => {
      const { id, itemCode, title, description, image, price, originalPrice, remaining, createdAt, updatedAt } = product;
      return { id, itemCode, title, description, imageName: image.name, imageUrl: image.url, price, originalPrice, remaining, createdAt, updatedAt };
    }));
  }, [products]);

  return (
    <>
      {loadingData ? (
        <CircularProgressPage />
      ) : (
        <MaterialReactTable
          displayColumnDefOptions={{
            'mrt-row-actions': {
              muiTableHeadCellProps: {
                align: 'center',
              },
              size: 120,
            },
          }}
          muiTableProps={{
            sx: {
              tableLayout: 'fixed',
            },
          }}
          columns={columns}
          data={products}
          editingMode="modal" //default
          enableColumnOrdering
          enableEditing
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <Tooltip arrow placement="left" title="Edit">
                <IconButton onClick={() => handleUpdateOpen(row)}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="right" title="Delete">
                <IconButton color="error" onClick={() => handleDeleteOpen(row)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          renderTopToolbarCustomActions={({ table }) => (
            <Box
              sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
            >
              <Button
                onClick={handleCreateOpen}
                variant="contained"
              >
                Create New Product
              </Button>
              <Button
                color="primary"
                //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                onClick={handleExportData}
                startIcon={<FileDownloadIcon />}
                variant="contained"
              >
                Export All Data
              </Button>
            </Box>
          )}
        />
      )}
      {createOpen && (
        <CreateProductModal
          open={createOpen}
          onClose={handleCreateClose}
        />
      )}
      {productToUpdate && (
        <UpdateProductModal
          open={updateOpen}
          onClose={handleUpdateClose}
          product={productToUpdate}
        />
      )}
      {deleteOpen && (
        <DeleteDialog
          open={deleteOpen}
          isDeleting={isDeleting}
          onCancel={() => handleDeleteClose()}
          handleRemove={handleRemove}
        />
      )}
      {openSnack ? (
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={openSnack}
          autoHideDuration={7000}
          onClose={handleClose}
        >
          {(!createError && !updateError && !deleteError) ? (
            <Alert onClose={handleClose} severity="success">
              Succesful
            </Alert>
          ) : (
            <Alert onClose={handleClose} severity="error">
              {createError || updateError || deleteError}
            </Alert>
          )}
        </Snackbar>
      ) : (<></>)}
    </>
  );
});

export default ProductTable;
