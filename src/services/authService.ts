export const loginService = async (email: string, password: string) => {
  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.access_token); // Guardar el token en localStorage
    return data;
  } catch {
    throw new Error('Invalid email or password');
  }
};
