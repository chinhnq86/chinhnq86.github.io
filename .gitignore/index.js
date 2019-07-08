const io = require('socket.io') (3000);

const arrPeerId = [];

io.on('connection', socket => {
    socket.emit('ONLINE_PEER_ARRAY', arrPeerId);

    socket.on('NEW_PEER_ID', peerId => {
        socket.peerId = peerId;
        arrPeerId.push(peerId);
        io.emit('NEW_CLIENT_CONNECT', peerId);
    });

    socket.on('disconnect', () => {
        const index = arrPeerId.indexOf(socket.peerId);
        arrPeerId.splice(index, 1);
        io.emit('CLIENT_DISCONNECT', socket.peerId);
    });
});