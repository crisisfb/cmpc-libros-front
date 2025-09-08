import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookService } from "./services/bookService";
import type { Book } from "./types/Book";
import { 
  Card, 
  CardContent, 
  CardMedia,
  Typography, 
  Button, 
  Box,
  Paper,
  Skeleton
} from "@mui/material";

const BookDetails: React.FC = () => {
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
        console.error("Error fetching book:", error);
      }
    };

    fetchBook();
  }, [id]);

  if (!book) {
    return (
      <Box sx={{ p: 3 }}>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          Volver
        </Button>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: { xs: '1', md: '0 0 33.333%' } }}>
            <Skeleton variant="rectangular" height={400} />
          </Box>
          <Box sx={{ flex: { xs: '1', md: '0 0 66.666%' } }}>
            <Card>
              <CardContent>
                <Skeleton variant="text" height={60} />
                <Skeleton variant="text" height={30} />
                <Skeleton variant="text" height={30} />
                <Skeleton variant="text" height={30} />
                <Skeleton variant="text" height={30} />
                <Skeleton variant="text" height={30} />
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    );
  }

  const formattedPrice = typeof book.price === 'string' 
    ? parseFloat(book.price).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
    : book.price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

  return (
    <Box sx={{ p: 3 }}>
      <Button variant="contained" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Volver
      </Button>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: { xs: '1', md: '0 0 33.333%' } }}>
          <Paper elevation={3}>
            {book.imageUrl ? (
              <CardMedia
                component="img"
                image={book.imageUrl}
                alt={book.title}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  borderRadius: 1
                }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#f5f5f5',
                  borderRadius: 1
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  No hay imagen disponible
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
        <Box sx={{ flex: { xs: '1', md: '0 0 66.666%' } }}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {book.title}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                por {book.author}
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Typography variant="body1" paragraph>
                  <strong>Editorial:</strong> {book.publisher}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Género:</strong> {book.genre}
                </Typography>
                <Typography variant="h5" color="primary" paragraph>
                  <strong>Precio:</strong> {formattedPrice}
                </Typography>
                <Typography 
                  variant="body1" 
                  paragraph
                  color={book.availability > 0 ? 'success.main' : 'error.main'}
                >
                  <strong>Disponibilidad:</strong> {
                    book.availability > 0 
                      ? `${book.availability} unidades disponibles`
                      : 'Agotado'
                  }
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default BookDetails;
