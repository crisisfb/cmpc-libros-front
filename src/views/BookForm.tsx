import { useState, useEffect } from 'react';
import { 
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { PhotoCamera, ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { bookService } from '../services/bookService';
import type { CreateBookDTO } from '../types/Book';

const INITIAL_FORM_STATE: CreateBookDTO = {
  title: '',
  author: '',
  publisher: '',
  price: 0,
  availability: 0,
  genre: '',
  imageUrl: '',
};

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateBookDTO>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const book = await bookService.getBook(parseInt(id));
        setFormData({
          title: book.title,
          author: book.author,
          publisher: book.publisher,
          price: book.price as number,
          availability: book.availability,
          genre: book.genre,
          imageUrl: book.imageUrl,
        });
        if (book.imageUrl) {
          setImagePreview(book.imageUrl);
        }
      } catch (err) {
        setError('Error al cargar el libro');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData(prev => ({
      ...prev,
      image: file,
      imageUrl: undefined, // Clear the imageUrl when a new image is selected
    }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id) {
        await bookService.updateBook(parseInt(id), formData);
      } else {
        await bookService.createBook(formData);
      }
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError('Error al guardar el libro');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.title) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Volver
        </Button>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            {id ? 'Editar Libro' : 'Crear Nuevo Libro'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Libro {id ? 'actualizado' : 'creado'} exitosamente
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                required
                fullWidth
                label="Título"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />

              <Box sx={{ display: 'flex', gap: 3 }}>
                <TextField
                  required
                  fullWidth
                  label="Autor"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                />

                <TextField
                  required
                  fullWidth
                  label="Editorial"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 3 }}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Precio"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />

                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Disponibilidad"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                />
              </Box>

              <TextField
                required
                fullWidth
                label="Género"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
              />

              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                >
                  Subir Imagen
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>

                {imagePreview && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : id ? (
                  'Actualizar Libro'
                ) : (
                  'Crear Libro'
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default BookForm;
