import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookService } from './services/bookService';
import type { Book } from './types/Book';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        if (id) {
          const bookData = await bookService.getBook(parseInt(id));
          setBook(bookData);
        }
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };

    fetchBook();
  }, [id]);

  if (!book) {
    return <div>Cargando...</div>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        variant="contained"
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Volver
      </Button>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {book.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Autor:</strong> {book.author}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Editorial:</strong> {book.publisher}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Género:</strong> {book.genre}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Precio:</strong> ${book.price}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Disponibilidad:</strong> {book.availability} unidades
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BookDetails;
