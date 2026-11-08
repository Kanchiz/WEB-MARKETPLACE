import { useState, useEffect } from 'react';

// Importación de todas las imágenes locales desde assets
import biciImg from '../assets/bicicleta.jpg';
import escritorioImg from '../assets/escritorio.jpg';
import laptopImg from '../assets/laptop.jpg';
import monitorImg from '../assets/monitor.jpg';
import ps5Img from '../assets/ps5.jpg';
import raquetaImg from '../assets/raqueta.jpg';
import sillaImg from '../assets/silla.jpg';
import tenisImg from '../assets/tenis.jpg';

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
      titulo: 'Tenis Nike Air Force 1 \'07 (27.5 MX)',
      precio: '$1,200 MXN',
      categoria: 'Deportes',
      ubicacion: 'Culiacán',
      descripcion: 'Tenis casuales Nike Air Force 1 \'07 originales en color blanco. Talla 27.5 MX. Estética 9/10, impecables en caja original.',
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

  // Lógica de Consumo Paginado
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      <header style={{ backgroundColor: '#1d61e7', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d61e7" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
          </div>
          <span style={{ fontSize: '20px', fontWeight: '800' }}>equipo-6</span>
        </div>

        {/* Menú Hamburguesa */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              backgroundColor: '#ffffff22', color: '#fff', border: '1px solid #ffffff55',
              padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
              display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600'
            }}
          >
            <span>Hola, <strong>{user.nombre || user.name || user.correo || 'Usuario'}</strong></span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {isMenuOpen && (
            <div style={{
              position: 'absolute', top: '110%', right: 0, backgroundColor: '#fff',
              borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e2e8f0', width: '200px', zIndex: 50, overflow: 'hidden',
              display: 'flex', flexDirection: 'column'
            }}>
              <button
                onClick={() => { setIsMenuOpen(false); onOpenProfile(); }}
                style={{
                  padding: '12px 16px', backgroundColor: 'transparent', border: 'none',
                  borderBottom: '1px solid #f1f5f9', color: '#334155', textAlign: 'left',
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                ⚙️ Editar Perfil
              </button>

              <button
                onClick={() => { setIsMenuOpen(false); onLogout(); }}
                style={{
                  padding: '12px 16px', backgroundColor: 'transparent', border: 'none',
                  color: '#ef4444', textAlign: 'left', fontSize: '14px', fontWeight: '600',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                🚪 Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)' }}>
        <aside style={{ width: '280px', backgroundColor: '#fff', borderRight: '1px solid #e2e8f0', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>Marketplace</h2>
            
            <button
              onClick={onOpenForm}
              style={{ width: '100%', padding: '10px', backgroundColor: '#1d61e7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', marginBottom: '16px' }}
            >
              + Publicar artículo
            </button>

            <div style={{ backgroundColor: '#eff6ff', padding: '10px 12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', color: '#1e3a8a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: '700' }}>📍 Tu ubicación</span>
                <button 
                  onClick={() => setIsChangingLocation(!isChangingLocation)}
                  style={{ background: 'none', border: 'none', color: '#1d61e7', cursor: 'pointer', fontSize: '12px', fontWeight: '600', padding: 0 }}
                >
                  {isChangingLocation ? 'Cancelar' : 'Cambiar'}
                </button>
              </div>

              {!isChangingLocation ? (
                <div style={{ color: locationError ? '#dc2626' : '#1e3a8a', fontWeight: '500' }}>
                  {userLocationText}
                </div>
              ) : (
                <form onSubmit={handleManualLocationSubmit} style={{ marginTop: '8px', display: 'flex', gap: '4px' }}>
                  <input
                    type="text"
                    placeholder="Escribe otra ciudad..."
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #93c5fd', fontSize: '12px', outline: 'none' }}
                    autoFocus
                  />
                  <button type="submit" style={{ backgroundColor: '#1d61e7', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 8px', fontSize: '12px', cursor: 'pointer' }}>
                    Ver
                  </button>
                </form>
              )}
            </div>

            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPaginaActual(1); }}
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
                  onClick={() => { setSelectedCategory(cat.id); setPaginaActual(1); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 12px',
                    borderRadius: '8px', border: 'none', backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                    color: isSelected ? '#1d61e7' : '#334155', fontWeight: isSelected ? '700' : '500',
                    fontSize: '14px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease'
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
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', color: '#0f172a', margin: '0 0 4px 0' }}>
              {categorias.find(c => c.id === selectedCategory)?.name || 'Artículos'}
            </h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
              Mostrando resultados para: <strong>{userLocationText}</strong> ({articulosFiltrados.length} disponibles)
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {articulosPaginados.length > 0 ? (
              articulosPaginados.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => onSelectArticle(item)}
                  style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', transition: 'transform 0.2s' }}
                >
                  <div>
                    <img src={item.imagenes[0]} alt={item.titulo} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#1d61e7', textTransform: 'uppercase' }}>{item.categoria}</span>
                    <h3 style={{ fontSize: '16px', color: '#1e293b', margin: '4px 0 8px 0' }}>{item.titulo}</h3>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>📍 Zona: {item.ubicacion}</span>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{item.precio}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', marginTop: '40px' }}>
                No se encontraron artículos disponibles en esta categoría o búsqueda.
              </p>
            )}
          </div>

          {/* Controles de Paginación */}
          {totalPaginas > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
              {Array.from({ length: totalPaginas }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setPaginaActual(index + 1)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: paginaActual === index + 1 ? '#1d61e7' : '#fff',
                    color: paginaActual === index + 1 ? '#fff' : '#334155',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
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