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
  MessageCircle,
  Phone,
  MessageSquare,
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
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import socketChat from "@/lib/utils/socket";

const VideoCall = forwardRef(
  ({ sessionId, isCandidate, senderId, role }, ref) => {
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
    const [newMessage, setNewMessage] = useState("");
    const [isChatOpen, setIsChatOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const [unreadCount, setUnreadCount] = useState(0); // State to track unread messages

    useEffect(() => {
      // Scroll to the bottom of the chat when new messages are added
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
            socket.current.emit("join-video-session", {
              sessionId,
              peerId: id,
            });
          });

          peerInstance.on("call", (call) => {
            call.answer(stream);
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
      socketChat.on("receiveMessage", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
        if (!isChatOpen) {
          // Increment unread count only if the chat is not open
          setUnreadCount((prevCount) => prevCount + 1);
        }
      });

      return () => {
        socketChat.off("receiveMessage");
      };
    }, [isChatOpen]);

    const toggleMic = () => {
      if (originalAudioTrack.current) {
        originalAudioTrack.current.enabled =
          !originalAudioTrack.current.enabled;
        setIsMicOn(originalAudioTrack.current.enabled);
      }
    };

    const toggleCamera = () => {
      if (isScreenSharing) return;
      if (originalVideoTrack.current) {
        originalVideoTrack.current.enabled =
          !originalVideoTrack.current.enabled;
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
    };

    const sendMessage = () => {
      if (newMessage.trim()) {
        const messageData = {
          sessionId,
          message: newMessage,
          senderId,
          senderRole: isCandidate ? "CANDIDATE" : "COMPANY",
        };
        socketChat.emit("sendMessage", messageData);
        // setMessages((prevMessages) => [...prevMessages, messageData]);
        setNewMessage("");
      }
    };

    const [isToolbarVisible, setIsToolbarVisible] = useState(false);

    useEffect(() => {
      const handleMouseMove = (e) => {
        if (window.innerHeight - e.clientY < 50) {
          setIsToolbarVisible(true);
        } else {
          setIsToolbarVisible(false);
        }
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, []);

    return (
      <div className="bg-black relative h-full max-h-lvh w-auto">
        {/* Video containers */}
        <div
          className={`${
            isCandidate ? "flex-col" : "flex-row"
          } flex items-center h-full justify-center gap-5`}
        >
          <div className="w-full flex items-center justify-center bg-black rounded-lg">
            <video
              ref={remoteVideoRef}
              autoPlay
              className="h-full w-auto object-contain rounded-lg"
            />
          </div>
          <div className="w-full flex items-center justify-center bg-black">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="h-full w-auto object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Controls bar */}
        <div
          className={`fixed z-50 bottom-0 left-0 right-0 bg-gray-900 py-4 px-4 flex justify-center gap-4 transition-transform duration-300 ${
            isToolbarVisible ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="absolute top-1/2 -translate-y-1/2 left-4 text-white z-50">
            <span className="font-medium text-xl">
              {formatTime(callDuration)}
            </span>
          </div>
          <Button
            onClick={toggleMic}
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-gray-800 hover:bg-gray-700"
          >
            {isMicOn ? (
              <Mic className="h-6 w-6" />
            ) : (
              <MicOff className="h-6 w-6" />
            )}
          </Button>
          <Button
            onClick={toggleCamera}
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-gray-800 hover:bg-gray-700"
          >
            {isCameraOn ? (
              <Video className="h-5 w-5" />
            ) : (
              <VideoOff className="h-5 w-5" />
            )}
          </Button>
          <Button
            onClick={toggleScreenShare}
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-gray-800 hover:bg-gray-700"
          >
            {isScreenSharing ? (
              <ScreenShareOff className="h-5 w-5" />
            ) : (
              <ScreenShare className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-gray-800 hover:bg-gray-700"
          >
            <Link2 className="h-6 w-6" />
          </Button>
          <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
            <SheetTrigger asChild>
              <Button
                onClick={handleChatButtonClick}
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-gray-800 hover:bg-gray-700"
              >
                <MessageCircle className="h-5 w-5" />
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

            <SheetContent
              side="right"
              className="w-full z-[9999] sm:w-[400px] h-full !text-white !bg-[#1f2126] !p-0 border-l-2 border-gray-500/20"
            >
              <SheetHeader>
                <SheetTitle className="text-xl font-bold text-gray-800 py-3 px-5 !rounded-b-lg bg-[#1f2126]">
                  Chat
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 pb-20 pt-4 overflow-y-auto overflow-x-hidden h-full w-full space-y-2 scrollbar-hidden">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.senderRole === role ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-5 py-2 mx-4 text-sm rounded-lg self-end break-all ${
                        msg.senderRole === role
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <p className="text-sm decoration-slice">{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef}></div>
              </div>

              <SheetFooter className="p-4 w-full bg-[#1f2126] absolute rounded-t-lg bottom-0 ">
                <div className="flex gap-2 w-full">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 z-[9999] text-white  rounded-lg text-sm px-4 py-1 outline-none !focus:outline-none"
                  />
                  <Button
                    onClick={sendMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-sm font-semibold"
                  >
                    Send
                  </Button>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-gray-800 hover:bg-gray-700"
          >
            <Settings className="h-6 w-6" />
          </Button>
          <Button
            onClick={handleEndCall}
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-red-700 hover:bg-red-800"
          >
            <Phone className="h-6 w-6" />
          </Button>
        </div>
      </div>
    );
  }
);
VideoCall.displayName = "VideoCall";

export default VideoCall;
