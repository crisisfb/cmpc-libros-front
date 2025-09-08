import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookService } from "./services/bookService";
import "./App.css";

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

  useEffect(() => {
    const fetchBook = async () => {
      if (isEditMode) {
        try {
          const book = await bookService.getBook(parseInt(id));
          setFormData({
            ...book,
            price: book.price.toString(),
            imageUrl: "",
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "file" && name === "image") {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setFormData({
          ...formData,
          image: files[0],
          imageUrl: "", // Clear URL when file is selected
        });
      }
    } else {
      const parsedValue = name === "availability" ? parseInt(value, 10) : value;
      setFormData({
        ...formData,
        [name]: parsedValue,
        ...(name === "imageUrl" && { imageFile: undefined }), // Clear file when URL is entered
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
        alert("Libro actualizado exitosamente");
      } else {
        await bookService.createBook(bookData);
        alert("Libro creado exitosamente");
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
    <div
      className="create-book"
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333" }}>
        {isEditMode ? "Editar Libro" : "Crear Libro"}
      </h2>
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginBottom: "15px",
          padding: "10px",
          backgroundColor: "#6c757d",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Volver al Dashboard
      </button>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <label
          style={{ display: "flex", flexDirection: "column", color: "#555" }}
        >
          Título:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </label>
        <label
          style={{ display: "flex", flexDirection: "column", color: "#555" }}
        >
          Autor:
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </label>
        <label
          style={{ display: "flex", flexDirection: "column", color: "#555" }}
        >
          Editorial:
          <input
            type="text"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </label>
        <label
          style={{ display: "flex", flexDirection: "column", color: "#555" }}
        >
          Precio:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </label>
        <label
          style={{ display: "flex", flexDirection: "column", color: "#555" }}
        >
          Disponibilidad:
          <input
            type="number"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </label>
        <label
          style={{ display: "flex", flexDirection: "column", color: "#555" }}
        >
          Género:
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </label>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", marginBottom: "10px", color: "#555" }}
          >
            Tipo de imagen:
            <select
              value={imageInputType}
              onChange={(e) => {
                setImageInputType(e.target.value as "url" | "file");
                setFormData({
                  ...formData,
                  imageUrl: "",
                });
              }}
              style={{ marginLeft: "10px", padding: "5px" }}
            >
              <option value="url">URL de imagen</option>
              <option value="file">Subir archivo</option>
            </select>
          </label>

          {imageInputType === "url" ? (
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                color: "#555",
              }}
            >
              URL de la imagen:
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
          ) : (
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                color: "#555",
              }}
            >
              Archivo de imagen:
              <input
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
          )}
        </div>

        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isEditMode ? "Actualizar Libro" : "Crear Libro"}
        </button>
      </form>
    </div>
  );
};

export default CreateBook;
