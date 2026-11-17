import { useState } from 'react';
import './ArticuloFormPage.css';

// Mapeo de nombres de categoría a sus IDs en la base de datos
const CATEGORIAS_MAP = {
  'Electrónica': 1,
  'Muebles': 2,
  'Deportes': 3,
  'Juegos': 4,
};

export default function ArticuloFormPage({ onBack, onArticuloCreado }) {
  const [titulo, setTitulo] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('Electrónica');
  const [ubicacion, setUbicacion] = useState('Culiacán');
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem('user')) || { nombre: 'Usuario Actual' };

  // Guarda el archivo real para enviarlo al backend y genera la vista previa local
  const handleImageFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImagenFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor selecciona un archivo de imagen válido (PNG, JPG o WEBP).');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleImageFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Recuperar el token guardado al iniciar sesión
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');

    if (!token) {
      alert('Debes iniciar sesión para poder publicar un artículo.');
      setIsSubmitting(false);
      return;
    }

    // Construir FormData con los nombres de columna que espera Laravel
    const formData = new FormData();
    formData.append('title', titulo);
    formData.append('price', parseFloat(precio) || 0);
    formData.append('category_id', CATEGORIAS_MAP[categoria] || 1);
    formData.append('location', ubicacion);
    formData.append('description', descripcion);
    formData.append('condition', 'Usado');

    if (imagenFile) {
      formData.append('image', imagenFile);
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error al guardar en API:', data);
        alert('Error al publicar: ' + (data.message || 'Verifica los datos ingresados.'));
        setIsSubmitting(false);
        return;
      }

      // Formatear respuesta para actualizar la vista en memoria si el componente padre la usa
      const articuloFormateado = {
        id: data.id,
        titulo: data.title,
        precio: `$${data.price} MXN`,
        categoria,
        ubicacion: data.location,
        descripcion: data.description,
        imagenes: [data.image_data || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f'],
        vendedor: {
          nombreCompleto: user.nombre || user.name || 'Usuario Actual',
          calificacion: '5.0 ⭐',
          miembrosDesde: '2026',
        },
        comentarios: [],
      };

      alert('¡Artículo publicado y guardado en la base de datos!');
      if (onArticuloCreado) onArticuloCreado(articuloFormateado);
      onBack();
    } catch (error) {
      console.error('Error de red:', error);
      alert('No se pudo conectar con el servidor de la API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page-wrapper">
      <div className="form-container">
        <button className="btn-back" onClick={onBack}>← Volver al catálogo</button>

        <h1 className="form-title">Publicar un nuevo artículo</h1>
        <p className="form-subtitle">Completa los datos de tu producto para ofrecerlo en el marketplace.</p>

        <form onSubmit={handleSubmit} className="form-layout">
          <div>
            <label className="input-label">Título del producto</label>
            <input
              type="text"
              placeholder="Ej. Nintendo 3DS"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div className="form-row-2">
            <div>
              <label className="input-label">Precio (MXN)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Ej. 2000"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="input-label">Categoría</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="input-field"
              >
                <option value="Electrónica">Electrónica</option>
                <option value="Muebles">Muebles</option>
                <option value="Deportes">Deportes</option>
                <option value="Juegos">Juegos</option>
              </select>
            </div>
          </div>

          <div>
            <label className="input-label">Ubicación / Zona</label>
            <input
              type="text"
              placeholder="Ej. Culiacán"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              required
              className="input-field"
            />
          </div>

          {/* Zona de Arrastrar y Soltar / Explorador de Archivos */}
          <div>
            <label className="input-label">Imagen del producto</label>
            <div
              className={`drop-zone${isDraggingOver ? ' dragging-over' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              {imagenPreview ? (
                <div className="preview-container">
                  <img src={imagenPreview} alt="Vista previa" className="preview-image" />
                  <span className="preview-text">
                    ¡Imagen cargada con éxito! (Haz clic o arrastra otra para cambiarla)
                  </span>
                </div>
              ) : (
                <div className="preview-container">
                  <span className="empty-zone-icon">📁</span>
                  <span className="empty-zone-text">Arrastra una imagen aquí o haz clic para seleccionarla</span>
                  <span className="empty-zone-subtext">PNG, JPG o WEBP</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="input-label">Descripción detallada</label>
            <textarea
              placeholder="Describe las condiciones del artículo..."
              rows="4"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className="input-field"
            ></textarea>
          </div>

          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Publicando...' : 'Publicar Artículo'}
          </button>
        </form>
      </div>
    </div>
  );
}