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
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useVendorActions, useVendorState } from '../context/vendorsContext';
import { Vendor } from '../models/Vendor';
import DeleteDialog from './DeleteDialog';
import CreateVendorModal from './CreateVendorModal';
import UpdateVendorModal from './UpdateVendorModal';
import CircularProgressPage from './CircularProgressPage';
import {
  Alert,
  Snackbar,
} from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv, Options } from 'export-to-csv-fix-source-map';

var NotFoundVendor = require('../static/not-found.png');

const columns: MRT_ColumnDef<Vendor>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      enableColumnOrdering: false,
      enableEditing: false, //disable editing on this column
      enableSorting: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
  ];

const csvOptions: Options = {
  fieldSeparator: ',',
  quoteStrings: '"',
  decimalSeparator: '.',
  showLabels: true,
  showTitle: true,
  filename: 'Vendor Table',
  title: 'Vendors Table',
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: false,
  headers: columns.map((c) => c.header),// <-- Won't work with useKeysAsHeaders present!
};
const csvExporter = new ExportToCsv(csvOptions);

const VendorTable = memo(() => {
  const vendorActions = useVendorActions();
  const { vendors, loadingData, isDeleting, createError, updateError, deleteError, openSnack } = useVendorState();

  const [createOpen, setCreateOpen] = useState(false);
  const [vendorToUpdate, setVendorToUpdate] = useState<Vendor | null>(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string>("");

  const handleClose = useCallback(() => {
    vendorActions.clearErrorsAndCloseSnack();
  }, [vendorActions]);

  const handleCreateOpen = () => {
    setCreateOpen(true);
  };
  const handleCreateClose = () => {
    setCreateOpen(false);
  };

  const handleUpdateClose = () => {
    setUpdateOpen(false);
    setVendorToUpdate(null);
  };
  const handleUpdateOpen = useCallback(
    (row: MRT_Row<Vendor>) => {
      // const id = row.getValue('id');
      // const vendor = vendors.find((el) => el.id === id);
      const vendor = row.original;
      if(vendor ) {
        setVendorToUpdate(vendor);
        setUpdateOpen(true);
      } else alert("something went wrong")
    },
    [],
  );

  const handleDeleteOpen = useCallback(
    (row: MRT_Row<Vendor>) => {
      setIdToDelete(row.getValue('id'));
      setDeleteOpen(true);
    },
    [],
  );
  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };
  const handleRemove = useCallback(async () => {
    if (vendorActions) {
      await vendorActions.deleteCurrentVendor(idToDelete);
      handleDeleteClose();
    }
  }, [vendorActions, idToDelete]);

  const handleExportRows = (rows: MRT_Row<Vendor>[]) => {
    // the order of the columns are based on the order of objects entries in the array
    csvExporter.generateCsv(rows.map((row) => {
      const { id, name } = row.original;
      return { id, name };
    }));
  };
  const handleExportData = useCallback(() => {
    // the order of the columns are based on the order of objects entries in the array
    csvExporter.generateCsv(vendors.map((vendor) => {
      const { id, name } = vendor;
      return { id, name };
    }));
  }, [vendors]);

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
          data={vendors}
          editingMode="modal" //default
          enableColumnOrdering
          enableEditing
          // onEditingRowSave={handleSaveRowEdits}
          // onEditingRowCancel={handleCancelRowEdits}
          // initialState={{ columnVisibility: { vendorUrl: false } }} 
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <Tooltip arrow placement="left" title="Edit">
                <IconButton onClick={() => handleUpdateOpen(row)}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="right" title="Delete">
                <span>
                  <IconButton disabled={!row.original.isDeletable} color="error" onClick={() => handleDeleteOpen(row)}>
                    <Delete />
                  </IconButton>
                </span>
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
                Create New Vendor
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
        <CreateVendorModal
          open={createOpen}
          onClose={handleCreateClose}
        />
      )}
      {vendorToUpdate && (
        <UpdateVendorModal
          open={updateOpen}
          onClose={handleUpdateClose}
          vendor={vendorToUpdate}
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

export default VendorTable;
