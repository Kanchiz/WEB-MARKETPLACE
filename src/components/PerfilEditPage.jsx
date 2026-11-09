import { useState } from 'react';

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
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '32px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#1d61e7', fontWeight: '600', cursor: 'pointer', marginBottom: '16px' }}>
          ← Volver al marketplace
        </button>

        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Editar Perfil y Contacto</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Actualiza tus datos personales y sincroniza tu información de contacto.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>Correo electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>Teléfono de contacto</label>
            <input
              type="text"
              placeholder="Ej. 6671234567"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>Ubicación predeterminada</label>
            <input
              type="text"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#1d61e7', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' }}>
            {loading ? 'Guardando y sincronizando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}