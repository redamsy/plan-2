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
  Typography,
  Alert,
  Snackbar,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import { useProductActions, useProductState } from '../context/productsContext';
import { DetailedProduct, Gallery } from '../models/Product';
import DeleteDialog from './DeleteDialog';
import CreateProductModal from './CreateProductModal';
import UpdateProductModal from './UpdateProductModal';
import CircularProgressPage from './CircularProgressPage';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { extractImageSrcFromUrlAsThumbnail } from '../utils';
import { ExportToCsv, Options } from 'export-to-csv-fix-source-map';

var NotFoundImage = require('../static/not-found.png');

const GalleryGrid = memo(({description, galleries}: {description: string; galleries: Gallery[]}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        maxWidth: '60%'
      }}
    >
      <ImageList sx={{ width: 500, height: 450 }}>
        <ImageListItem key="Subheader" cols={2}>
          <ListSubheader component="div">Gallery</ListSubheader>
        </ImageListItem>
        {galleries.map((gallery) => (
          <ImageListItem key={gallery.id}>
            <img
              src={extractImageSrcFromUrlAsThumbnail(gallery.image.url) || NotFoundImage}
              alt={gallery.image.name}
              loading="lazy"
            />
            <ImageListItemBar
              title={`Code: ${gallery.itemSubCode}`}
              subtitle={
                <>
                  <div>{`Price: ${gallery.subPrice}`}</div>
                  <div>{`Original Price: ${gallery.subOriginalPrice}`}</div>
                  <div>{`Size: ${gallery.size.name}`}</div>
                  <div>{`Color: ${gallery.color.name}`}</div>
                </>
              }
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  aria-label={`info about ${gallery.itemSubCode}`}
                >
                  <InfoIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
      <Box sx={{ width: '70%',textAlign: 'center', wordBreak: 'break-word', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
        <Typography variant="h6">&quot;Description&quot;</Typography>
        <Typography variant='body1'>
          {description}
        </Typography>
      </Box>
    </Box>
  );

});

const columns: MRT_ColumnDef<DetailedProduct>[] = [
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
      accessorFn: (row) => `${row.vendor.name}`,
      accessorKey: 'vendor',
      header: 'Vendor',
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
      accessorKey: 'pSCCs',
      header: 'Category and SubCategories',
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <ul>
          {row.original.pSCCs.map((el) => (//isObjectEmpty(el.subCategory)
            <li key={el.id} >{el.category.name} : {el.subCategory.name}</li>
          ))}
          </ul>
        </Box>
      ),
    },
    {
      accessorKey: 'galleries',
      header: 'Gallery(image, size, color)',
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          {row.original.galleries.length > 0 ? (
            <ul>
            {row.original.galleries.map((el) => (//isObjectEmpty(el.color)
              <li key={el.id} >{el.itemSubCode} : {el.subPrice} : {el.subOriginalPrice} : {el.size.name} : {el.color.name} : {el.image.name} : {el.image.url}</li>
            ))}
            </ul>
          ) : <></>}
        </Box>
      ),
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
  const { detailedProducts, loadingData, isDeleting, createError, updateError, deleteError, openSnack } = useProductState();

  const [createOpen, setCreateOpen] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState<DetailedProduct | null>(null);
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
    (row: MRT_Row<DetailedProduct>) => {
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

  // const handleSaveRowEdits: MaterialReactTableProps<DetailedProduct>['onEditingRowSave'] =
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
    (row: MRT_Row<DetailedProduct>) => {
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

  const handleExportRows = (rows: MRT_Row<DetailedProduct>[]) => {
    // the order of the columns are based on the order of objects entries in the array
    csvExporter.generateCsv(rows.map((row) => {
      const { id, itemCode, title, description, vendor, image, price, originalPrice, remaining, createdAt, updatedAt } = row.original;
      return { id, itemCode, title, description, vendorName: vendor.name, imageName: image.name, imageUrl: image.url, price, originalPrice, remaining, createdAt, updatedAt };
    }));
  };
  const handleExportData = useCallback(() => {
    // the order of the columns are based on the order of objects entries in the array
    csvExporter.generateCsv(detailedProducts.map((detailedProduct) => {
      const { id, itemCode, title, description, vendor, image, price, originalPrice, remaining, createdAt, updatedAt } = detailedProduct;
      return { id, itemCode, title, description, vendorName: vendor.name, imageName: image.name, imageUrl: image.url, price, originalPrice, remaining, createdAt, updatedAt };
    }));
  }, [detailedProducts]);

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
          data={detailedProducts}
          editingMode="modal" //default
          enableColumnOrdering
          enableRowSelection
          enableEditing
          // onEditingRowSave={handleSaveRowEdits}
          // onEditingRowCancel={handleCancelRowEdits}
          // initialState={{ columnVisibility: { imageUrl: false } }} 
          renderDetailPanel={({ row }) => (
            <GalleryGrid description={row.original.description} galleries={row.original.galleries}/>
          )}
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
              <Button
                disabled={table.getPrePaginationRowModel().rows.length === 0}
                //export all rows, including from the next page, (still respects filtering and sorting)
                onClick={() =>
                  handleExportRows(table.getPrePaginationRowModel().rows)
                }
                startIcon={<FileDownloadIcon />}
                variant="contained"
              >
                Export All Rows
              </Button>
              <Button
                disabled={table.getRowModel().rows.length === 0}
                //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                onClick={() => handleExportRows(table.getRowModel().rows)}
                startIcon={<FileDownloadIcon />}
                variant="contained"
              >
                Export Page Rows
              </Button>
              <Button
                disabled={
                  !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                }
                //only export selected rows
                onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                startIcon={<FileDownloadIcon />}
                variant="contained"
              >
                Export Selected Rows
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
