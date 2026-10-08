import { useState, useEffect } from 'react';

//GEOLOCALIZACIÓN
function ArticulosSearchPage({ onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [userLocationText, setUserLocationText] = useState('Obteniendo ubicación...');
  const [locationError, setLocationError] = useState('');
  const user = JSON.parse(localStorage.getItem('user')) || { nombre: 'Usuario Mercado' };

  // Obtener geolocalización y nombre de la ciudad al montar la página
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Tu navegador no soporta geolocalización');
      setUserLocationText('No disponible');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          // Petición de Geocodificación Inversa gratuita a OpenStreetMap (Nominatim)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'MarketplaceEquipo6/1.0'
              }
            }
          );
          const data = await response.json();
          const address = data.address || {};
          
          // Extraer la ciudad, pueblo o municipio de forma segura
          const ciudad = address.city || address.town || address.village || address.municipality || 'Ubicación detectada';
          const estado = address.state || '';
          
          setUserLocationText(`${ciudad}, ${estado}`);
        } catch (error) {
          console.error('Error al obtener el nombre de la ciudad:', error);
          // Respaldo en caso de error de red: muestra las coordenadas
          setUserLocationText(`Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`);
        }
      },
      (error) => {
        console.error('Error al obtener ubicación:', error);
        setLocationError('No se pudo obtener tu ubicación actual.');
        setUserLocationText('No se pudo obtener tu ubicación actual.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const articulosEjemplo = [
    { id: 1, titulo: 'Bicicleta de Montaña 29"', precio: '250 MX', categoria: 'Deportes' },
    { id: 2, titulo: 'Silla Ergonómica de Oficina', precio: '85 MX', categoria: 'Muebles' },
    { id: 3, titulo: 'Laptop Gamer 16GB RAM', precio: '750 MX', categoria: 'Electrónica' },
    { id: 4, titulo: 'Mesa de Centro en Madera', precio: '110 MX', categoria: 'Muebles' },
    { id: 5, titulo: 'Audífonos Inalámbricos Bluetooth', precio: '45 MX', categoria: 'Electrónica' },
    { id: 6, titulo: 'Consola de Videojuegos', precio: '320 MX', categoria: 'Juegos' }
  ];

  const articulosFiltrados = articulosEjemplo.filter(art => {
    const matchesSearch = art.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.categoria.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || 
                            art.categoria.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categorias = [
    { id: 'todos', name: 'Explorar todo', icon: '🔍' },
    { id: 'electronica', name: 'Electrónica', icon: '💻' },
    { id: 'muebles', name: 'Muebles', icon: '🛋️' },
    { id: 'deportes', name: 'Deportes', icon: '⚽' },
    { id: 'juegos', name: 'Juegos', icon: '🎮' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
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
          <span style={{ fontSize: '14px' }}>Hola, <strong>{user.nombre || user.name || user.correo || 'Usuario'}</strong></span>
          <button
            onClick={onLogout}
            style={{ backgroundColor: '#ffffff22', color: '#fff', border: '1px solid #ffffff55', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)' }}>
        <aside style={{ width: '280px', backgroundColor: '#fff', borderRight: '1px solid #e2e8f0', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>Marketplace</h2>
            
            {/* Widget de Geolocalización optimizado con Ciudad */}
            <div style={{ backgroundColor: '#eff6ff', padding: '10px 12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', color: '#1e3a8a' }}>
              <div style={{ fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                📍 Tu ubicación
              </div>
              <div style={{ color: locationError ? '#dc2626' : '#1e3a8a', fontWeight: '500' }}>
                {userLocationText}
              </div>
            </div>

            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Categorías</span>
            {categorias.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                    color: isSelected ? '#1d61e7' : '#334155',
                    fontWeight: isSelected ? '700' : '500',
                    fontSize: '14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{cat.icon}</span>
                  {cat.name}
                </button>
              );
            })}
          </div>
        </aside>

        <main style={{ flex: 1, padding: '32px 40px' }}>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '24px', color: '#0f172a', margin: '0 0 4px 0' }}>
                {categorias.find(c => c.id === selectedCategory)?.name || 'Artículos'}
              </h1>
              <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
                Se encontraron {articulosFiltrados.length} resultados cerca de ti
              </p>
            </div>
          </div>

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
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', marginTop: '40px' }}>
                No se encontraron artículos disponibles en esta categoría o búsqueda.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// PRINCIPAL APP
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('token'));
  });

  const [currentView, setCurrentView] = useState('login'); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Formulario Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Formulario Registro
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirmation, setRegPasswordConfirmation] = useState('');
  const [regCoords, setRegCoords] = useState(null);
  const [locationStatus, setLocationStatus] = useState('');

  //Recuperación con Token
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [stepForgot, setStepForgot] = useState(1);

  const API_URL = 'http://127.0.0.1:8000/api';

  const isValidGmail = (email) => {
    return email.trim().toLowerCase().endsWith('@gmail.com');
  };

  const isValidPasswordLength = (pass) => {
    return pass.length >= 8 && pass.length <= 16;
  };

  // Función mejorada para capturar la ubicación y traducirla a ciudad en el registro
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }
    setLocationStatus('Obteniendo ubicación y ciudad...');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
            {
              headers: { 'User-Agent': 'MarketplaceEquipo6/1.0' }
            }
          );
          const data = await response.json();
          const address = data.address || {};
          const ciudad = address.city || address.town || address.village || address.municipality || 'Ubicación detectada';

          setRegCoords({
            latitude: lat,
            longitude: lng,
            ciudad: ciudad
          });
          setLocationStatus(`¡Ubicación detectada: ${ciudad}!`);
        } catch (error) {
          console.error(error);
          setRegCoords({ latitude: lat, longitude: lng, ciudad: null });
          setLocationStatus('Ubicación obtenida (sin nombre de ciudad)');
        }
      },
      (error) => {
        console.error(error);
        setLocationStatus('No se pudo obtener la ubicación.');
        alert('Error al obtener la geolocalización.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!isValidGmail(loginEmail)) {
      alert('Por seguridad, solo se permiten correos con el dominio @gmail.com');
      return;
    }
    if (!isValidPasswordLength(loginPassword)) {
      alert('La contraseña debe tener entre 8 y 16 caracteres.');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await response.json();
      if (response.ok) {
        if (data.token) localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user || { correo: loginEmail }));
        setIsAuthenticated(true);
      } else {
        const firstError = data.errors ? Object.values(data.errors)[0][0] : null;
        alert(firstError || data.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('No se pudo conectar con el servidor backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!isValidGmail(regEmail)) {
      alert('El correo de registro debe pertenecer estrictamente a @gmail.com');
      return;
    }
    if (!isValidPasswordLength(regPassword)) {
      alert('La contraseña debe tener entre 8 y 16 caracteres.');
      return;
    }
    if (regPassword !== regPasswordConfirmation) {
      alert('Las contraseñas no coinciden. Por favor, revísalas.');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          phone: regPhone,
          password: regPassword,
          password_confirmation: regPasswordConfirmation,
          latitude: regCoords?.latitude || null,
          longitude: regCoords?.longitude || null,
          city: regCoords?.ciudad || null
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Registro exitoso. ¡Ahora puedes iniciar sesión!');
        setCurrentView('login');
      } else {
        const firstError = data.errors ? Object.values(data.errors)[0][0] : null;
        alert(firstError || data.message || 'Ocurrió un error durante el registro');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('No se pudo establecer conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestToken = async (e) => {
    e.preventDefault();
    if (!isValidGmail(forgotEmail)) {
      alert('Ingresa un correo @gmail.com válido.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Se ha enviado un token de recuperación a tu correo de Gmail (Simulado: Tu token es 123456).');
      setStepForgot(2);
    }, 1000);
  };

  const handleResetPasswordWithToken = async (e) => {
    e.preventDefault();
    if (!isValidPasswordLength(newPassword)) {
      alert('La nueva contraseña debe tener entre 8 y 16 caracteres.');
      return;
    }
    if (resetToken !== '123456') {
      alert('Token inválido. (Usa "123456" para esta simulación).');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('¡Contraseña restablecida con éxito! Ya puedes iniciar sesión.');
      setCurrentView('login');
      setStepForgot(1);
      setForgotEmail('');
      setResetToken('');
      setNewPassword('');
    }, 1000);
  };

  const handleGoogleAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return <ArticulosSearchPage onLogout={handleLogout} />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <div style={styles.brandHeader}>
          <div style={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d61e7" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span style={styles.brandName}>EQUIPO-6</span>
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

      <div style={styles.rightPanel}>
        <div style={styles.topNav}>
          {currentView === 'login' && (
            <p style={styles.topNavText}>
              ¿Aún no tienes cuenta?{' '}
              <button onClick={() => setCurrentView('register')} style={styles.linkBtnInline}>
                Regístrate
              </button>
            </p>
          )}
          {currentView === 'register' && (
            <p style={styles.topNavText}>
              ¿Ya tienes una cuenta?{' '}
              <button onClick={() => setCurrentView('login')} style={styles.linkBtnInline}>
                Inicia sesión
              </button>
            </p>
          )}
          {currentView === 'forgot' && (
            <p style={styles.topNavText}>
              ¿Recordaste tu contraseña?{' '}
              <button onClick={() => { setCurrentView('login'); setStepForgot(1); }} style={styles.linkBtnInline}>
                Inicia sesión
              </button>
            </p>
          )}
        </div>

        <div style={styles.formContainer}>
          {currentView === 'login' && (
            <>
              <span style={styles.welcomeTag}>Te damos la bienvenida</span>
              <h2 style={styles.formTitle}>Inicia sesión</h2>
              <p style={styles.formSubtitle}>Accede con tu cuenta @gmail.com</p>

              <form onSubmit={handleLoginSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Correo electrónico (@gmail.com)</label>
                  <input
                    type="email"
                    placeholder="tuusuario@gmail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    style={styles.inputNoIcon}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={styles.label}>Contraseña</label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ background: 'none', border: 'none', color: '#1d61e7', fontSize: '12px', cursor: 'pointer' }}
                    >
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="8 a 16 caracteres"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    minLength={8}
                    maxLength={16}
                    required
                    style={styles.inputNoIcon}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px' }}>
                  <button
                    type="button"
                    onClick={() => { setCurrentView('forgot'); setStepForgot(1); }}
                    style={{ background: 'none', border: 'none', color: '#1d61e7', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <button type="submit" disabled={loading} style={styles.primaryBtn}>
                  {loading ? 'Cargando...' : 'Iniciar sesión'}
                </button>
              </form>
            </>
          )}

          {currentView === 'register' && (
            <>
              <span style={styles.welcomeTag}>Únete a nuestra comunidad</span>
              <h2 style={styles.formTitle}>Crea tu cuenta</h2>
              <p style={styles.formSubtitle}>Usa tu correo @gmail.com y contraseña de 8 a 16 dígitos</p>

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
                  <label style={styles.label}>Correo electrónico (@gmail.com)</label>
                  <input
                    type="email"
                    placeholder="tuusuario@gmail.com"
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

                {/* Botón para registrar ubicación con ciudad */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Ubicación (Opcional)</label>
                  <button 
                    type="button" 
                    onClick={handleGetLocation} 
                    style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px', fontSize: '13px', cursor: 'pointer', fontWeight: '600', color: '#334155' }}
                  >
                    📍 Detectar mi ubicación actual
                  </button>
                  {locationStatus && <span style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{locationStatus}</span>}
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Contraseña (8 a 16 dígitos)</label>
                  <input
                    type="password"
                    placeholder="Mín. 8, Máx. 16 caracteres"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    minLength={8}
                    maxLength={16}
                    required
                    style={styles.inputNoIcon}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Confirmar contraseña</label>
                  <input
                    type="password"
                    placeholder="Repite tu contraseña"
                    value={regPasswordConfirmation}
                    onChange={(e) => setRegPasswordConfirmation(e.target.value)}
                    minLength={8}
                    maxLength={16}
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

          {currentView === 'forgot' && (
            <>
              <span style={styles.welcomeTag}>Recuperación de cuenta</span>
              <h2 style={styles.formTitle}>Restablecer clave</h2>
              
              {stepForgot === 1 ? (
                <form onSubmit={handleRequestToken} style={styles.form}>
                  <p style={styles.formSubtitle}>Ingresa tu correo Gmail para recibir el token de recuperación.</p>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Correo electrónico (@gmail.com)</label>
                    <input
                      type="email"
                      placeholder="tuusuario@gmail.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      style={styles.inputNoIcon}
                    />
                  </div>
                  <button type="submit" disabled={loading} style={styles.primaryBtn}>
                    {loading ? 'Enviando...' : 'Enviar token'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordWithToken} style={styles.form}>
                  <p style={styles.formSubtitle}>Introduce el token recibido y tu nueva contraseña (8-16 dígitos).</p>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Token de recuperación</label>
                    <input
                      type="text"
                      placeholder="Ej. 123456"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      required
                      style={styles.inputNoIcon}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Nueva contraseña</label>
                    <input
                      type="password"
                      placeholder="Entre 8 y 16 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength={8}
                      maxLength={16}
                      required
                      style={styles.inputNoIcon}
                    />
                  </div>
                  <button type="submit" disabled={loading} style={styles.primaryBtn}>
                    {loading ? 'Actualizando...' : 'Cambiar contraseña'}
                  </button>
                </form>
              )}
            </>
          )}

          {currentView !== 'forgot' && (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

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