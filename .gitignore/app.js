const Peer = require('peerjs');
const uid = require('uid');
const $ = require('jquery');
const openStream = require('./openStream');
const playVideo = require('./playVideo');
const getIceObject = require('./getIceObject');
const io = require('socket.io-client');
const socket = io('http://localhost:3000');

getIceObject(iceConfig => {
    const connectionObj = {
        host: 'stream2905.herokuapp.com',
        port: 443,
        secure: true,
        key: 'peerjs',
        config: iceConfig
    };
    const peerID = getPeer();
    socket.emit('NEW_PEER_ID', peerID);
    const peer = new Peer(peerID, connectionObj);

    $('#ulPeerId').on('click', 'li', function() {
        const peerId = $(this).text();
        console.log(peerId);
        openStream(stream => {
            playVideo(stream, 'localStream');
            const call = peer.call(peerId, stream);
            call.on('stream', remoteStream => playVideo(remoteStream, 'friendStream'));
        });
    });

    peer.on('call', call => {
        openStream(stream => {
            console.log('123123123')
            playVideo(stream, 'localStream');
            call.answer(stream);
            call.on('stream', remoteStream => playVideo(remoteStream, 'friendStream'));
        });
    });

});

function getPeer() {
    const id = uid(10);
    $('#peer-id').append(id);
    return id;
}

socket.on('ONLINE_PEER_ARRAY', arrPeerId => {
    arrPeerId.forEach(id => {
        $('#ulPeerId').append(`<li id="${id}">${id}</li>`);
    });
});

socket.on('NEW_CLIENT_CONNECT', id => $('#ulPeerId').append(`<li id="${id}">${id}</li>`));

socket.on('CLIENT_DISCONNECT', peerId => $(`#${peerId}`).remove());


