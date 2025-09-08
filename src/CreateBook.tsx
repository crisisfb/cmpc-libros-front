import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookService } from "./services/bookService";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  IconButton,
  Grid,
  InputAdornment,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CreateBook = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    price: "",
    availability: 0,
    genre: "",
    imageUrl: "",
    image: undefined as File | undefined,
  });

  const [imageInputType, setImageInputType] = useState<"url" | "file">("url");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error"
  });

  useEffect(() => {
    const fetchBook = async () => {
      if (isEditMode) {
        try {
          const book = await bookService.getBook(parseInt(id));
          setFormData({
            title: book.title || "",
            author: book.author || "",
            publisher: book.publisher || "",
            price: book.price ? book.price.toString() : "",
            availability: book.availability || 0,
            genre: book.genre || "",
            imageUrl: book.imageUrl || "",
            image: undefined,
          });
        } catch (error) {
          console.error("Error fetching book:", error);
          alert("Error al cargar el libro");
          navigate("/dashboard");
        }
      }
    };

    fetchBook();
  }, [id, isEditMode, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    const target = e.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;
    const type = target.type;

    if (type === "file" && name === "image") {
      const files = target.files;
      if (files && files.length > 0) {
        setFormData({
          ...formData,
          image: files[0],
          imageUrl: "", // Clear URL when file is selected
        });
      }
    } else {
      const parsedValue = name === "availability" ? parseInt(value as string, 10) : value;
      setFormData({
        ...formData,
        [name]: parsedValue,
        ...(name === "imageUrl" && { image: undefined }), // Clear file when URL is entered
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (isEditMode) {
        await bookService.updateBook(parseInt(id), bookData);
        setSnackbar({
          open: true,
          message: "Libro actualizado exitosamente",
          severity: "success"
        });
      } else {
        await bookService.createBook(bookData);
        setSnackbar({
          open: true,
          message: "Libro creado exitosamente",
          severity: "success"
        });
        setFormData({
          title: "",
          author: "",
          publisher: "",
          price: "",
          availability: 0,
          genre: "",
          imageUrl: "",
          image: undefined,
        });
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton
            onClick={() => navigate("/dashboard")}
            sx={{ mr: 2 }}
            aria-label="volver"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1">
            {isEditMode ? "Editar Libro" : "Crear Libro"}
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Título"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Autor"
                name="author"
                value={formData.author}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Editorial"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Precio"
                name="price"
                value={formData.price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Disponibilidad"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Género"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="image-type-label">Tipo de imagen</InputLabel>
                <Select
                  labelId="image-type-label"
                  value={imageInputType}
                  label="Tipo de imagen"
                  onChange={(e) => {
                    setImageInputType(e.target.value as "url" | "file");
                    setFormData({
                      ...formData,
                      imageUrl: "",
                      image: undefined,
                    });
                  }}
                >
                  <MenuItem value="url">URL de imagen</MenuItem>
                  <MenuItem value="file">Subir archivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              {imageInputType === "url" ? (
                <TextField
                  fullWidth
                  label="URL de la imagen"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              ) : (
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ height: "56px" }}
                >
                  {formData.image ? formData.image.name : "Seleccionar archivo"}
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                    hidden
                  />
                </Button>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
              >
                {isEditMode ? "Actualizar Libro" : "Crear Libro"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateBook;
