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
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const originalVideoTrack = useRef(null);
  const originalAudioTrack = useRef(null);
  const activeCalls = useRef([]);

  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_API_URL_SOCKET);

    // const startCall = async () => {
    //   debugger
    //   try {
    //     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    //     setLocalStream(stream);
    //     localVideoRef.current.srcObject = stream;

    //     const peerInstance = new Peer({ secure: true });
    //     setPeer(peerInstance);

    //     peerInstance.on('open', (id) => {
    //       socket.current.emit('join-video-session', { sessionId, peerId: id });
    //     });

    //     peerInstance.on('call', (call) => {
    //       call.answer(stream);
    //       call.on('stream', (remoteStream) => {
    //         setRemoteStream(remoteStream);
    //         remoteVideoRef.current.srcObject = remoteStream;
    //       });
    //     });

    //     socket.current.on('peer-joined', ({ joinedSessionId, peerId }) => {
    //       debugger
    //       if (sessionId === joinedSessionId && peerInstance) {
    //         const call = peerInstance.call(peerId, stream);
    //         call.on('stream', (remoteStream) => {
    //           setRemoteStream(remoteStream);
    //           remoteVideoRef.current.srcObject = remoteStream;
    //         });
    //       }
    //     });
    //   } catch (error) {
    //     console.error('Error accessing media devices:', error);
    //   }
    // };

    // startCall();

    // return () => {
    //   if (localStream) {
    //     localStream.getTracks().forEach((track) => track.stop());
    //   }
    //   if (peer) {
    //     peer.destroy();
    //   }
    //   if (socket.current) {
    //     socket.current.disconnect();
    //   }
    // };
    const startCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        originalVideoTrack.current = stream.getVideoTracks()[0];
        originalAudioTrack.current = stream.getAudioTracks()[0];
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
          call.on('close', () => {
            activeCalls.current = activeCalls.current.filter(c => c !== call);
          });
          
          activeCalls.current.push(call);
        });

        socket.current.on('peer-joined', ({ joinedSessionId, peerId }) => {
          if (sessionId === joinedSessionId && peerInstance) {
            const call = peerInstance.call(peerId, stream);
            call.on('stream', (remoteStream) => {
              setRemoteStream(remoteStream);
              remoteVideoRef.current.srcObject = remoteStream;
            });
            call.on('close', () => {
              activeCalls.current = activeCalls.current.filter(c => c !== call);
            });
            activeCalls.current.push(call);
          }
        });
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    startCall();

    return () => {
      if (originalVideoTrack.current) originalVideoTrack.current.stop();
      if (originalAudioTrack.current) originalAudioTrack.current.stop();
      if (peer) peer.destroy();
      if (socket.current) socket.current.disconnect();
    };
  }, [sessionId]);


  const toggleMic = () => {
    if (originalAudioTrack.current) {
      originalAudioTrack.current.enabled = !originalAudioTrack.current.enabled;
      setIsMicOn(originalAudioTrack.current.enabled);
    }
  };

  const toggleCamera = () => {
    if (isScreenSharing) return;
    if (originalVideoTrack.current) {
      originalVideoTrack.current.enabled = !originalVideoTrack.current.enabled;
      setIsCameraOn(originalVideoTrack.current.enabled);
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenVideoTrack = screenStream.getVideoTracks()[0];
        const newStream = new MediaStream([originalAudioTrack.current, screenVideoTrack]);
        
        setLocalStream(newStream);
        localVideoRef.current.srcObject = newStream;
  
        // Update active calls with proper null checks
        activeCalls.current.forEach(call => {
          if (call.peerConnection) { // Add null check here
            const videoSender = call.peerConnection.getSenders()
              .find(s => s.track?.kind === 'video');
            if (videoSender && screenVideoTrack) {
              videoSender.replaceTrack(screenVideoTrack);
            }
          }
        });
  
        screenVideoTrack.onended = () => {
          const revertStream = new MediaStream([originalAudioTrack.current, originalVideoTrack.current]);
          setLocalStream(revertStream);
          localVideoRef.current.srcObject = revertStream;
          
          // Update active calls with proper null checks
          activeCalls.current.forEach(call => {
            if (call.peerConnection) { // Add null check here
              const videoSender = call.peerConnection.getSenders()
                .find(s => s.track?.kind === 'video');
              if (videoSender && originalVideoTrack.current) {
                videoSender.replaceTrack(originalVideoTrack.current);
              }
            }
          });
          setIsScreenSharing(false);
        };
  
        setIsScreenSharing(true);
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    } else {
      const screenVideoTrack = localStream?.getVideoTracks()[0];
      if (screenVideoTrack) screenVideoTrack.stop();
      
      const revertStream = new MediaStream([originalAudioTrack.current, originalVideoTrack.current]);
      setLocalStream(revertStream);
      localVideoRef.current.srcObject = revertStream;
      
      // Update active calls with proper null checks
      activeCalls.current.forEach(call => {
        if (call.peerConnection) { // Add null check here
          const videoSender = call.peerConnection.getSenders()
            .find(s => s.track?.kind === 'video');
          if (videoSender && originalVideoTrack.current) {
            videoSender.replaceTrack(originalVideoTrack.current);
          }
        }
      });
      
      setIsScreenSharing(false);
    }
  };

  return (
    <div>
    <h1>{isCandidate ? 'Candidate' : 'Company'} Video Call</h1>
    
    <video ref={localVideoRef} autoPlay muted />
    <video ref={remoteVideoRef} autoPlay />

    <div className="controls">
      <button onClick={toggleMic}>
        {isMicOn ? 'Mute Mic' : 'Unmute Mic'}
      </button>
      <button 
        onClick={toggleCamera} 
        disabled={isScreenSharing}
      >
        {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
      </button>
      <button onClick={toggleScreenShare}>
        {isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
      </button>
    </div>
  </div>
  );
};

export default VideoCall;