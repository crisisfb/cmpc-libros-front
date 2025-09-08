import { useEffect, useState, useRef, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridPaginationModel, GridColDef, GridFilterModel } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { debounce } from '@mui/material/utils';
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { bookService } from "./services/bookService";
import type { Book } from "./types/Book";
import type { FilterItem, TextFilterOperator, NumberFilterOperator } from "./types/Filter";

const Dashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterModel, setFilterModel] = useState<FilterItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilterModelChange = useCallback(
    debounce((model: GridFilterModel) => {
      const newFilters: FilterItem[] = model.items?.map(item => {
        const operator = item.operator as TextFilterOperator | NumberFilterOperator;
        // Para campos vacíos o no vacíos, el valor puede ser null
        if (operator === 'isEmpty' || operator === 'isNotEmpty') {
          return {
            field: item.field,
            operator,
            value: null
          };
        }
        // Para isAnyOf, el valor es un array
        if (operator === 'isAnyOf' && Array.isArray(item.value)) {
          return {
            field: item.field,
            operator,
            value: item.value
          };
        }
        // Para el resto de operadores
        return {
          field: item.field,
          operator,
          value: item.value || ''
        };
      }) || [];
      setFilterModel(newFilters);
    }, 300),
    []
  );

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await bookService.getBooks(page, rowsPerPage, filterModel);
        setBooks(response.rows);
        setCount(response.count);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Error al cargar los libros. Por favor, intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page, rowsPerPage, filterModel]);

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
    <ThemeProvider theme={createTheme()}>
      <div style={{ padding: "20px" }}>
        <h1>Dashboard</h1>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            onClick={() => navigate("/create-book")}
            style={{
              padding: "10px",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Crear Libro
          </button>
          <button
            onClick={async () => {
              try {
                const blob = await bookService.exportToCsv();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "libros.csv";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
              } catch (error) {
                console.error("Error exporting CSV:", error);
                setError("Error al exportar los datos");
              }
            }}
            style={{
              padding: "10px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Exportar CSV
          </button>
          <input
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              
              setLoading(true);
              try {
                await bookService.importCsv(file);
                // Refresh the books list after import
                const response = await bookService.getBooks(page, rowsPerPage);
                setBooks(response.rows);
                setCount(response.count);
                setError(null);
              } catch (error) {
                console.error("Error importing CSV:", error);
                setError("Error al importar el archivo CSV");
              } finally {
                setLoading(false);
                // Reset the file input
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: "10px",
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Importar CSV
          </button>
        </div>

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
            onPaginationModelChange={(paginationModel: GridPaginationModel) => {
              setPage(paginationModel.page);
              setRowsPerPage(paginationModel.pageSize);
            }}
            loading={loading}
            disableRowSelectionOnClick
          />
        </div>
        {error && (
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={() => setError(null)}
          >
            <Alert onClose={() => setError(null)} severity="error">
              {error}
            </Alert>
          </Snackbar>
        )}
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;
