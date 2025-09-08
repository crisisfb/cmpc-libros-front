import { useState, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridPaginationModel, GridColDef, GridFilterModel } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { debounce } from '@mui/material/utils';
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import type { Book } from "../types/Book";
import type { FilterItem, TextFilterOperator, NumberFilterOperator } from "../types/Filter";

interface BooksTableProps {
  books: Book[];
  count: number;
  page: number;
  rowsPerPage: number;
  loading: boolean;
  onPaginationChange: (model: GridPaginationModel) => void;
  onFilterChange: (filters: FilterItem[]) => void;
}

const BooksTable = ({
  books,
  count,
  page,
  rowsPerPage,
  loading,
  onPaginationChange,
  onFilterChange,
}: BooksTableProps) => {
  const navigate = useNavigate();

  const handleFilterModelChange = useCallback(
    debounce((model: GridFilterModel) => {
      const newFilters: FilterItem[] = model.items?.map(item => {
        const operator = item.operator as TextFilterOperator | NumberFilterOperator;
        if (operator === 'isEmpty' || operator === 'isNotEmpty') {
          return {
            field: item.field,
            operator,
            value: null
          };
        }
        if (operator === 'isAnyOf' && Array.isArray(item.value)) {
          return {
            field: item.field,
            operator,
            value: item.value
          };
        }
        return {
          field: item.field,
          operator,
          value: item.value || ''
        };
      }) || [];
      onFilterChange(newFilters);
    }, 300),
    [onFilterChange]
  );

  const columns: GridColDef[] = [
    { field: "title", headerName: "Título", flex: 1, filterable: true },
    { field: "genre", headerName: "Género", flex: 1, filterable: true },
    { field: "publisher", headerName: "Editorial", flex: 1, filterable: true },
    { field: "author", headerName: "Autor", flex: 1, filterable: true },
    {
      field: "price",
      type: "number",
      headerName: "Precio",
      flex: 1,
      filterable: true,
    },
    {
      field: "availability",
      headerName: "Disponibilidad",
      flex: 1,
      type: "number",
      filterable: true,
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 120,
      sortable: false,  
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            onClick={() => navigate(`/book/${params.row.id}`)}
            color="primary"
            size="small"
            title="Ver detalles"
          >
            <SearchIcon />
          </IconButton>
          <IconButton
            onClick={() => navigate(`/edit-book/${params.row.id}`)}
            color="primary"
            size="small"
            title="Editar libro"
          >
            <EditIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={books}
        columns={columns}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={{ page, pageSize: rowsPerPage }}
        rowCount={count}
        pagination
        paginationMode="server"
        filterMode="server"
        onFilterModelChange={handleFilterModelChange}
        onPaginationModelChange={onPaginationChange}
        loading={loading}
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default BooksTable;
