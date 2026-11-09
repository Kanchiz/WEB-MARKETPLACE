import { useState } from 'react';
import './PerfilEditPage.css';

export default function PerfilEditPage({ onBack, onUpdateUser }) {
  const storedUser = JSON.parse(localStorage.getItem('user')) || { nombre: '', correo: '', telefono: '', ubicacion: '' };

  const [nombre, setNombre] = useState(storedUser.nombre || storedUser.name || '');
  const [correo, setCorreo] = useState(storedUser.correo || storedUser.email || '');
  const [telefono, setTelefono] = useState(storedUser.telefono || '');
  const [ubicacion, setUbicacion] = useState(storedUser.ubicacion || 'Culiacán, Sinaloa');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedUser = { ...storedUser, nombre, correo, telefono, ubicacion };

    // Simulación de guardado y sincronización de datos
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setLoading(false);
      alert('¡Perfil actualizado y sincronizado con éxito!');
      if (onUpdateUser) onUpdateUser(updatedUser);
      onBack();
    }, 600);
  };

  return (
    <div className="perfil-page-wrapper">
      <div className="perfil-container">
        <button className="perfil-btn-back" onClick={onBack}>← Volver al marketplace</button>

        <h1 className="perfil-title">Editar Perfil y Contacto</h1>
        <p className="perfil-subtitle">Actualiza tus datos personales y sincroniza tu información de contacto.</p>

        <form onSubmit={handleSubmit} className="perfil-form">
          <div>
            <label className="perfil-label">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="perfil-input"
            />
          </div>

          <div>
            <label className="perfil-label">Correo electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              className="perfil-input"
            />
          </div>

          <div>
            <label className="perfil-label">Teléfono de contacto</label>
            <input
              type="text"
              placeholder="Ej. 6671234567"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="perfil-input"
            />
          </div>

          <div>
            <label className="perfil-label">Ubicación predeterminada</label>
            <input
              type="text"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              className="perfil-input"
            />
          </div>

          <button type="submit" disabled={loading} className="perfil-btn-submit">
            {loading ? 'Guardando y sincronizando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}
