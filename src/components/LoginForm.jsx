import React, { useState } from 'react';

const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // Laravel espera 'email' y 'password'
        body: JSON.stringify({
          email: formData.correo,
          password: formData.contrasena,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Credenciales incorrectas.');
        setLoading(false);
        return;
      }

      // Guardar el token en localStorage (soporta distintos formatos de respuesta de AuthController)
      const token = data.token || data.access_token || data.data?.token;
      if (token) {
        localStorage.setItem('token', token);
      }

      // Guardar los datos del usuario en localStorage
      const user = data.user || data.data?.user || { email: formData.correo, name: formData.correo.split('@')[0] };
      localStorage.setItem('user', JSON.stringify(user));

      // Notificar al componente padre (AuthPage / App) si recibe callback, o recargar
      if (onLoginSuccess) {
        onLoginSuccess(user, token);
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('No se pudo conectar con el servidor de la API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Iniciar Sesión</h2>

      {error && (
        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '4px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLoginSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Correo:</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
          <input
            type="password"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            background: loading ? '#86efac' : '#16a34a',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Ingresando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;