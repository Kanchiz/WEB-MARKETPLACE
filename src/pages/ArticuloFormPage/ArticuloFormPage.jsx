import { useState } from 'react';
import './ArticuloFormPage.css';

export default function ArticuloFormPage({ onBack, onArticuloCreado }) {
  const [titulo, setTitulo] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('Electrónica');
  const [ubicacion, setUbicacion] = useState('Culiacán');
  const [imagenPreview, setImagenPreview] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const user = JSON.parse(localStorage.getItem('user')) || { nombre: 'Usuario Actual' };

  // Convierte el archivo de imagen seleccionado o arrastrado a Base64
  const handleImageFile = (file) => {
    if (file && file.type.startsWith('image/')) {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Imagen por defecto si el usuario no adjunta ninguna
    const imagenFinal = imagenPreview || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f';

    const nuevoArticulo = {
      id: Date.now(),
      titulo,
      precio: `$${precio} MXN`,
      categoria,
      ubicacion,
      descripcion,
      imagenes: [imagenFinal],
      vendedor: {
        nombreCompleto: user.nombre || user.name || 'Usuario Actual',
        calificacion: '5.0 ⭐',
        miembrosDesde: '2026'
      },
      comentarios: []
    };

    // Obtener artículos previos del localStorage o iniciar con arreglo vacío
    const storedArticulos = JSON.parse(localStorage.getItem('mis_articulos')) || [];

    // Guardar el nuevo artículo sumado a los anteriores
    localStorage.setItem('mis_articulos', JSON.stringify([nuevoArticulo, ...storedArticulos]));

    alert('¡Artículo publicado con éxito!');
    if (onArticuloCreado) onArticuloCreado(nuevoArticulo);
    onBack();
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
                type="text"
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

          <button type="submit" className="btn-submit">Publicar Artículo</button>
        </form>
      </div>
    </div>
  );
}
