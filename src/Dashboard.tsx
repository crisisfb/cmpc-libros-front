import { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import axiosInstance from './services/axiosInstance';

const Dashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:3000/books?page=${page + 1}&limit=${rowsPerPage}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        setBooks(response.data.rows); // Ajustar para usar la clave correcta 'rows'
        setCount(response.data.count);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [page, rowsPerPage]);

  const columns = [
    { name: 'title', label: 'Título' },
    { name: 'author', label: 'Autor' },
    { name: 'publisher', label: 'Editorial' },
    { name: 'price', label: 'Precio' },
    { name: 'availability', label: 'Disponibilidad' },
    { name: 'genre', label: 'Género' },
  ];

  const options = {
    filter: true,
    filterType: 'dropdown',
    responsive: 'standard',
    serverSide: true,
    count: count,
    page: page,
    rowsPerPage: rowsPerPage,
    onTableChange: (action: string, tableState: { page: number; rowsPerPage: number }) => {
      if (action === 'changePage') {
        setPage(tableState.page);
      } else if (action === 'changeRowsPerPage') {
        setRowsPerPage(tableState.rowsPerPage);
      }
    },
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <div style={{ padding: '20px' }}>
        <h1>Dashboard</h1>
        <button
          onClick={() => navigate('/create-book')}
          style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Crear Libro
        </button>
        <MUIDataTable
          title={'Lista de Libros'}
          data={books}
          columns={columns}
          options={options}
        />
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;
