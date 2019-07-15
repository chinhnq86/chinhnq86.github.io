import Peer from 'peerjs';
import uid from 'uid';
import $ from 'jquery';
const io = require('socket.io-client');
const socket = io('https://signalingserver0715.herokuapp.com');
const openStream = require('./openStream');
const playVideo = require('./playVideo');

//var socket = io();
//socket.on('connect', function () {
var options = {
  host:'localhost',
  port: 9000,
  path: '/myapp'
  //host: 'peerjs0715.herokuapp.com',
  //port: 9000,
  //secure: true,
  //path: '/myapp'
};
const peerId = getPeerID();
socket.emit('NEW_PEER_ID', peerId);
const peer = new Peer(peerId, options);
console.log(peer);
console.log(peerId);

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

function getPeerID(){
  const id = uid(10);
  $("#peer-id").append(id);
  return id;
}

socket.on('PEER_ARRAY', arrPeerID => {
  console.log('list of peer array: ' + arrPeerID);
  arrPeerID.forEach(id => {
    $('#ulPeerId').append(`<li id=${id}>${id}</li>`);
  });
});

socket.on('NEW_CLIENT_CONNECT', newPeerId => {
  console.log('new client connect: ' + newPeerId);
  $('#ulPeerId').append(`<li id=${newPeerId}>${newPeerId}</li>`);
});

socket.on('CLIENT_DISCONNECT', disPeerId => {
  console.log('client show disconnect pID: ' + disPeerId);
  $(`#${disPeerId}`).remove();
});
