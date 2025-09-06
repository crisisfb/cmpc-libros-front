import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import CreateBook from './CreateBook';
import BookDetails from './BookDetails';

// Simulación de autenticación
const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

// Componente PrivateRoute
const PrivateRoute = ({ element }: { element: React.ReactElement }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/create-book" element={<PrivateRoute element={<CreateBook />} />} />
        <Route path="/book/:id" element={<PrivateRoute element={<BookDetails />} />} />
      </Routes>
    </Router>
  );
}

export default App;
