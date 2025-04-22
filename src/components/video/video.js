import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
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
  Maximize2,
  Minimize2,
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
  ({ sessionId, isCandidate, senderId, role, videoView }, ref) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [peer, setPeer] = useState(null);
    const [isMaximized, setIsMaximized] = useState(false);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isToolbarVisible, setIsToolbarVisible] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0); // State to track unread messages
    const [candidateVideoPosition, setCandidateVideoPosition] = useState({
      x: typeof window !== "undefined" ? window.innerWidth - 300 : 0,
      y: typeof window !== "undefined" ? window.innerHeight - 300 : 0,
    });
    const [interviewerVideoPosition, setInterviewerVideoPosition] = useState({
      x: typeof window !== "undefined" ? window.innerWidth - 200 : 0,
      y: typeof window !== "undefined" ? window.innerHeight - 150 : 0,
    });
    const [isDraggingCandidate, setIsDraggingCandidate] = useState(false);
    const [isDraggingInterviewer, setIsDraggingInterviewer] = useState(false);
    const [isRemoteVideoOn, setIsRemoteVideoOn] = useState(false);
    const [isRemoteAudioOn, setIsRemoteAudioOn] = useState(false);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const socket = useRef(null);
    const candidateVideoRef = useRef(null);
    const interviewerVideoRef = useRef(null);
    const messagesEndRef = useRef(null);
    const originalVideoTrack = useRef(null);
    const originalAudioTrack = useRef(null);
    const activeCalls = useRef([]);
    const dragStartPositionRef = useRef({ x: 0, y: 0 });

    const handleDragStart = useCallback(
      (e, isCandidate) => {
        e.preventDefault();

        // Get the mouse or touch position
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

        // Store the initial position
        dragStartPositionRef.current = {
          x:
            clientX -
            (isCandidate
              ? candidateVideoPosition.x
              : interviewerVideoPosition.x),
          y:
            clientY -
            (isCandidate
              ? candidateVideoPosition.y
              : interviewerVideoPosition.y),
        };

        // Set the dragging state
        if (isCandidate) {
          setIsDraggingCandidate(true);
        } else {
          setIsDraggingInterviewer(true);
        }
      },
      [candidateVideoPosition, interviewerVideoPosition]
    );

    const handleDragMove = useCallback(
      (e) => {
        if (!isDraggingCandidate && !isDraggingInterviewer) return;

        // Get the mouse or touch position
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

        // Calculate the new position
        const newX = clientX - dragStartPositionRef.current.x;
        const newY = clientY - dragStartPositionRef.current.y;

        // Apply bounds checking
        const applyBounds = (x, y, element) => {
          if (!element) return { x, y };

          const rect = element.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;

          // Ensure the element stays within the viewport
          const boundedX = Math.max(0, Math.min(x, viewportWidth - rect.width));
          const boundedY = Math.max(
            0,
            Math.min(y, viewportHeight - rect.height)
          );

          return { x: boundedX, y: boundedY };
        };

        // Update the position based on which element is being dragged
        if (isDraggingCandidate) {
          const bounded = applyBounds(newX, newY, candidateVideoRef.current);
          setCandidateVideoPosition(bounded);
        } else if (isDraggingInterviewer) {
          const bounded = applyBounds(newX, newY, interviewerVideoRef.current);
          setInterviewerVideoPosition(bounded);
        }
      },
      [isDraggingCandidate, isDraggingInterviewer]
    );

    const handleDragEnd = useCallback(() => {
      setIsDraggingCandidate(false);
      setIsDraggingInterviewer(false);
    }, []);

    useEffect(() => {
      if (typeof window !== "undefined") {
        setCandidateVideoPosition({
          x: window.innerWidth - 300,
          y: window.innerHeight - 300,
        });
        setInterviewerVideoPosition({
          x: window.innerWidth - 200,
          y: window.innerHeight - 150,
        });
      }
    }, []);

    // Add event listeners for mouse and touch events
    useEffect(() => {
      if (isDraggingCandidate || isDraggingInterviewer) {
        // Add event listeners for mouse and touch events
        window.addEventListener("mousemove", handleDragMove);
        window.addEventListener("mouseup", handleDragEnd);
        window.addEventListener("touchmove", handleDragMove);
        window.addEventListener("touchend", handleDragEnd);
      }

      return () => {
        // Clean up event listeners
        window.removeEventListener("mousemove", handleDragMove);
        window.removeEventListener("mouseup", handleDragEnd);
        window.removeEventListener("touchmove", handleDragMove);
        window.removeEventListener("touchend", handleDragEnd);
      };
    }, [
      isDraggingCandidate,
      isDraggingInterviewer,
      handleDragMove,
      handleDragEnd,
    ]);

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

    // useEffect(() => {
    //   console.log("Video available:", isRemoteVideoOn);
    // });

    useEffect(() => {
      if (remoteStream) {
        const videoTracks = remoteStream.getVideoTracks();
        if (videoTracks.length > 0) {
          const track = videoTracks[0];
          const handleTrackEnded = () => {
            setIsRemoteVideoOn(track.enabled);
          };

          track.addEventListener("enabled", handleTrackEnded);
          track.addEventListener("disabled", handleTrackEnded);

          return () => {
            track.removeEventListener("enabled", handleTrackEnded);
            track.removeEventListener("disabled", handleTrackEnded);
          };
        }
      }
    }, [remoteStream]);

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

              remoteStream.getVideoTracks().forEach((track) => {
                track.addEventListener("enabled", () =>
                  setIsRemoteVideoOn(true)
                );
                track.addEventListener("disabled", () =>
                  setIsRemoteVideoOn(false)
                );
                track.addEventListener("ended", () =>
                  setIsRemoteVideoOn(false)
                );
              });

              remoteStream.getAudioTracks().forEach((track) => {
                track.addEventListener("enabled", () =>
                  setIsRemoteAudioOn(true)
                );
                track.addEventListener("disabled", () =>
                  setIsRemoteAudioOn(false)
                );
                track.addEventListener("ended", () =>
                  setIsRemoteAudioOn(false)
                );
              });
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

          peerInstance.on("call", (call) => {
            call.answer(stream);
            call.on("stream", (remoteStream) => {
              setRemoteStream(remoteStream);
              remoteVideoRef.current.srcObject = remoteStream;
              // Check if remote stream has video tracks
              const hasVideo = remoteStream.getVideoTracks().length > 0;
              setIsRemoteVideoOn(hasVideo);
            });
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

    useImperativeHandle(ref, () => ({
      endCall: handleEndCall,
    }));

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

    return (
      <div className="bg-black relative h-full w-auto">
        {/* Video containers */}
        {isCandidate ? (
          <>
            {!videoView ? (
              <div
                className={`flex-col flex items-center justify-center gap-5`}
              >
                <div className="w-full relative flex items-center justify-center bg-gray-500 rounded-lg">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    className="h-full w-auto object-contain rounded-lg"
                  />
                  <div className="absolute bottom-1 left-1 bg-black/70 px-1 py-0.5 rounded text-xs text-white">
                    You ({isCandidate ? "Interviewer" : "Candidate"})
                  </div>
                </div>
                <div className="w-full relative flex items-center justify-center bg-black">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    className="h-full w-auto object-contain rounded-lg"
                  />
                  <div className="absolute bottom-1 left-1 bg-black/70 px-1 py-0.5 rounded text-xs text-white">
                    You ({isCandidate ? "Candidate" : "Interviewer"})
                  </div>
                </div>
              </div>
            ) : (
              <div className={`fixed inset-0 pointer-events-none z-50`}>
                <div className="w-full h-lvh relative flex items-center justify-center bg-gray-500 rounded-lg">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    className="h-full w-auto object-contain rounded-lg"
                  />
                  <div className="absolute bottom-1 left-1 bg-black/70 px-1 py-0.5 rounded text-xs text-white">
                    You ({isCandidate ? "Interviewer" : "Candidate"})
                  </div>
                </div>
                <div
                  className={`w-32 h-24 bg-black rounded-md overflow-hidden shadow-lg border border-border absolute pointer-events-auto ${
                    isDraggingInterviewer ? "cursor-grabbing" : "cursor-grab"
                  }`}
                  style={{
                    left: `${interviewerVideoPosition.x}px`,
                    top: `${interviewerVideoPosition.y}px`,
                    transition: isDraggingInterviewer
                      ? "none"
                      : "box-shadow 0.2s ease",
                    boxShadow: isDraggingInterviewer
                      ? "0 8px 16px rgba(0,0,0,0.2)"
                      : "0 4px 8px rgba(0,0,0,0.1)",
                  }}
                  onMouseDown={(e) => handleDragStart(e, false)}
                  onTouchStart={(e) => handleDragStart(e, false)}
                >
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    className="h-full w-auto object-contain rounded-md"
                  />
                  <div className="absolute bottom-1 left-1 bg-black/70 px-1 py-0.5 text-xs text-white">
                    You ({isCandidate ? "Candidate" : "Interviewer"})
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="fixed inset-0 pointer-events-none z-50">
            {/* Candidate video */}
            <div
              ref={candidateVideoRef}
              className={` ${
                isMaximized
                  ? "w-full h-full fixed"
                  : isDraggingCandidate
                  ? "cursor-grabbing w-64 h-48"
                  : "cursor-grab w-64 h-48"
              } bg-black rounded-md overflow-hidden shadow-lg border border-border absolute pointer-events-auto`}
              style={{
                left: `${!isMaximized ? candidateVideoPosition.x : 0}px`,
                top: `${!isMaximized ? candidateVideoPosition.y : 0}px`,
                transition: isDraggingCandidate
                  ? "none"
                  : "box-shadow 0.2s ease",
                boxShadow: isDraggingCandidate
                  ? "0 8px 16px rgba(0,0,0,0.2)"
                  : "0 4px 8px rgba(0,0,0,0.1)",
              }}
              onMouseDown={(e) => handleDragStart(e, true)}
              onTouchStart={(e) => handleDragStart(e, true)}
            >
              <div className="relative h-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* {isVideoOn ? (
                  <img
                    src={sessionData.candidate.avatar || "/placeholder.svg?height=192&width=256"}
                    alt="Candidate"
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <VideoOff className="h-8 w-8 mb-2" />
                    <span className="text-sm">Camera Off</span>
                  </div>
                )} */}
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    className="h-full w-auto object-contain rounded-lg"
                  />
                </div>
                <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                  {isCandidate ? "Interviewer" : "Candidate"}
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  {!isMaximized ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 bg-black/50 text-white hover:bg-black/70"
                      onClick={() => {
                        setIsMaximized(true);
                      }}
                    >
                      <Maximize2 className="h-3 w-3" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 bg-black/50 text-white hover:bg-black/70"
                      onClick={() => {
                        setIsMaximized(false);
                      }}
                    >
                      <Minimize2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Interviewer video (smaller) */}
            <div
              ref={interviewerVideoRef}
              className={`w-32 h-24 bg-black rounded-md overflow-hidden shadow-lg border border-border absolute pointer-events-auto ${
                isDraggingInterviewer ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{
                left: `${interviewerVideoPosition.x}px`,
                top: `${interviewerVideoPosition.y}px`,
                transition: isDraggingInterviewer
                  ? "none"
                  : "box-shadow 0.2s ease",
                boxShadow: isDraggingInterviewer
                  ? "0 8px 16px rgba(0,0,0,0.2)"
                  : "0 4px 8px rgba(0,0,0,0.1)",
              }}
              onMouseDown={(e) => handleDragStart(e, false)}
              onTouchStart={(e) => handleDragStart(e, false)}
            >
              <div className="relative h-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    className="h-full w-auto object-contain rounded-lg"
                  />
                  {/* {isVideoOn ? (
                  <img
                    src={sessionData.interviewer.avatar || "/placeholder.svg?height=96&width=128"}
                    alt="Interviewer"
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <VideoOff className="h-6 w-6 mb-1" />
                    <span className="text-xs">Camera Off</span>
                  </div>
                )} */}
                </div>
                <div className="absolute bottom-1 left-1 bg-black/70 px-1 py-0.5 rounded text-xs text-white">
                  You ({isCandidate ? "Candidate" : "Interviewer"})
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls bar */}
        <div
          className={`fixed z-50 bottom-0 left-0 right-0 bg-gray-900 py-4 px-4 flex justify-center gap-4 transition-transform duration-300 `}
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
