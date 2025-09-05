import axios from 'axios';

export const loginService = async (email: string, password: string) => {
  try {
    const response = await axios.post('http://localhost:3000/auth/login', {
      email,
      password,
    });

    localStorage.setItem('access_token', response.data.access_token); // Guardar el token en localStorage
    if (response.data.refresh_token) {
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    return response.data;
  } catch {
    throw new Error('Invalid email or password');
  }
};
