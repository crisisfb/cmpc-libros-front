import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { bookService } from "./services/bookService";
import type { Book } from "./types/Book";
import type { FilterItem } from "./types/Filter";
import type { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import BooksTable from "./components/BooksTable";
import Navbar from "./components/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterModel, setFilterModel] = useState<FilterItem[]>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookService.getBooks(page, rowsPerPage, filterModel, sortModel);
      setBooks(response.rows);
      setCount(response.count);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Error al cargar los libros. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filterModel, sortModel]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);



  return (
    <ThemeProvider theme={createTheme()}>
      <Navbar />
      <div style={{ padding: "20px" }}>
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

        <BooksTable
          books={books}
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          loading={loading}
          onPaginationChange={(paginationModel: GridPaginationModel) => {
            setPage(paginationModel.page);
            setRowsPerPage(paginationModel.pageSize);
          }}
          onFilterChange={setFilterModel}
          onSortChange={setSortModel}
        />
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
