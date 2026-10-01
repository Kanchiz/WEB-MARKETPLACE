import React, { useState, useEffect } from 'react';

// --- COMPONENTE DE BÚSQUEDA DE ARTÍCULOS EN VENTA ---
function ArticulosSearchPage({ onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const user = JSON.parse(localStorage.getItem('user')) || { nombre: 'Usuario Mercado' };

  // Datos de ejemplo para la lista de artículos en venta
  const articulosEjemplo = [
    { id: 1, titulo: 'Bicicleta de Montaña 29"', precio: '250 €', categoria: 'Deportes' },
    { id: 2, titulo: 'Silla Ergonómica de Oficina', precio: '85 €', categoria: 'Hogar' },
    { id: 3, titulo: 'Laptop Gamer 16GB RAM', precio: '750 €', categoria: 'Electrónica' },
    { id: 4, titulo: 'Mesa de Centro en Madera', precio: '110 €', categoria: 'Hogar' },
    { id: 5, titulo: 'Audífonos Inalámbricos Bluetooth', precio: '45 €', categoria: 'Electrónica' },
    { id: 6, titulo: 'Consola de Videojuegos', precio: '320 €', categoria: 'Juegos' }
  ];

  const articulosFiltrados = articulosEjemplo.filter(art =>
    art.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.categoria.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      {/* Barra Superior Header */}
      <header style={{ backgroundColor: '#1d61e7', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d61e7" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
          </div>
          <span style={{ fontSize: '20px', fontWeight: '800' }}>equipo-6</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px' }}>Hola, <strong>{user.nombre || user.correo || 'Usuario'}</strong></span>
          <button
            onClick={onLogout}
            style={{ backgroundColor: '#ffffff22', color: '#fff', border: '1px solid #ffffff55', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Panel de Búsqueda y Resultados */}
      <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', color: '#0f172a', marginBottom: '8px' }}>Buscar artículos en venta</h1>
          <p style={{ color: '#64748b' }}>Explora miles de productos disponibles cerca de ti</p>
        </div>

        {/* Campo de Búsqueda */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <input
            type="text"
            placeholder="¿Qué estás buscando hoy? (ej. bicicleta, laptop, mesa...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: '14px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none' }}
          />
        </div>

        {/* Cuadrícula de Artículos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {articulosFiltrados.length > 0 ? (
            articulosFiltrados.map((item) => (
              <div key={item.id} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ width: '100%', height: '120px', backgroundColor: '#e2e8f0', borderRadius: '8px', marginBottom: '12px' }}></div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#1d61e7', textTransform: 'uppercase' }}>{item.categoria}</span>
                <h3 style={{ fontSize: '16px', color: '#1e293b', margin: '4px 0 8px 0' }}>{item.titulo}</h3>
                <p style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{item.precio}</p>
              </div>
            ))
          ) : (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8' }}>No se encontraron artículos que coincidan con tu búsqueda.</p>
          )}
        </div>
      </main>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL APP ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados Formulario Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Estados Formulario Registro
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Base URL de tu API backend
  const API_URL = 'http://localhost:8000/api/v1/auth';

  // 1. Verificar si ya existe un token en localStorage al cargar la página
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setIsAuthenticated(true);
    }
  }, []);

  // 2. Conexión API: Inicio de Sesión
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: loginEmail,       // Corregido: 'email' en lugar de 'correo'
          password: loginPassword  // Corregido: 'password' en lugar de 'contrasena'
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsAuthenticated(true);
      } else {
        alert(data.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('No se pudo conectar con el servidor backend en http://localhost:8000');
    } finally {
      setLoading(false);
    }
  };

  // 3. Conexión API: Registro de Usuario
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: regName,           
          email: regEmail,         
          phone: regPhone,         
          password: regPassword,   
          role: 'buyer'            
        })
      });

      const data = await response.json();

      if (response.status === 201) {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        setCurrentView('login');
      } else if (response.status === 409) {
        alert(data.message || 'El correo electrónico ya se encuentra registrado.');
      } else if (response.status === 422) {
        const errorMsg = data.errors ? Object.values(data.errors).flat().join('\n') : data.message;
        alert(errorMsg);
      } else {
        alert(data.message || 'Ocurrió un error durante el registro');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('No se pudo establecer conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Conexión API: Autenticación con Google
  const handleGoogleAuth = async () => {
    try {
      // Petición al endpoint de Google Auth de tu backend
      const response = await fetch(`${API_URL}/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsAuthenticated(true);
      } else {
        alert(data.message || 'Error en la autenticación con Google.');
      }
    } catch (error) {
      console.error('Error al conectar con la API de Google:', error);
      alert('Error de conexión al intentar autenticar con Google.');
    }
  };

  // Cierre de Sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  // Si está autenticado, renderiza la vista del Dashboard
  if (isAuthenticated) {
    return <ArticulosSearchPage onLogout={handleLogout} />;
  }

  return (
    <div style={styles.container}>
      {/* Panel Izquierdo Azul (Branding) */}
      <div style={styles.leftPanel}>
        <div style={styles.brandHeader}>
          <div style={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d61e7" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span style={styles.brandName}>equipo-6</span>
        </div>

        <div style={styles.heroContent}>
          <span style={styles.heroSub}>TU MARKETPLACE DE CONFIANZA</span>
          <h1 style={styles.heroTitle}>Encuentra eso que estabas buscando.</h1>
          <p style={styles.heroDesc}>
            Compra y vende cerca de ti. Miles de artículos nuevos te esperan cada día.
          </p>
        </div>

        <div style={styles.footerSocial}>
          <span style={styles.socialText}>Más de 50.000 personas compran y venden aquí</span>
        </div>
      </div>

      {/* Panel Derecho Blanco (Formularios) */}
      <div style={styles.rightPanel}>
        <div style={styles.topNav}>
          {currentView === 'login' ? (
            <p style={styles.topNavText}>
              ¿Aún no tienes cuenta?{' '}
              <button onClick={() => setCurrentView('register')} style={styles.linkBtnInline}>
                Regístrate
              </button>
            </p>
          ) : (
            <p style={styles.topNavText}>
              ¿Ya tienes una cuenta?{' '}
              <button onClick={() => setCurrentView('login')} style={styles.linkBtnInline}>
                Inicia sesión
              </button>
            </p>
          )}
        </div>

        <div style={styles.formContainer}>
          {currentView === 'login' ? (
            <>
              <span style={styles.welcomeTag}>Te damos la bienvenida</span>
              <h2 style={styles.formTitle}>Inicia sesión</h2>
              <p style={styles.formSubtitle}>Accede a tus favoritos, mensajes y publicaciones.</p>

              <form onSubmit={handleLoginSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Correo electrónico</label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    style={styles.inputNoIcon}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Contraseña</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    style={styles.inputNoIcon}
                  />
                </div>

                <button type="submit" disabled={loading} style={styles.primaryBtn}>
                  {loading ? 'Cargando...' : 'Iniciar sesión'}
                </button>
              </form>
            </>
          ) : (
            <>
              <span style={styles.welcomeTag}>Únete a nuestra comunidad</span>
              <h2 style={styles.formTitle}>Crea tu cuenta</h2>

              <form onSubmit={handleRegisterSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Nombre completo</label>
                  <input
                    type="text"
                    placeholder="Ej. Juan Pérez"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    style={styles.inputNoIcon}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Correo electrónico</label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    style={styles.inputNoIcon}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Teléfono</label>
                  <input
                    type="tel"
                    placeholder="+52 123 456 7890"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    required
                    style={styles.inputNoIcon}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Contraseña</label>
                  <input
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    style={styles.inputNoIcon}
                  />
                </div>

                <button type="submit" disabled={loading} style={styles.primaryBtn}>
                  {loading ? 'Registrando...' : 'Registrarse'}
                </button>
              </form>
            </>
          )}

          {/* Separador e Inicio de sesión con Google */}
          <div style={styles.dividerContainer}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>O CONTINÚA CON</span>
            <div style={styles.dividerLine}></div>
          </div>

          <button style={styles.googleBtn} onClick={handleGoogleAuth}>
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '10px' }}>
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.28v3.15C3.25 21.3 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.28C.46 8.21 0 10.05 0 12s.46 3.79 1.28 5.42l4-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.58l4 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            Continuar con Google
          </button>
        </div>
      </div>
    </div>
  );
}

// Estilos
const styles = {
  container: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  leftPanel: { flex: '1', backgroundColor: '#1d61e7', color: '#fff', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  brandHeader: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: { width: '36px', height: '36px', backgroundColor: '#fff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: '22px', fontWeight: '800' },
  heroContent: { maxWidth: '480px', margin: '40px 0' },
  heroSub: { fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', opacity: '0.9', display: 'block', marginBottom: '12px' },
  heroTitle: { fontSize: '40px', fontWeight: '800', lineHeight: '1.15', marginBottom: '16px' },
  heroDesc: { fontSize: '16px', opacity: '0.9' },
  footerSocial: { display: 'flex', alignItems: 'center' },
  socialText: { fontSize: '13px', opacity: '0.95' },
  rightPanel: { flex: '1', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', padding: '40px' },
  topNav: { display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' },
  topNavText: { fontSize: '14px', color: '#64748b' },
  linkBtnInline: { background: 'none', border: 'none', color: '#1d61e7', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
  formContainer: { maxWidth: '400px', width: '100%', margin: 'auto' },
  welcomeTag: { fontSize: '13px', color: '#1d61e7', fontWeight: '600', display: 'block', marginBottom: '6px' },
  formTitle: { fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' },
  formSubtitle: { fontSize: '14px', color: '#64748b', margin: '0 0 28px 0' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#334155' },
  inputNoIcon: { width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  primaryBtn: { backgroundColor: '#1d61e7', color: '#fff', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  dividerContainer: { display: 'flex', alignItems: 'center', margin: '20px 0 16px 0', gap: '12px' },
  dividerLine: { flex: '1', height: '1px', backgroundColor: '#e2e8f0' },
  dividerText: { fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.5px' },
  googleBtn: { width: '100%', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '600', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }
};