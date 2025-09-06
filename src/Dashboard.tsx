import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import type { GridPaginationModel, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { bookService } from './services/bookService';
import type { Book } from './types/Book';


const Dashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await bookService.getBooks(page, rowsPerPage);
        setBooks(response.rows);
        setCount(response.count);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [page, rowsPerPage]);


  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Título', flex: 1 },
    { field: 'genre', headerName: 'Género', flex: 1 },
    { field: 'publisher', headerName: 'Editorial', flex: 1 },
    { field: 'author', headerName: 'Autor', flex: 1 },
    { field: 'availability', headerName: 'Disponibilidad', flex: 1, type: 'number' },
    {
      field: 'actions',
      headerName: 'Acciones',
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
      <div style={{ padding: '20px' }}>
        <h1>Dashboard</h1>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => navigate('/create-book')}
            style={{ padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Crear Libro
          </button>
          <button
            onClick={async () => {
              try {
                const blob = await bookService.exportToCsv();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'libros.csv';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
              } catch (error) {
                console.error('Error exporting CSV:', error);
                alert('Error al exportar los datos');
              }
            }}
            style={{ padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Exportar CSV
          </button>
        </div>

        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={books}
            columns={columns}
            pageSizeOptions={[rowsPerPage]}
            rowCount={count}
            pagination
            paginationMode="server"
            onPaginationModelChange={(paginationModel: GridPaginationModel) => {
              setPage(paginationModel.page);
              setRowsPerPage(paginationModel.pageSize);
            }}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;
