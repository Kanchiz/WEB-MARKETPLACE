import { useState, useEffect } from 'react';
import './ArticulosSearchPage.css';

// Importación de todas las imágenes locales desde assets
import biciImg from '../../assets/bicicleta.jpg';
import escritorioImg from '../../assets/escritorio.jpg';
import laptopImg from '../../assets/laptop.jpg';
import monitorImg from '../../assets/monitor.jpg';
import ps5Img from '../../assets/ps5.jpg';
import raquetaImg from '../../assets/raqueta.jpg';
import sillaImg from '../../assets/silla.jpg';
import tenisImg from '../../assets/tenis.jpg';

export default function ArticulosSearchPage({ onLogout, onSelectArticle, onOpenForm, onOpenProfile }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [userLocationText, setUserLocationText] = useState('Obteniendo ubicación...');
  const [locationError, setLocationError] = useState('');

  const [customCity, setCustomCity] = useState('');
  const [isChangingLocation, setIsChangingLocation] = useState(false);

  // Estado para el menú Hamburguesa
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Estados para la Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const articulosPorPagina = 4;

  const user = JSON.parse(localStorage.getItem('user')) || { nombre: 'Usuario Mercado' };

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
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
            { headers: { 'User-Agent': 'MarketplaceEquipo6/1.0' } }
          );
          const data = await response.json();
          const address = data.address || {};
          const ciudad = address.city || address.town || address.village || address.municipality || 'Ubicación detectada';
          const estado = address.state || '';
          setUserLocationText(`${ciudad}, ${estado}`);
        } catch (error) {
          console.error('Error al obtener el nombre de la ciudad:', error);
          setUserLocationText(`Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`);
        }
      },
      (error) => {
        console.error('Error al obtener ubicación:', error);
        setLocationError('No se pudo obtener tu ubicación actual.');
        setUserLocationText('Ubicación predeterminada');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const handleManualLocationSubmit = (e) => {
    e.preventDefault();
    if (customCity.trim()) {
      setUserLocationText(customCity.trim());
      setCustomCity('');
      setIsChangingLocation(false);
    }
  };

  // Combinar artículos guardados en localStorage con los estáticos de ejemplo
  const articulosGuardados = JSON.parse(localStorage.getItem('mis_articulos')) || [];

  const articulosEjemplo = [
    ...articulosGuardados,
    {
      id: 1,
      titulo: 'Bicicleta de Montaña 29"',
      precio: '$2,500 MXN',
      categoria: 'Deportes',
      ubicacion: 'Culiacán',
      descripcion: 'Bicicleta en excelente estado, frenos de disco hidráulicos, rodada 29, ideal para terreno irregular. Uso aproximado de 3 meses.',
      imagenes: [biciImg],
      vendedor: { nombreCompleto: 'Carlos Alfredo Lizarraga', calificacion: '4.9 ⭐', miembrosDesde: '2024' },
      comentarios: [
        { id: 101, autor: 'María Gómez', texto: '¿Aceptas cambios o solo efectivo?' },
        { id: 102, autor: 'Carlos Alfredo (Vendedor)', texto: 'Hola María, por el momento solo me interesa la venta en efectivo.' }
      ]
    },
    {
      id: 2,
      titulo: 'Silla Ergonómica de Oficina',
      precio: '$850 MXN',
      categoria: 'Muebles',
      ubicacion: 'Mazatlán',
      descripcion: 'Silla ergonómica de malla transpirable, soporte lumbar ajustable, reclinable hasta 130 grados. Ideal para trabajo remoto o estudio.',
      imagenes: [sillaImg],
      vendedor: { nombreCompleto: 'Ana Paula Rendón', calificacion: '4.7 ⭐', miembrosDesde: '2023' },
      comentarios: []
    },
    {
      id: 3,
      titulo: 'Laptop Gamer 16GB RAM',
      precio: '$15,000 MXN',
      categoria: 'Electrónica',
      ubicacion: 'Culiacán',
      descripcion: 'Laptop Gamer con procesador Intel i7 de 11va gen, RTX 3060, 16GB RAM, SSD 512GB. Incluye cargador original y caja en excelente estado.',
      imagenes: [laptopImg],
      vendedor: { nombreCompleto: 'Roberto García López', calificacion: '5.0 ⭐', miembrosDesde: '2022' },
      comentarios: [
        { id: 103, autor: 'Juan Pérez', texto: '¿Entrega personal en punto medio en Culiacán?' }
      ]
    },
    {
      id: 4,
      titulo: 'PlayStation 5 Slim 1TB Digital',
      precio: '$8,200 MXN',
      categoria: 'Juegos',
      ubicacion: 'Culiacán',
      descripcion: 'PlayStation 5 Slim Edición Digital de 1TB SSD. Impecables condiciones (9.5/10). Incluye control DualSense original, cables y base. Restablecida de fábrica.',
      imagenes: [ps5Img],
      vendedor: { nombreCompleto: 'Luis Fernando Gastélum', calificacion: '5.0 ⭐', miembrosDesde: '2023' },
      comentarios: [
        { id: 104, autor: 'Adrián Ríos', texto: '¿Aún tiene garantía de fábrica?' }
      ]
    },
    {
      id: 5,
      titulo: 'Monitor Curved Samsung 27" 144Hz',
      precio: '$3,900 MXN',
      categoria: 'Electrónica',
      ubicacion: 'Mazatlán',
      descripcion: 'Monitor curvo Samsung Odyssey G5 Quad HD (2560x1440), 144Hz, 1ms, AMD FreeSync. Incluye caja y cables DisplayPort/HDMI.',
      imagenes: [monitorImg],
      vendedor: { nombreCompleto: 'Sofía Isabel Beltrán', calificacion: '4.8 ⭐', miembrosDesde: '2024' },
      comentarios: []
    },
    {
      id: 6,
      titulo: 'Escritorio Minimalista de Pino y Metal',
      precio: '$1,450 MXN',
      categoria: 'Muebles',
      ubicacion: 'Culiacán',
      descripcion: 'Escritorio de madera sólida de pino tratado con estructura metálica negra reforzada. Medidas: 120x60x75 cm.',
      imagenes: [escritorioImg],
      vendedor: { nombreCompleto: 'Taller Maderero Culiacán', calificacion: '4.9 ⭐', miembrosDesde: '2022' },
      comentarios: []
    },
    {
      id: 7,
      titulo: 'Raqueta de Tenis Wilson Pro Staff 97',
      precio: '$1,800 MXN',
      categoria: 'Deportes',
      ubicacion: 'Culiacán',
      descripcion: 'Raqueta Wilson Pro Staff 97 (315g), patrón 16x19, encordado Luxilon Alu Power a 52 lbs. Excelente precisión.',
      imagenes: [raquetaImg],
      vendedor: { nombreCompleto: 'Gabriel Aréchiga', calificacion: '4.6 ⭐', miembrosDesde: '2025' },
      comentarios: []
    },
    {
      id: 8,
      titulo: "Tenis Nike Air Force 1 '07 (27.5 MX)",
      precio: '$1,200 MXN',
      categoria: 'Deportes',
      ubicacion: 'Culiacán',
      descripcion: "Tenis casuales Nike Air Force 1 '07 originales en color blanco. Talla 27.5 MX. Estética 9/10, impecables en caja original.",
      imagenes: [tenisImg],
      vendedor: { nombreCompleto: 'Valeria Valenzuela', calificacion: '4.7 ⭐', miembrosDesde: '2024' },
      comentarios: []
    }
  ];

  // Filtrado de artículos
  const articulosFiltrados = articulosEjemplo.filter(art => {
    const matchesSearch = art.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.categoria.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' ||
                            art.categoria.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Lógica de Paginación
  const indiceUltimoArticulo = paginaActual * articulosPorPagina;
  const indicePrimerArticulo = indiceUltimoArticulo - articulosPorPagina;
  const articulosPaginados = articulosFiltrados.slice(indicePrimerArticulo, indiceUltimoArticulo);
  const totalPaginas = Math.ceil(articulosFiltrados.length / articulosPorPagina);

  const categorias = [
    { id: 'todos', name: 'Explorar todo', icon: '🔍' },
    { id: 'electronica', name: 'Electrónica', icon: '💻' },
    { id: 'muebles', name: 'Muebles', icon: '🛋️' },
    { id: 'deportes', name: 'Deportes', icon: '⚽' },
    { id: 'juegos', name: 'Juegos', icon: '🎮' }
  ];

  return (
    <div className="search-page">
      <header className="search-header">
        <div className="header-brand">
          <div className="header-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d61e7" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
          </div>
          <span className="header-brand-name">equipo-6</span>
        </div>

        {/* Menú Hamburguesa */}
        <div className="hamburger-wrapper">
          <button className="hamburger-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span>Hola, <strong>{user.nombre || user.name || user.correo || 'Usuario'}</strong></span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {isMenuOpen && (
            <div className="hamburger-dropdown">
              <button className="dropdown-item" onClick={() => { setIsMenuOpen(false); onOpenProfile(); }}>
                ⚙️ Editar Perfil
              </button>
              <button className="dropdown-item" onClick={() => { setIsMenuOpen(false); onLogout(); }}>
                🚪 Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="search-body">
        <aside className="search-sidebar">
          <div>
            <h2 className="sidebar-title">Marketplace</h2>

            <button className="btn-publish" onClick={onOpenForm}>
              + Publicar artículo
            </button>

            <div className="location-box">
              <div className="location-header">
                <span className="location-title">📍 Tu ubicación</span>
                <button className="btn-change-location" onClick={() => setIsChangingLocation(!isChangingLocation)}>
                  {isChangingLocation ? 'Cancelar' : 'Cambiar'}
                </button>
              </div>

              {!isChangingLocation ? (
                <div className={`location-text${locationError ? ' error' : ''}`}>
                  {userLocationText}
                </div>
              ) : (
                <form onSubmit={handleManualLocationSubmit} className="location-form">
                  <input
                    type="text"
                    placeholder="Escribe otra ciudad..."
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    className="location-input"
                    autoFocus
                  />
                  <button type="submit" className="btn-location-submit">Ver</button>
                </form>
              )}
            </div>

            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPaginaActual(1); }}
              className="search-input"
            />
          </div>

          <div className="category-list">
            <span className="categories-label">Categorías</span>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setPaginaActual(1); }}
                className={`btn-category${selectedCategory === cat.id ? ' active' : ''}`}
              >
                <span className="category-icon">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </aside>

        <main className="search-main">
          <div>
            <h1 className="main-heading">
              {categorias.find(c => c.id === selectedCategory)?.name || 'Artículos'}
            </h1>
            <p className="main-subheading">
              Mostrando resultados para: <strong>{userLocationText}</strong> ({articulosFiltrados.length} disponibles)
            </p>
          </div>

          <div className="products-grid">
            {articulosPaginados.length > 0 ? (
              articulosPaginados.map((item) => (
                <div key={item.id} className="product-card" onClick={() => onSelectArticle(item)}>
                  <div>
                    <img src={item.imagenes[0]} alt={item.titulo} className="product-img" />
                    <span className="product-category">{item.categoria}</span>
                    <h3 className="product-title">{item.titulo}</h3>
                  </div>
                  <div>
                    <span className="product-location">📍 Zona: {item.ubicacion}</span>
                    <p className="product-price">{item.precio}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">
                No se encontraron artículos disponibles en esta categoría o búsqueda.
              </p>
            )}
          </div>

          {/* Controles de Paginación */}
          {totalPaginas > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPaginas }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setPaginaActual(index + 1)}
                  className={`btn-page${paginaActual === index + 1 ? ' active' : ''}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
