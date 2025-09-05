import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <button
        onClick={() => navigate('/create-book')}
        style={{ padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Crear Libro
      </button>
    </div>
  );
};

export default Dashboard;
