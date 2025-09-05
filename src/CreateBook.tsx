import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './services/axiosInstance';
import './App.css';

const CreateBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    price: '',
    availability: 0, // Cambiado a valor numérico
    genre: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target; // Eliminado el uso innecesario de `type`
    const parsedValue = name === 'availability' ? parseInt(value, 10) : value;
    setFormData({
      ...formData,
      [name]: parsedValue,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('http://localhost:3000/books', {
        ...formData,
        price: parseFloat(formData.price),
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.status === 200) {
        alert('Libro creado exitosamente');
        setFormData({
          title: '',
          author: '',
          publisher: '',
          price: '',
          availability: 0, // Reiniciar a valor numérico
          genre: '',
        });
      } else {
        alert('Error al crear el libro');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <div className="create-book" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Crear Libro</h2>
      <button
        onClick={() => navigate('/dashboard')}
        style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Volver al Dashboard
      </button>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label style={{ display: 'flex', flexDirection: 'column', color: '#555' }}>
          Título:
          <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', color: '#555' }}>
          Autor:
          <input type="text" name="author" value={formData.author} onChange={handleChange} required style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', color: '#555' }}>
          Editorial:
          <input type="text" name="publisher" value={formData.publisher} onChange={handleChange} required style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', color: '#555' }}>
          Precio:
          <input type="number" name="price" value={formData.price} onChange={handleChange} required style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', color: '#555' }}>
          Disponibilidad:   
          <input
            type="number"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            required
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', color: '#555' }}>
          Género:
          <input type="text" name="genre" value={formData.genre} onChange={handleChange} required style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </label>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Crear Libro
        </button>
      </form>
    </div>
  );
};

export default CreateBook;
