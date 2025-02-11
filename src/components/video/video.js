import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import Peer from "peerjs";
import io from "socket.io-client";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  ScreenShareOff,
  Settings,
  Link2,
  PhoneOff,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import socketChat from "@/lib/utils/socket";

const VideoCall = forwardRef(({ sessionId, isCandidate , senderId , role}, ref) => {
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
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0); // State to track unread messages

  useEffect(() => {
    // Scroll to the bottom of the chat when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);




  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_API_URL_SOCKET);

    const startCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        originalVideoTrack.current = stream.getVideoTracks()[0];
        originalAudioTrack.current = stream.getAudioTracks()[0];
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;

        const peerInstance = new Peer({ secure: true });
        setPeer(peerInstance);

        peerInstance.on("open", (id) => {
          socket.current.emit("join-video-session", { sessionId, peerId: id });
        });

        peerInstance.on("call", (call) => {
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            setRemoteStream(remoteStream);
            remoteVideoRef.current.srcObject = remoteStream;
          });
          call.on("close", () => {
            activeCalls.current = activeCalls.current.filter((c) => c !== call);
          });

          activeCalls.current.push(call);
        });

        socket.current.on("peer-joined", ({ joinedSessionId, peerId }) => {
          if (sessionId === joinedSessionId && peerInstance) {
            const call = peerInstance.call(peerId, stream);
            call.on("stream", (remoteStream) => {
              setRemoteStream(remoteStream);
              remoteVideoRef.current.srcObject = remoteStream;
            });
            call.on("close", () => {
              activeCalls.current = activeCalls.current.filter(
                (c) => c !== call
              );
            });
            activeCalls.current.push(call);
          }
        });
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    startCall();

    return () => {
      if (originalVideoTrack.current) originalVideoTrack.current.stop();
      if (originalAudioTrack.current) originalAudioTrack.current.stop();
      if (peer) peer.destroy();
      if (socket.current) socket.current.disconnect();

      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
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
      activeCalls.current.forEach((call) => call.close());
    };
  }, [sessionId]);


  useEffect(() => {
      socketChat.on('receiveMessage', (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
        if (!isChatOpen) {
          // Increment unread count only if the chat is not open
          setUnreadCount((prevCount) => prevCount + 1);
        }
      });

      return () => {
        socketChat.off('receiveMessage');
      };
  }, [isChatOpen]);



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
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenVideoTrack = screenStream.getVideoTracks()[0];
        const newStream = new MediaStream([
          originalAudioTrack.current,
          screenVideoTrack,
        ]);

        setLocalStream(newStream);
        localVideoRef.current.srcObject = newStream;

        // Update active calls with proper null checks
        activeCalls.current.forEach((call) => {
          if (call.peerConnection) {
            // Add null check here
            const videoSender = call.peerConnection
              .getSenders()
              .find((s) => s.track?.kind === "video");
            if (videoSender && screenVideoTrack) {
              videoSender.replaceTrack(screenVideoTrack);
            }
          }
        });

        screenVideoTrack.onended = () => {
          const revertStream = new MediaStream([
            originalAudioTrack.current,
            originalVideoTrack.current,
          ]);
          setLocalStream(revertStream);
          localVideoRef.current.srcObject = revertStream;

          // Update active calls with proper null checks
          activeCalls.current.forEach((call) => {
            if (call.peerConnection) {
              // Add null check here
              const videoSender = call.peerConnection
                .getSenders()
                .find((s) => s.track?.kind === "video");
              if (videoSender && originalVideoTrack.current) {
                videoSender.replaceTrack(originalVideoTrack.current);
              }
            }
          });
          setIsScreenSharing(false);
        };

        setIsScreenSharing(true);
      } catch (error) {
        console.error("Error sharing screen:", error);
      }
    } else {
      const screenVideoTrack = localStream?.getVideoTracks()[0];
      if (screenVideoTrack) screenVideoTrack.stop();

      const revertStream = new MediaStream([
        originalAudioTrack.current,
        originalVideoTrack.current,
      ]);
      setLocalStream(revertStream);
      localVideoRef.current.srcObject = revertStream;

      // Update active calls with proper null checks
      activeCalls.current.forEach((call) => {
        if (call.peerConnection) {
          // Add null check here
          const videoSender = call.peerConnection
            .getSenders()
            .find((s) => s.track?.kind === "video");
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
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    if (peer) {
      peer.destroy();
    }

    if (socket.current) {
      socket.current.disconnect();
    }

    activeCalls.current.forEach((call) => call.close());

    if (isCandidate) {
      router.push("/my-interviews");
      // window.location.href = '/my-interviews';
    }
  };

  useImperativeHandle(ref, () => ({
    endCall: handleEndCall,
  }));

  const handleChatButtonClick = () => {
    setIsChatOpen(!isChatOpen);
    setUnreadCount(0); 
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        sessionId,
        message: newMessage,
        senderId,
        senderRole: isCandidate ? 'CANDIDATE' : 'COMPANY',    
      };
      socketChat.emit('sendMessage', messageData);
      // setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage('');
    }
  };

  return (
    <div className=" bg-black relative h-full max-h-lvh w-auto">
      {/* Timer */}
      <div className="absolute top-4 left-4 text-white z-10">
        <span className="font-medium">{formatTime(callDuration)}</span>
      </div>

      {/* Video containers */}
      <div className=" flex items-center h-full justify-center">
        <div className=" h-full w-full flex items-center justify-center bg-black">
          <video
            ref={remoteVideoRef}
            autoPlay
            className="h-full w-auto  object-contain"
          />
        </div>
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
            variant={isMicOn ? "default" : "destructive"}
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
            variant={isCameraOn ? "default" : "destructive"}
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
            variant={isScreenSharing ? "destructive" : "default"}
            size="icon"
            onClick={toggleScreenShare}
          >
            {isScreenSharing ? (
              <ScreenShareOff className="h-5 w-5" />
            ) : (
              <ScreenShare className="h-5 w-5" />
            )}
          </Button>

          <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
            {/* Chat Button */}
            <SheetTrigger asChild>
              <Button onClick={handleChatButtonClick} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white">
                <MessageCircle className="h-5 w-5"/>
                {unreadCount > 0 && (
          <span
            className="absolute top-4 right-30 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
            style={{ fontSize: "10px" }}
          >
            {unreadCount}
          </span>
        )}
              </Button>
            </SheetTrigger>

            {/* Chat Sheet Content */}
            <SheetContent side="right" className="w-full sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-xl font-bold text-gray-800">Chat</SheetTitle>
              </SheetHeader>

              {/* Message Display */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.senderRole === role ? 'justify-end' : 'justify-start'
                      }`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${msg.senderRole === role ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                        }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      {/* <p className="text-xs text-gray-400 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p> */}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef}></div> {/* Auto-scroll anchor */}
              </div>

              {/* Message Input */}
              <SheetFooter className="p-4 border-t">
                <div className="flex gap-2 w-full">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-600">
                    Send
                  </Button>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>


          {isCandidate && (
            <Button
              variant="destructive"
              size="icon"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleEndCall}
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

    </div>
  );
});
VideoCall.displayName = "VideoCall";

export default VideoCall;
