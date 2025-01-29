import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import io from 'socket.io-client';

const VideoCall = ({ sessionId, isCandidate }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_API_URL_SOCKET);

    const startCall = async () => {
      debugger
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;

        const peerInstance = new Peer({ secure: true });
        setPeer(peerInstance);

        peerInstance.on('open', (id) => {
          socket.current.emit('join-video-session', { sessionId, peerId: id });
        });

        peerInstance.on('call', (call) => {
          call.answer(stream);
          call.on('stream', (remoteStream) => {
            setRemoteStream(remoteStream);
            remoteVideoRef.current.srcObject = remoteStream;
          });
        });

        socket.current.on('peer-joined', ({ joinedSessionId, peerId }) => {
          debugger
          if (sessionId === joinedSessionId && peerInstance) {
            const call = peerInstance.call(peerId, stream);
            call.on('stream', (remoteStream) => {
              setRemoteStream(remoteStream);
              remoteVideoRef.current.srcObject = remoteStream;
            });
          }
        });
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    startCall();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (peer) {
        peer.destroy();
      }
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [sessionId]);

  return (
    <div>
      <h1>{isCandidate ? 'Candidate' : 'Company'} Video Call</h1>
      <video ref={localVideoRef} autoPlay muted />
      <video ref={remoteVideoRef} autoPlay />
    </div>
  );
};

export default VideoCall;