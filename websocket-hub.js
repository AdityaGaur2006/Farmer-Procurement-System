const crypto = require('node:crypto');

function createWebSocketHub() {
  const clients = new Set();
  function frame(message) {
    const body = Buffer.from(JSON.stringify(message));
    if (body.length > 125) throw new Error('Realtime message is too large');
    return Buffer.concat([Buffer.from([0x81, body.length]), body]);
  }
  function accept(request, socket) {
    const key = request.headers['sec-websocket-key'];
    if (!key) { socket.destroy(); return; }
    const acceptKey = crypto.createHash('sha1').update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`).digest('base64');
    socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${acceptKey}\r\n\r\n`);
    clients.add(socket);
    socket.on('close', () => clients.delete(socket));
    socket.on('error', () => clients.delete(socket));
  }
  function broadcast(type, payload) {
    const message = frame({ type, payload, emittedAt: new Date().toISOString() });
    for (const socket of clients) { if (!socket.destroyed) socket.write(message); }
  }
  return { accept, broadcast };
}

module.exports = { createWebSocketHub };
