import { useState, useEffect } from 'react';
import './ArticulosSearchPage.css';
import LocationModal from '../../components/LocationModal';

// Importación de todas las imágenes locales desde assets (para datos de ejemplo)
import biciImg from '../../assets/bicicleta.jpg';
import escritorioImg from '../../assets/escritorio.jpg';
import laptopImg from '../../assets/laptop.jpg';
import monitorImg from '../../assets/monitor.jpg';
import ps5Img from '../../assets/ps5.jpg';
import raquetaImg from '../../assets/raqueta.jpg';
import sillaImg from '../../assets/silla.jpg';
import tenisImg from '../../assets/tenis.jpg';

const ARTICULOS_DEMO = [
  {
    id: 'demo-1',
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
    id: 'demo-2',
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
    id: 'demo-3',
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
    id: 'demo-4',
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
    id: 'demo-5',
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
    id: 'demo-6',
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
    id: 'demo-7',
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
    id: 'demo-8',
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

// Función auxiliar para quitar acentos al comparar categorías ('Electrónica' === 'electronica')
const normalizarTexto = (texto = '') =>
  texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export default function ArticulosSearchPage({ onLogout, onSelectArticle, onOpenForm, onOpenProfile }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');

  // Filtro de ubicación con radio en km (por defecto Culiacán, 40 km)
  const [locationFilter, setLocationFilter] = useState({
    city: 'Culiacán',
    coords: [24.8091, -107.3940],
    radiusKm: 40,
  });
  const [usarFiltroDistancia, setUsarFiltroDistancia] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Estado para los artículos traídos desde PostgreSQL
  const [articulosApi, setArticulosApi] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);

  // Estado para el menú Hamburguesa
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Estados para la Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const articulosPorPagina = 4;

  const user = JSON.parse(localStorage.getItem('user')) || { nombre: 'Usuario Mercado' };

  // Función reutilizable para consultar productos desde la API (con o sin radio)
  const fetchProductos = async (loc = locationFilter, filtrarPorRadio = usarFiltroDistancia) => {
    setCargandoProductos(true);
    try {
      let url = 'http://localhost:8000/api/v1/products';

      if (filtrarPorRadio && loc?.coords) {
        const params = new URLSearchParams({
          lat: loc.coords[0],
          lng: loc.coords[1],
          radius: loc.radiusKm,
        });
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener productos de la API');
      }

      const data = await response.json();

      // Mapear los campos de PostgreSQL al formato que usan tus tarjetas y ArticuloDetailPage
      const mapeados = data.map((prod) => ({
        id: prod.id,
        sellerId: prod.seller_id || prod.user_id || prod.seller?.id,
        titulo: prod.title,
        precio: `$${Number(prod.price).toLocaleString('es-MX')} MXN`,
        categoria: prod.category?.name || 'General',
        ubicacion: prod.location || 'Culiacán',
        distanciaKm: prod.distance !== undefined ? Number(prod.distance).toFixed(1) : null,
        descripcion: prod.description || 'Sin descripción disponible.',
        imagenes: [
          prod.image_data || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f'
        ],
        vendedor: {
          id: prod.seller_id || prod.user_id || prod.seller?.id,
          nombreCompleto: prod.seller?.name || 'Vendedor Verificado',
          calificacion: '5.0 ⭐',
          miembrosDesde: '2026',
        },
        comentarios: [],
      }));

      setArticulosApi(mapeados);
    } catch (error) {
      console.error('Error conectando con la API de productos:', error);
    } finally {
      setCargandoProductos(false);
    }
  };

  // 1. Cargar productos reales desde la API de Laravel al iniciar
  useEffect(() => {
    fetchProductos(locationFilter, false);
  }, []);

  // 2. Detectar ciudad inicial del usuario por GPS (opcional, actualiza el nombre mostrado)
  useEffect(() => {
    if (!navigator.geolocation) return;

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
          const ciudad = address.city || address.town || address.village || address.municipality;

          if (ciudad) {
            setLocationFilter((prev) => ({
              ...prev,
              city: ciudad,
              coords: [lat, lng],
            }));
          }
        } catch (error) {
          console.error('Error al obtener el nombre de la ciudad:', error);
        }
      },
      () => {
        // Si el usuario niega el GPS, mantiene Culiacán por defecto
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // Cuando el usuario hace clic en "Aplicar" dentro de LocationModal
  const handleApplyLocation = (newLocation) => {
    setLocationFilter(newLocation);
    setUsarFiltroDistancia(true);
    setPaginaActual(1);
    fetchProductos(newLocation, true);
  };

  // Combinar primero los productos reales de la base de datos seguidos de los de demostración
  // (Si ya aplicó un filtro de radio, mostramos solo los resultados filtrados de la BD)
  const todosLosArticulos = usarFiltroDistancia
    ? articulosApi
    : [...articulosApi, ...ARTICULOS_DEMO];

  // Filtrado de artículos (con normalización de acentos)
  const articulosFiltrados = todosLosArticulos.filter((art) => {
    const queryNorm = normalizarTexto(searchQuery);
    const matchesSearch =
      normalizarTexto(art.titulo).includes(queryNorm) ||
      normalizarTexto(art.categoria).includes(queryNorm);

    const matchesCategory =
      selectedCategory === 'todos' ||
      normalizarTexto(art.categoria) === normalizarTexto(selectedCategory);

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
                <span className="location-title">Ubicación</span>
                {usarFiltroDistancia && (
                  <button
                    type="button"
                    className="btn-change-location"
                    onClick={() => {
                      setUsarFiltroDistancia(false);
                      setPaginaActual(1);
                      fetchProductos(locationFilter, false);
                    }}
                  >
                    Ver todos
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                style={{
                  width: '100%',
                  marginTop: '6px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  color: '#1d61e7',
                  fontWeight: '600',
                  fontSize: '13.5px',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                📍 {locationFilter.city} · En un radio de {locationFilter.radiusKm} km
              </button>
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
              {categorias.find((c) => c.id === selectedCategory)?.name || 'Artículos'}
            </h1>
            <p className="main-subheading">
              Mostrando resultados para:{' '}
              <strong>
                {locationFilter.city}
                {usarFiltroDistancia ? ` (radio de ${locationFilter.radiusKm} km)` : ''}
              </strong>{' '}
              ({articulosFiltrados.length} disponibles)
            </p>
          </div>

          {cargandoProductos ? (
            <p className="no-results">Cargando artículos desde el servidor...</p>
          ) : (
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
                      <span className="product-location">
                        📍 Zona: {item.ubicacion}
                        {item.distanciaKm ? ` (${item.distanciaKm} km)` : ''}
                      </span>
                      <p className="product-price">{item.precio}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-results">
                  No se encontraron artículos disponibles en esta ubicación, categoría o búsqueda.
                </p>
              )}
            </div>
          )}

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

      {/* Modal interactivo de ubicación y radio */}
      <LocationModal
        isOpen={isLocationModalOpen}
        initialLocation={locationFilter}
        onClose={() => setIsLocationModalOpen(false)}
        onApply={handleApplyLocation}
      />
    </div>
  );
}