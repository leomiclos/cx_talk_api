import { io, Socket } from 'socket.io-client';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjYjc3YWIxMS1hNGU2LTQzYTMtOTAwMS0xYmYwYzVjYmYyOTAiLCJlbWFpbCI6ImNhcmxvc0B0ZXN0LmNvbSIsIm5hbWUiOiJDYXJsb3MiLCJpYXQiOjE3NTY1NjIzMjUsImV4cCI6MTc1NjU2NTkyNX0.8fSLUH8O8tp4BxfO5wklHqZbVodtd2qXjD44omFlgr0'; // use um token válido do seu AuthService

// Conecta no servidor com JWT no header
const socket: Socket = io('http://localhost:3000', {
  extraHeaders: {
    Authorization: `Bearer ${token}`,
  },
});

// Ao conectar
socket.on('connect', () => {
  console.log('Conectado ao servidor! ID do socket:', socket.id);

  // Envia uma mensagem depois de 1s
  setTimeout(() => {
    console.log('Enviando mensagem...');
    socket.emit('message', { content: 'Olá, chat!' });
  }, 1000);
});

// Recebe histórico
socket.on('history', (messages) => {
  console.log('Histórico do chat:', messages);
});

// Recebe novas mensagens
socket.on('message', (msg) => {
  console.log('Nova mensagem recebida:', msg);
});

// Detecta desconexão
socket.on('disconnect', (reason) => {
  console.log('Desconectado do servidor. Motivo:', reason);
});

// Tratamento de erro
socket.on('connect_error', (err) => {
  console.error('Erro ao conectar:', err.message);
});
