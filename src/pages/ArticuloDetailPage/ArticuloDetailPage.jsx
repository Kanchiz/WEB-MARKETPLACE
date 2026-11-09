import { useState } from 'react';
import './ArticuloDetailPage.css'; // Asegúrate de tener este archivo para los estilos del chat flotante

export default function ArticuloDetailPage({ articulo, onBack, onLogout }) {
  // --- ESTADOS ORIGINALES ---
  const [selectedImg, setSelectedImg] = useState(articulo.imagenes[0]);
  const [comentarios, setComentarios] = useState(articulo.comentarios || []);
  const [nuevoComentario, setNuevoComentario] = useState('');

  const user = JSON.parse(localStorage.getItem('user')) || { nombre: 'Usuario Mercado' };

  // --- ESTADOS DEL CHAT (NUEVO) ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mensajeInput, setMensajeInput] = useState('');
  const [mensajes, setMensajes] = useState([
    { id: 1, texto: `Hola, me interesa tu anuncio de "${articulo.titulo}".`, emisor: 'yo' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // --- FUNCIONES ORIGINALES ---
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    const comentarioObj = {
      id: Date.now(),
      autor: user.nombre || user.name || 'Usuario',
      texto: nuevoComentario.trim()
    };

    setComentarios([...comentarios, comentarioObj]);
    setNuevoComentario('');
  };

  // --- FUNCIÓN DEL CHAT (NUEVO) ---
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!mensajeInput.trim()) return;

    // Agregar mi mensaje
    const nuevoMensaje = { id: Date.now(), texto: mensajeInput, emisor: 'yo' };
    setMensajes(prev => [...prev, nuevoMensaje]);
    setMensajeInput('');
    setIsTyping(true);

    // Simular la respuesta del vendedor después de 1.5 segundos
    setTimeout(() => {
      const respuestaVendedor = { 
        id: Date.now() + 1, 
        texto: '¡Hola! Claro, sigue disponible. ¿De qué parte eres para acordar entrega?', 
        emisor: 'vendedor' 
      };
      setMensajes(prev => [...prev, respuestaVendedor]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      <header style={{ backgroundColor: '#1d61e7', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onBack} style={{ backgroundColor: '#ffffff22', color: '#fff', border: '1px solid #ffffff55', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
          ← Volver al catálogo
        </button>
        <button onClick={onLogout} style={{ backgroundColor: '#ffffff22', color: '#fff', border: '1px solid #ffffff55', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
          Cerrar sesión
        </button>
      </header>

      <div style={{ maxWidth: '1000px', margin: '32px auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div>
            <img src={selectedImg} alt={articulo.titulo} style={{ width: '100%', height: '380px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }} />
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              {articulo.imagenes.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Vista ${idx}`}
                  onClick={() => setSelectedImg(img)}
                  style={{
                    width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer',
                    border: selectedImg === img ? '3px solid #1d61e7' : '1px solid #cbd5e1'
                  }}
                />
              ))}
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Descripción del vendedor</h2>
            <p style={{ color: '#334155', lineHeight: '1.6', fontSize: '15px' }}>{articulo.descripcion}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#1d61e7', textTransform: 'uppercase' }}>{articulo.categoria} 📍 {articulo.ubicacion}</span>
              <h1 style={{ fontSize: '24px', color: '#0f172a', margin: '8px 0' }}>{articulo.titulo}</h1>
              <p style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{articulo.precio}</p>
            </div>

            <div style={{ backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Información del vendedor</span>
              <h3 style={{ fontSize: '16px', color: '#0f172a', margin: '6px 0 4px 0' }}>{articulo.vendedor.nombreCompleto}</h3>
              <div style={{ fontSize: '13px', color: '#475569', display: 'flex', gap: '12px' }}>
                <span>{articulo.vendedor.calificacion}</span>
                <span>Miembro desde {articulo.vendedor.miembrosDesde}</span>
              </div>
            </div>

            {/* EVENTO ONCLICK AGREGADO AQUÍ */}
            <button 
              onClick={() => setIsChatOpen(true)}
              style={{ width: '100%', padding: '14px', backgroundColor: '#1d61e7', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}
            >
              Enviar mensaje al vendedor
            </button>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>Preguntas y comentarios</h2>

          <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Haz una pregunta o deja un comentario sobre este artículo..."
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '12px 20px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
              Comentar
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {comentarios.length > 0 ? (
              comentarios.map((com) => (
                <div key={com.id} style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#1d61e7' }}>{com.autor}</span>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#334155' }}>{com.texto}</p>
                </div>
              ))
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>Aún no hay comentarios sobre este artículo. ¡Sé el primero en preguntar!</p>
            )}
          </div>
        </div>
      </div>

      {/* VENTANA FLOTANTE DE CHAT (NUEVO) */}
      {isChatOpen && (
        <div className="chat-widget">
          <div className="chat-header">
            <div>
              <strong>{articulo.vendedor.nombreCompleto}</strong>
              <span className="chat-status">En línea</span>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="btn-close-chat">✖</button>
          </div>

          <div className="chat-body">
            {mensajes.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.emisor === 'yo' ? 'my-message' : 'seller-message'}`}>
                {msg.texto}
              </div>
            ))}
            {isTyping && (
              <div className="chat-message seller-message typing-indicator">
                El vendedor está escribiendo...
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="chat-footer">
            <input 
              type="text" 
              placeholder="Escribe un mensaje..." 
              value={mensajeInput}
              onChange={(e) => setMensajeInput(e.target.value)}
              className="chat-input"
            />
            <button type="submit" className="btn-send-chat">➤</button>
          </form>
        </div>
      )}
    </div>
  );
}