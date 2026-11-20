import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix de ícono por defecto de Leaflet en Vite/React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Recentra el mapa y ajusta el zoom automáticamente cuando cambian coordenadas o radio
function MapUpdater({ center, radiusKm }) {
  const map = useMap();
  useEffect(() => {
    const zoom =
      radiusKm <= 2 ? 13 :
      radiusKm <= 5 ? 12 :
      radiusKm <= 15 ? 11 :
      radiusKm <= 40 ? 9 : 8;
    map.setView(center, zoom);
  }, [center, radiusKm, map]);
  return null;
}

// Permite hacer clic en cualquier punto del mapa para mover el pin y obtener el nombre del lugar
function MapClickHandler({ onSelectCoords }) {
  useMapEvents({
    click(e) {
      onSelectCoords([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function LocationModal({ isOpen, initialLocation, onClose, onApply }) {
  const [cityInput, setCityInput] = useState(initialLocation?.city || 'Culiacán');
  const [coords, setCoords] = useState(initialLocation?.coords || [24.8091, -107.3940]);
  const [radiusKm, setRadiusKm] = useState(initialLocation?.radiusKm || 40);
  const [searching, setSearching] = useState(false);

  // Sincronizar estado interno si cambia la ubicación inicial desde afuera
  useEffect(() => {
    if (initialLocation) {
      setCityInput(initialLocation.city || 'Culiacán');
      setCoords(initialLocation.coords || [24.8091, -107.3940]);
      setRadiusKm(initialLocation.radiusKm || 40);
    }
  }, [initialLocation, isOpen]);

  if (!isOpen) return null;

  // Función auxiliar para obtener el nombre más específico de unas coordenadas (localidad, pueblo, colonia o ciudad)
  const fetchPlaceName = async (lat, lon) => {
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
        { headers: { 'User-Agent': 'MarketplaceEquipo6/1.0' } }
      );
      const data = await res.json();
      const addr = data.address || {};

      // Priorizar la localidad más específica antes que el municipio general
      const localidad =
        addr.village ||
        addr.town ||
        addr.hamlet ||
        addr.suburb ||
        addr.neighbourhood ||
        addr.city ||
        addr.municipality ||
        (data.display_name ? data.display_name.split(',')[0] : '');

      const municipio = addr.city || addr.municipality || '';

      if (localidad && municipio && localidad !== municipio) {
        setCityInput(`${localidad}, ${municipio}`);
      } else if (localidad) {
        setCityInput(localidad);
      }
    } catch (err) {
      console.error('Error en geocodificación inversa:', err);
    } finally {
      setSearching(false);
    }
  };

  // Cuando el usuario hace clic en un punto del mapa
  const handleMapClick = (newCoords) => {
    setCoords(newCoords);
    fetchPlaceName(newCoords[0], newCoords[1]);
  };

  // Buscar ciudad o código postal usando el input de texto
  const handleSearchCity = async (e) => {
    e.preventDefault();
    if (!cityInput.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityInput)}&limit=1`,
        { headers: { 'User-Agent': 'MarketplaceEquipo6/1.0' } }
      );
      const data = await res.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setCoords([lat, lon]);
        setCityInput(data[0].display_name.split(',')[0]);
      } else {
        alert('No se encontró esa ubicación. Intenta con otra ciudad o código postal.');
      }
    } catch (err) {
      console.error('Error buscando ubicación:', err);
    } finally {
      setSearching(false);
    }
  };

  // Botón de GPS (ícono de flecha en la esquina superior derecha del mapa)
  const handleUseMyGPS = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setCoords([lat, lon]);
        fetchPlaceName(lat, lon);
      },
      () => alert('No se pudo obtener tu ubicación. Verifica los permisos del navegador.')
    );
  };

  const handleApply = () => {
    onApply({
      city: cityInput,
      coords,
      radiusKm: Number(radiusKm),
    });
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
            Cambiar ubicación
          </h3>
          <button type="button" onClick={onClose} style={styles.closeBtn}>
            ✕
          </button>
        </div>

        <div style={styles.body}>
          <label style={styles.label}>
            Busca por ciudad, localidad o haz clic directamente en el mapa
          </label>

          {/* Input de ubicación */}
          <form onSubmit={handleSearchCity} style={styles.inputBox}>
            <span style={{ fontSize: '18px' }}>📍</span>
            <div style={{ flex: 1 }}>
              <small style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>
                {searching ? 'Obteniendo nombre del lugar...' : 'Ubicación'}
              </small>
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Ej. Navolato, Pericos, Culiacán..."
                style={styles.input}
              />
            </div>
            <button type="submit" disabled={searching} style={styles.searchBtn}>
              {searching ? '...' : 'Buscar'}
            </button>
          </form>

          {/* Selector de radio */}
          <div style={styles.inputBox}>
            <div style={{ flex: 1 }}>
              <small style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>
                Radio
              </small>
              <select
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                style={styles.select}
              >
                <option value={2}>2 kilómetros</option>
                <option value={5}>5 kilómetros</option>
                <option value={10}>10 kilómetros</option>
                <option value={20}>20 kilómetros</option>
                <option value={40}>40 kilómetros</option>
                <option value={80}>80 kilómetros</option>
                <option value={150}>150 kilómetros</option>
              </select>
            </div>
          </div>

          {/* Contenedor del Mapa */}
          <div style={styles.mapWrapper}>
            <button
              type="button"
              onClick={handleUseMyGPS}
              title="Usar mi ubicación actual"
              style={styles.gpsBtn}
            >
              ➤
            </button>

            <MapContainer
              center={coords}
              zoom={9}
              style={{ width: '100%', height: '240px', borderRadius: '10px' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap"
              />
              <Marker position={coords} />
              <Circle
                center={coords}
                radius={radiusKm * 1000}
                pathOptions={{
                  color: '#1d61e7',
                  fillColor: '#1d61e7',
                  fillOpacity: 0.2,
                  weight: 2,
                }}
              />
              <MapUpdater center={coords} radiusKm={radiusKm} />
              <MapClickHandler onSelectCoords={handleMapClick} />
            </MapContainer>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button type="button" onClick={handleApply} style={styles.applyBtn}>
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1100,
  },
  modal: {
    width: '500px',
    maxWidth: '94vw',
    backgroundColor: '#fff',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
  },
  header: {
    padding: '16px 20px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#f1f5f9',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#0f172a',
  },
  body: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  label: {
    fontSize: '13px',
    color: '#64748b',
  },
  inputBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    padding: '8px 12px',
    backgroundColor: '#f8fafc',
  },
  input: {
    width: '100%',
    border: 'none',
    background: 'transparent',
    fontSize: '15px',
    fontWeight: '600',
    color: '#0f172a',
    outline: 'none',
  },
  searchBtn: {
    padding: '6px 12px',
    backgroundColor: '#e2e8f0',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#0f172a',
    cursor: 'pointer',
  },
  select: {
    width: '100%',
    border: 'none',
    background: 'transparent',
    fontSize: '15px',
    fontWeight: '600',
    color: '#0f172a',
    outline: 'none',
    cursor: 'pointer',
  },
  mapWrapper: {
    position: 'relative',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #cbd5e1',
  },
  gpsBtn: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 1000,
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    border: '1px solid #cbd5e1',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: '12px 20px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  applyBtn: {
    padding: '10px 24px',
    backgroundColor: '#1d61e7',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
  },
};