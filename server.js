const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// Rooms object to keep track of connected clients
const rooms = {};

wss.on('connection', (ws) => {
    let roomId = null;

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        switch (data.type) {
            case 'join':
                // Handle joining a room
                roomId = data.roomId;
                if (!rooms[roomId]) {
                    rooms[roomId] = [];
                }
                rooms[roomId].push(ws);
                break;
            case 'signal':
                // Relay signaling data to other peers
                rooms[roomId].forEach(client => {
                    if (client !== ws) {
                        client.send(JSON.stringify(data));
                    }
                });
                break;
            case 'chat':
                // Relay chat messages to other peers
                rooms[roomId].forEach(client => {
                    if (client !== ws) {
                        client.send(JSON.stringify(data));
                    }
                });
                break;
        }
    });

    ws.on('close', () => {
        // Remove client from room on disconnect
        if (roomId && rooms[roomId]) {
            rooms[roomId] = rooms[roomId].filter(client => client !== ws);
            if (rooms[roomId].length === 0) {
                delete rooms[roomId];
            }
        }
    });
});

console.log('WebSocket server is running on port 8080');
