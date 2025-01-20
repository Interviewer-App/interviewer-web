'use client'
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';
import socket from "../../lib/utils/socket";


const VideoCall = ({ sessionId }) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState([]);
    const peers = useRef({});
  
    useEffect(() => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          setLocalStream(stream);
          // Attach stream to local video element
        })
        .catch(error => console.error('Error accessing media devices.', error));
  
    //   socket.emit('joinSession', sessionId);
  
      socket.on('connectPeer', ({userId, sessionId}) => {
        const peer = new Peer({ initiator: true, trickle: false, stream: localStream });
        peers.current[sessionId] = peer;
        peer.on('signal', data => {
          socket.emit('signal', { to: sessionId, data });
        });
        peer.on('stream', stream => {
          setRemoteStreams(prevStreams => [...prevStreams, stream]);
        });
      });
  
      socket.on('signal', ({ from, data }) => {
        peers.current[from] && peers.current[from].signal(data);
      });
    }, [sessionId]);
  
    return (
      <div>
        <video srcObject={localStream} autoPlay muted></video>
        {remoteStreams.map(stream => (
          <video srcObject={stream} autoPlay key={stream.id}></video>
        ))}
      </div>
    );
};

export default VideoCall;