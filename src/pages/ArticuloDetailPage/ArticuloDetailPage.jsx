import { useState, useEffect } from 'react';
import './ArticuloDetailPage.css';
import ChatModal from '../../components/ChatModal';

export default function ArticuloDetailPage({ articulo, onBack, onLogout }) {
  const [selectedImg, setSelectedImg] = useState(articulo.imagenes[0]);
  const [comentarios, setComentarios] = useState(articulo.comentarios || []);
  const [nuevoComentario, setNuevoComentario] = useState('');

  // Estados para el chat en tiempo real (comprador y vendedor)
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeReceiverId, setActiveReceiverId] = useState(null);
  const [activeReceiverName, setActiveReceiverName] = useState('');
  const [buyersList, setBuyersList] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);

  const user = JSON.parse(localStorage.getItem('user')) || null;
  const sellerId = articulo.sellerId || articulo.vendedor?.id;
  const esMiProducto = Boolean(user?.id && sellerId && Number(user.id) === Number(sellerId));

  // Si el usuario actual es el vendedor, cargar la lista de compradores que le han escrito
  useEffect(() => {
    if (!esMiProducto || !articulo.id) return;

    const fetchConversations = async () => {
      setLoadingChats(true);
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`http://localhost:8000/api/v1/products/${articulo.id}/conversations`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          setBuyersList(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error cargando conversaciones del vendedor:', err);
      } finally {
        setLoadingChats(false);
      }
    };

    fetchConversations();
  }, [esMiProducto, articulo.id]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    const comentarioObj = {
      id: Date.now(),
      autor: user?.nombre || user?.name || 'Usuario',
      texto: nuevoComentario.trim()
    };

    setComentarios([...comentarios, comentarioObj]);
    setNuevoComentario('');
  };

  // Abrir chat cuando el usuario es comprador
  const handleOpenBuyerChat = () => {
    if (!user?.id) {
      alert('Debes iniciar sesión para chatear con el vendedor.');
      return;
    }
    if (!sellerId) {
      alert('Este es un artículo de demostración. El chat en tiempo real está disponible en artículos publicados en la plataforma.');
      return;
    }
    setActiveReceiverId(sellerId);
    setActiveReceiverName(articulo.vendedor?.nombreCompleto || 'Vendedor');
    setIsChatOpen(true);
  };

  // Abrir chat cuando el usuario es el vendedor y selecciona a un comprador
  const handleOpenSellerReply = (buyer) => {
    setActiveReceiverId(buyer.id);
    setActiveReceiverName(buyer.name);
    setIsChatOpen(true);
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

            {/* ZONA DE ACCIÓN DE CHAT (COMPRADOR VS VENDEDOR) */}
            {!esMiProducto ? (
              <button
                onClick={handleOpenBuyerChat}
                style={{ width: '100%', padding: '14px', backgroundColor: '#1d61e7', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}
              >
                💬 Enviar mensaje al vendedor
              </button>
            ) : (
              <div style={{ padding: '14px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ color: '#1e40af', fontSize: '13px', fontWeight: '700' }}>
                  📢 Publicado por ti — Mensajes de interesados:
                </span>

                {loadingChats ? (
                  <span style={{ fontSize: '13px', color: '#475569' }}>Cargando chats...</span>
                ) : buyersList.length > 0 ? (
                  buyersList.map((buyer) => (
                    <button
                      key={buyer.id}
                      onClick={() => handleOpenSellerReply(buyer)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: '#1d61e7',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      💬 Responder a {buyer.name}
                    </button>
                  ))
                ) : (
                  <span style={{ fontSize: '13px', color: '#64748b' }}>
                    Aún no has recibido mensajes por este artículo.
                  </span>
                )}
              </div>
            )}
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

      {/* MODAL DE CHAT EN TIEMPO REAL CON SOCKET.IO */}
      {isChatOpen && user && activeReceiverId && (
        <ChatModal
          product={articulo}
          currentUser={user}
          receiverId={activeReceiverId}
          receiverName={activeReceiverName}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
}