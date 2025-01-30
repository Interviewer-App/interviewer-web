import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import io from 'socket.io-client';
import { 
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  ScreenShareOff,
  Settings,
  Link2,
  PhoneOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const VideoCall = ({ sessionId, isCandidate  }) => {
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
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
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

      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      
      // Destroy peer instance
      if (peer) {
        peer.destroy();
      }
      
      // Disconnect socket
      if (socket.current) {
        socket.current.disconnect();
      }
      
      // Close all active calls
      activeCalls.current.forEach(call => call.close());
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

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    if (peer) {
      peer.destroy();
    }
    
    if (socket.current) {
      socket.current.disconnect();
    }
    
    activeCalls.current.forEach(call => call.close());
    
  };

  return (
<div className=" bg-gray-900 relative h-full w-auto">
      {/* Timer */}
      <div className="absolute top-4 left-4 text-white z-10">
        <span className="font-medium">{formatTime(callDuration)}</span>
      </div>

      {/* Video containers */}
      <div className=" flex items-center justify-center">
        <video
          ref={remoteVideoRef}
          autoPlay
          className="h-full w-full object-contain"
        />
        <video
          ref={localVideoRef}
          autoPlay
          muted
          className="absolute top-4 right-4 w-48 h-32 rounded-lg border-2 border-gray-200 bg-black"
        />
      </div>

      {/* Controls bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-800/80 py-4">
        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-white" />
          </Button>

          <Button variant="ghost" size="icon">
            <Link2 className="h-5 w-5 text-white" />
          </Button>

          <Button
            variant={isMicOn ? 'default' : 'destructive'}
            size="icon"
            onClick={toggleMic}
          >
            {isMicOn ? (
              <Mic className="h-5 w-5" />
            ) : (
              <MicOff className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant={isCameraOn ? 'default' : 'destructive'}
            size="icon"
            onClick={toggleCamera}
          >
            {isCameraOn ? (
              <Video className="h-5 w-5" />
            ) : (
              <VideoOff className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant={isScreenSharing ? 'destructive' : 'default'}
            size="icon"
            onClick={toggleScreenShare}
          >
            {isScreenSharing ? (
              <ScreenShareOff className="h-5 w-5" />
            ) : (
              <ScreenShare className="h-5 w-5" />
            )}
          </Button>

          {/* <Button
            variant="destructive"
            size="icon"
            className="bg-red-600 hover:bg-red-700"
            onClick={handleEndCall}

          >
            <PhoneOff className="h-5 w-5" />
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;