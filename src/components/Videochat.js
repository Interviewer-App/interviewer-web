"use client";

import { useRef, useState, useEffect } from "react";
import ZoomVideo, { VideoQuality } from "@zoom/videosdk"; // ✅ use ZoomVideo instead of VideoClient
import { PhoneOff } from "lucide-react";
import { Button } from "./ui/button";

const Videocall = ({ session, jwt }) => {
  const [inSession, setInSession] = useState(false);
  const client = useRef(null);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const videoContainerRef = useRef(null);

  useEffect(() => {
    client.current = ZoomVideo.createClient(); // ✅ Fixed here

    return () => {
      if (client.current) {
        client.current.leave().catch(console.error);
      }
    };
  }, []);

  const joinSession = async () => {
    try {
      await client.current.init("en-US", "Global", { patchJsMedia: true });
      client.current.on("peer-video-state-change", renderVideo);

      const userName = `User-${Date.now().toString().slice(8)}`;
      await client.current.join(session, jwt, userName);

      setInSession(true);

      const mediaStream = client.current.getMediaStream();

      try {
        await mediaStream.startAudio();
        await mediaStream.startVideo();
      } catch (mediaError) {
        console.error("Error starting media:", mediaError);
      }

      setIsAudioMuted(client.current.getCurrentUserInfo().muted);
      setIsVideoMuted(!client.current.getCurrentUserInfo().bVideoOn);

      await renderVideo({
        action: "Start",
        userId: client.current.getCurrentUserInfo().userId,
      });
    } catch (error) {
      console.error("Join session error:", error);
    }
  };

  const renderVideo = async (event) => {
    const mediaStream = client.current.getMediaStream();
    if (event.action === "Stop") {
      const element = await mediaStream.detachVideo(event.userId);
      if (Array.isArray(element)) {
        element.forEach((el) => el.remove());
      } else {
        element?.remove();
      }
    } else {
      const userVideo = await mediaStream.attachVideo(
        event.userId,
        VideoQuality.Video_360P
      );
      if (videoContainerRef.current && userVideo) {
        videoContainerRef.current.appendChild(userVideo);
      }
    }
  };

  const leaveSession = async () => {
    try {
      client.current.off("peer-video-state-change", renderVideo);
      await client.current.leave();
      window.location.href = "/";
    } catch (error) {
      console.error("Leave session error:", error);
    }
  };

  const toggleVideo = async () => {
    const mediaStream = client.current.getMediaStream();
    if (isVideoMuted) {
      await mediaStream.startVideo();
      await mediaStream.unmuteVideo();
    } else {
      await mediaStream.stopVideo();
    }
    setIsVideoMuted(!isVideoMuted);
  };

  const toggleAudio = async () => {
    const mediaStream = client.current.getMediaStream();
    if (isAudioMuted) {
      await mediaStream.unmuteAudio();
    } else {
      await mediaStream.muteAudio();
    }
    setIsAudioMuted(!isAudioMuted);
  };

  return (
    <div className="videocall-container">
      <h1>Session: {session}</h1>
      <div
        ref={videoContainerRef}
        style={{
          display: inSession ? "grid" : "none",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1rem",
          width: "100%",
          margin: "1rem 0",
        }}
      />
      {!inSession ? (
        <Button onClick={joinSession} className="join-button">
          Join Session
        </Button>
      ) : (
        <div className="controls-container">
          <Button
            onClick={toggleVideo}
            variant={isVideoMuted ? "destructive" : "default"}
          >
            {isVideoMuted ? "Start Video" : "Stop Video"}
          </Button>
          <Button
            onClick={toggleAudio}
            variant={isAudioMuted ? "destructive" : "default"}
          >
            {isAudioMuted ? "Unmute" : "Mute"}
          </Button>
          <Button onClick={leaveSession} variant="destructive">
            <PhoneOff />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Videocall;
