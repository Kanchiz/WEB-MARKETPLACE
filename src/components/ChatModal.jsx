import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export default function ChatModal({ product, currentUser, receiverId, receiverName, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  // Socket creado por referencia para evitar memory leaks y conexiones duplicadas
  const socketRef = useRef(null);

  // Genera un ID de sala único ordenando los IDs de ambos usuarios
  const participantes = [Number(currentUser.id), Number(receiverId)].sort((a, b) => a - b);
  const roomId = `prod_${product.id}_users_${participantes[0]}_${participantes[1]}`;

  useEffect(() => {
    // Crear la conexión socket cuando se abre el modal
    socketRef.current = io('http://localhost:3001');
    const socket = socketRef.current;

    const token = localStorage.getItem('token');

    // 1. Cargar historial filtrado entre ambos participantes desde PostgreSQL
    fetch(`http://localhost:8000/api/v1/products/${product.id}/messages?other_user_id=${receiverId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Error cargando historial:', err));

    // 2. Unirse a la sala en tiempo real
    socket.emit('unirse_chat', roomId);

    // 3. Escuchar mensajes entrantes
    const handleRecibirMensaje = (mensajeRecibido) => {
      setMessages((prev) => [...prev, mensajeRecibido]);
    };

    socket.on('recibir_mensaje', handleRecibirMensaje);

    // Desconectar el socket al cerrar el modal (cleanup)
    return () => {
      socket.off('recibir_mensaje', handleRecibirMensaje);
      socket.disconnect();
    };
  }, [product.id, receiverId, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const socket = socketRef.current;
    const token = localStorage.getItem('token');
    const texto = newMessage.trim();
    setNewMessage('');

    try {
      // 1. Guardar mensaje en PostgreSQL
      const response = await fetch('http://localhost:8000/api/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          receiver_id: Number(receiverId),
          content: texto,
        }),
      });

      const savedMessage = await response.json();

      if (response.ok) {
        // 2. Mostrar el mensaje en tu propia pantalla
        setMessages((prev) => [...prev, savedMessage]);

        // 3. Enviar por Socket.IO al otro usuario
        socket.emit('enviar_mensaje', {
          ...savedMessage,
          roomId,
        });
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div>
            <strong style={{ display: 'block', fontSize: '14px' }}>
              Chat con {receiverName || 'Usuario'}
            </strong>
            <small style={{ fontSize: '11px', opacity: 0.85 }}>{product.titulo}</small>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.messagesList}>
          {messages.map((msg, i) => {
            const isMine = Number(msg.sender_id) === Number(currentUser.id);
            return (
              <div
                key={msg.id || i}
                style={{
                  ...styles.bubble,
                  alignSelf: isMine ? 'flex-end' : 'flex-start',
                  backgroundColor: isMine ? '#1d61e7' : '#e2e8f0',
                  color: isMine ? '#fff' : '#0f172a',
                }}
              >
                <small style={{ fontSize: '10px', opacity: 0.8, display: 'block' }}>
                  {msg.sender?.name || (isMine ? 'Tú' : receiverName)}
                </small>
                <span>{msg.content}</span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} style={styles.form}>
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.sendBtn}>Enviar</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { width: '400px', height: '500px', backgroundColor: '#fff', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: { padding: '14px 16px', backgroundColor: '#1d61e7', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { background: 'none', border: 'none', color: '#fff', fontSize: '16px', cursor: 'pointer' },
  messagesList: { flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' },
  bubble: { maxWidth: '75%', padding: '10px 14px', borderRadius: '12px', fontSize: '14px' },
  form: { display: 'flex', padding: '12px', borderTop: '1px solid #e2e8f0', gap: '8px' },
  input: { flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' },
  sendBtn: { padding: '10px 16px', backgroundColor: '#1d61e7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }
};
