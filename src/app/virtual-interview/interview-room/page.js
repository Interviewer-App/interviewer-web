"use client";
import React, { useState, useEffect, useRef } from "react";
import SpeechAnimation from "@/components/SpeechAnimation";
import TextToSpeech from "@/components/TextToSpeech";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import useScreenRecording from "@/hooks/useScreenRecording";
import RecordingPreviewModal from "@/components/RecordingPreviewModal";
import {
  Mic,
  Pause,
  RefreshCw,
  Video,
  VideoOff,
  Download,
  Save,
  Camera,
  CameraOff,
} from "lucide-react";

function Page() {
  const [isSubmitBtnAvailable, setIsSubmitBtnAvailable] = useState(true);
  const [questionType, setQuestionType] = useState("OPEN_ENDED"); // or "CODING"
  const [question, setQuestion] = useState({
    questionText: "What is your opinion on the current state of AI?",
    estimatedTimeMinutes: 2,
  });
  const [questionCountDown, setQuestionCountDown] = useState(120); // 2 minutes in seconds
  const [text, setText] = useState(
    " Hello! I am a robot that can speak. Click on me to hear what I have to say."
  );
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [showRecordingControls, setShowRecordingControls] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSavingRecording, setIsSavingRecording] = useState(false);
  const [hasWebcamAccess, setHasWebcamAccess] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const [isVideoElementMounted, setIsVideoElementMounted] = useState(false);
  const [hasMicAccess, setHasMicAccess] = useState(false);
  const [micError, setMicError] = useState(null);

  // Create a ref for the video element
  const videoRef = useRef(null);

  // Mock interview and candidate IDs - replace with actual values from your auth system
  const [interviewId] = useState("interview_" + Date.now());
  const [candidateId] = useState("candidate_" + Date.now());

  const {
    isListening,
    transcript,
    recordingComplete,
    startListening,
    stopListening,
    setTranscript,
  } = useSpeechRecognition({ continuous: true });

  const {
    isRecording,
    recordedBlob,
    error: recordingError,
    permissionGranted,
    requestPermission,
    startRecording,
    stopRecording,
    downloadRecording,
    saveRecording,
    getRecordingUrl,
    clearRecording,
  } = useScreenRecording();

  // Handle saving recording with loading state
  const handleSaveRecording = async () => {
    if (!recordedBlob) return;

    setIsSavingRecording(true);
    try {
      await saveRecording(interviewId, candidateId);
      alert("Recording saved successfully!");
    } catch (error) {
      console.error("Failed to save recording:", error);
      alert("Failed to save recording. Please try downloading it instead.");
    } finally {
      setIsSavingRecording(false);
    }
  };

  // Request screen recording permission when component mounts
  // useEffect(() => {
  //   const initializeRecording = async () => {
  //     try {
  //       await requestPermission();
  //       // Auto-start recording after permission is granted
  //       setTimeout(() => {
  //         startRecording();
  //       }, 1000);
  //     } catch (error) {
  //       console.error('Failed to initialize screen recording:', error);
  //     }
  //   };

  //   initializeRecording();
  // }, [requestPermission, startRecording]);

  // Initialize webcam when component mounts
  useEffect(() => {
    console.log("WebCam initialization useEffect triggered");
    let isMounted = true; // Flag to track if component is mounted
    let stream = null; // Track the stream for cleanup

    // Simpler and more reliable implementation for webcam access
    const initializeWebcam = async () => {
      console.log("Initializing webcam access");
      // Reset states
      setWebcamError(null);

      // Check if component is still mounted
      if (!isMounted) return;

      // Wait for video element to be available with a safety timeout
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max

      while (!videoRef.current && attempts < maxAttempts) {
        console.log(
          `Waiting for video element, attempt ${attempts + 1}/${maxAttempts}`
        );
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }

      // Verify video element is available
      if (!videoRef.current) {
        console.error("Video element not available after waiting");
        setWebcamError(
          "Could not initialize video element. Please refresh the page."
        );
        return;
      }

      console.log(
        "Video element is now available, proceeding with webcam access"
      );

      try {
        console.log(
          "Requesting camera and microphone access with standard constraints"
        );
        // Standard constraints for better browser compatibility - now including audio
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
          },
          audio: true, // Enable audio capture
        });

        // Check if component is still mounted after async call
        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          console.log("Component unmounted during access, cleaned up stream");
          return;
        }

        if (videoRef.current) {
          console.log("Setting video source with stream");
          videoRef.current.srcObject = stream;

          // Make sure we handle the loaded metadata event
          videoRef.current.onloadedmetadata = () => {
            console.log("Video metadata loaded successfully");
            if (isMounted && videoRef.current) {
              videoRef.current
                .play()
                .then(() => {
                  if (isMounted) {
                    setHasWebcamAccess(true);

                    // Check if we have audio tracks and set mic access status
                    const hasAudioTracks = stream.getAudioTracks().length > 0;
                    setHasMicAccess(hasAudioTracks);

                    if (hasAudioTracks) {
                      console.log("Microphone successfully initialized");
                    } else {
                      console.log("No audio tracks found in the stream");
                      setMicError("No microphone detected or access denied");
                    }

                    console.log("Webcam successfully initialized and playing");
                  }
                })
                .catch((playError) => {
                  console.error(
                    "Failed to play video after metadata loaded:",
                    playError
                  );
                  if (isMounted) {
                    setWebcamError(
                      "Failed to play video: " + playError.message
                    );
                  }
                });
            }
          };
        } else {
          throw new Error("Video element disappeared during initialization");
        }
      } catch (error) {
        console.error("Failed to access webcam or microphone:", error);
        if (isMounted) {
          // Provide a user-friendly error message
          let errorMessage = "";

          if (error.name === "NotAllowedError") {
            errorMessage =
              "Camera/microphone access denied. Please allow access in your browser settings.";
          } else if (error.name === "NotFoundError") {
            errorMessage =
              "No camera or microphone detected. Please connect devices and try again.";
          } else if (
            error.name === "NotReadableError" ||
            error.name === "AbortError"
          ) {
            errorMessage =
              "Your camera or microphone is already in use by another application.";
          } else {
            errorMessage = "Failed to access media devices: " + error.message;
          }

          setWebcamError(errorMessage);

          // Try to determine if it's specifically a microphone issue
          if (error.message && error.message.toLowerCase().includes("audio")) {
            setMicError("Microphone access failed: " + error.message);

            // If it's only a microphone issue, try to get just the camera
            tryFallbackVideoOnly();
          }
        }
      }
    };

    // Initialize webcam on component mount with a short delay
    const initTimeout = setTimeout(() => {
      initializeWebcam();
    }, 500);

    return () => {
      // Clean up on unmount or when dependencies change
      console.log("Cleaning up webcam resources");
      isMounted = false;
      clearTimeout(initTimeout);

      // Stop all tracks
      if (stream) {
        stream.getTracks().forEach((track) => {
          console.log("Stopping track:", track.kind);
          track.stop();
        });
      }

      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  // Add a retry button for manual webcam initialization if needed
  const retryWebcamAccess = () => {
    console.log("Manually retrying webcam access");
    setWebcamError(null);
    toggleWebcam();
  };

  // Function to manually toggle webcam
  const toggleWebcam = async () => {
    if (hasWebcamAccess) {
      // Turn off webcam
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => {
          console.log("Stopping track:", track.kind);
          track.stop();
        });
        videoRef.current.srcObject = null;
      }
      setHasWebcamAccess(false);
      setHasMicAccess(false);
      console.log("Webcam and microphone turned off");
    } else {
      // Turn on webcam
      try {
        setWebcamError(null);
        console.log("Attempting to turn on webcam manually");

        // Ensure video element exists with a safety check
        if (!videoRef.current) {
          console.error("Video element not available for toggle");

          // Wait briefly to see if it becomes available
          await new Promise((resolve) => setTimeout(resolve, 500));

          if (!videoRef.current) {
            setWebcamError(
              "Video element not available. Please refresh the page."
            );
            return;
          }
        }

        console.log("Video element confirmed available for toggle");

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
          },
          audio: true, // Enable audio capture
        });

        // Double check video element is still there
        if (!videoRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          setWebcamError("Video element disappeared. Please refresh the page.");
          return;
        }

        videoRef.current.srcObject = stream;

        try {
          await videoRef.current.play();
          setHasWebcamAccess(true);

          // Check for audio tracks
          const hasAudioTracks = stream.getAudioTracks().length > 0;
          setHasMicAccess(hasAudioTracks);

          if (hasAudioTracks) {
            setMicError(null);
            console.log("Microphone successfully initialized");
          } else {
            console.log("No audio tracks found in the stream");
            setMicError("No microphone detected or access denied");
          }

          console.log("Webcam turned on successfully");
        } catch (playError) {
          console.error("Failed to play video:", playError);
          setWebcamError("Failed to play video: " + playError.message);

          // Clean up the stream since we couldn't play
          stream.getTracks().forEach((track) => track.stop());
        }
      } catch (err) {
        console.error("Failed to toggle webcam on:", err);
        // Provide a user-friendly error message
        const errorMessage =
          err.name === "NotAllowedError"
            ? "Camera access denied. Please allow camera access in your browser settings."
            : err.name === "NotFoundError"
            ? "No camera detected. Please connect a camera and try again."
            : "Failed to access camera: " + err.message;

        setWebcamError(errorMessage);
      }
    }
  };

  // Function to try video-only access if microphone fails
  const tryFallbackVideoOnly = async () => {
    if (!isMounted || !videoRef.current) return;

    console.log("Trying fallback with video-only access");

    try {
      // Request only video access
      const videoOnlyStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });

      if (!isMounted || !videoRef.current) {
        videoOnlyStream.getTracks().forEach((track) => track.stop());
        return;
      }

      videoRef.current.srcObject = videoOnlyStream;
      await videoRef.current.play();

      setHasWebcamAccess(true);
      setHasMicAccess(false);
      setMicError("Microphone access failed, but camera is working");
      console.log("Fallback: Video-only access successful");
    } catch (fallbackError) {
      console.error("Video-only fallback also failed:", fallbackError);
    }
  };

  // Handle interview end
  const handleEndInterview = async () => {
    setInterviewEnded(true);

    // Stop speech recognition if active
    if (isListening) {
      stopListening();
    }

    // Stop screen recording
    if (isRecording) {
      stopRecording();
    }

    // Stop webcam and microphone if active
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      setHasWebcamAccess(false);
      setHasMicAccess(false);
    }

    // Wait a moment for recording to finalize
    setTimeout(async () => {
      try {
        // Save recording to server
        await handleSaveRecording();
      } catch (error) {
        console.error("Failed to save recording:", error);
        alert(
          "Interview ended but failed to save recording. You can download it manually."
        );
      }
    }, 2000);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0"); // Two-digit minutes
    const secs = (seconds % 60).toString().padStart(2, "0"); // Two-digit seconds
    return `${minutes}:${secs}`;
  };

  const handleAnswerChange = (e) => {
    setTranscript(e.target.value);
    // socket.emit("typingUpdate", {
    //   sessionId: question.sessionID,
    //   text: e.target.value,
    // });
  };

  const handleSubmit = async () => {
    // const session = await getSession();
    // const role = session?.user?.role;
    // const candidateId = session?.user?.candidateID;
    // // if (transcript.trim() !== "") {
    // //   setActiveStep((prevStep) => {
    // //     const nextStep = Math.min(prevStep + 1, questions.length - 1);
    // //     return nextStep;
    // //   });
    // // }
    // // const question = questions[activeStep];
    // // const questionNumber = activeStep + 1;
    // socket.emit("submitAnswer", {
    //   sessionId: question.sessionID,
    //   questionId: question.questionID,
    //   candidateId: candidateId,
    //   answerText: transcript,
    //   questionText: question.questionText,
    // });
    // stopListening();
    // setTranscript("");
    // setIsSubmitBtnAvailable(false);
  };

  // Detect when video element is mounted and set the flag
  useEffect(() => {
    console.log("Checking for video element availability");

    // Simple interval to check for the video element
    const checkInterval = setInterval(() => {
      if (videoRef.current) {
        console.log("Video element found via interval check");
        setIsVideoElementMounted(true);
        clearInterval(checkInterval);
      }
    }, 100);

    // Check immediately as well
    if (videoRef.current) {
      console.log("Video element is immediately available");
      setIsVideoElementMounted(true);
      clearInterval(checkInterval);
    }

    // Cleanup
    return () => {
      clearInterval(checkInterval);
    };
  }, []);

  return (
    <div className=" w-full h-dvh grid grid-cols-3">
      {/* Recording Status Indicator */}
      {isRecording && (
        <div className="fixed top-4 left-4 z-50 bg-red-500/20 text-red-500 border border-red-700 font-semibold px-4 py-2 flex items-center rounded-lg">
          <div className="h-3 w-3 rounded-full animate-pulse bg-red-500 mr-2"></div>
          <p>Screen Recording Active</p>
        </div>
      )}
      {/* Recording Error Display */}
      {recordingError && (
        <div className="fixed top-4 right-4 z-50 bg-red-500/20 text-red-500 border border-red-700 font-semibold px-4 py-2 rounded-lg max-w-sm">
          <p>Recording Error: {recordingError}</p>
        </div>
      )}{" "}
      {/* Webcam Status Indicator */}
      {hasWebcamAccess && (
        <div className="fixed top-16 left-4 z-50 bg-green-500/20 text-green-500 border border-green-700 font-semibold px-4 py-2 flex items-center rounded-lg">
          <div className="h-3 w-3 rounded-full animate-pulse bg-green-500 mr-2"></div>
          <p>Camera Active</p>
        </div>
      )}
      {/* Microphone Status Indicator */}
      {hasMicAccess && (
        <div className="fixed top-28 left-4 z-50 bg-green-500/20 text-green-500 border border-green-700 font-semibold px-4 py-2 flex items-center rounded-lg">
          <div className="h-3 w-3 rounded-full animate-pulse bg-green-500 mr-2"></div>
          <p>Microphone Active</p>
        </div>
      )}
      {webcamError && (
        <div className="fixed top-16 left-4 z-50 bg-red-500/20 text-red-500 border border-red-700 font-semibold px-4 py-2 flex items-center rounded-lg">
          <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
          <p>Camera Error</p>
        </div>
      )}
      {micError && (
        <div className="fixed top-28 left-4 z-50 bg-red-500/20 text-red-500 border border-red-700 font-semibold px-4 py-2 flex items-center rounded-lg">
          <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
          <p>Microphone Error</p>
        </div>
      )}
      {/* End Interview Button */}
      {!interviewEnded && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={handleEndInterview}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            End Interview
          </button>
        </div>
      )}
      {/* Recording Controls Toggle */}
      {/* <div className="fixed bottom-4 left-20 z-50 flex gap-2">
        <button
          onClick={toggleWebcam}
          className={`${
            hasWebcamAccess ? "bg-green-700" : "bg-gray-700"
          } hover:bg-opacity-80 text-white p-2 rounded-lg`}
          title={hasWebcamAccess ? "Turn off camera" : "Turn on camera"}
        >
          {hasWebcamAccess ? (
            <Camera className="w-5 h-5" />
          ) : (
            <CameraOff className="w-5 h-5" />
          )}
        </button>

        <button
          onClick={() => setShowRecordingControls(!showRecordingControls)}
          className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg"
        >
          <Video className="w-5 h-5" />
        </button>

        {showRecordingControls && (
          <div className="absolute bottom-12 left-0 bg-gray-800 border border-gray-600 rounded-lg p-4 min-w-[200px]">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-gray-300">
                Status: {isRecording ? "Recording" : "Stopped"}
              </div>
              <div className="text-sm text-gray-300">
                Permission: {permissionGranted ? "Granted" : "Not granted"}
              </div>

              <div className="flex gap-2 mt-2">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    disabled={!permissionGranted}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Start
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Stop
                  </button>
                )}

                {recordedBlob && (
                  <>
                    <button
                      onClick={() =>
                        downloadRecording(`interview-${interviewId}.webm`)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                    <button
                      onClick={() => saveRecording(interviewId, candidateId)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <Save className="w-3 h-3" />
                      Save
                    </button>
                    <button
                      onClick={() => setShowPreviewModal(true)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Preview
                    </button>
                  </>
                )}
              </div>

              {recordedBlob && (
                <div className="text-xs text-gray-400 mt-1">
                  Recording ready ({Math.round(recordedBlob.size / 1024 / 1024)}{" "}
                  MB)
                </div>
              )}
            </div>
          </div>
        )}
      </div> */}
      <div className=" relative flex flex-col justify-center items-center h-dvh p-14">
        <div className="absolute bottom-20 left-20 h-[250px] w-min-[400px] bg-slate-50 overflow-hidden rounded-lg shadow-lg">
          {/* Always render the video element but hide it when not in use */}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${
              !hasWebcamAccess ? "hidden" : ""
            }`}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={() => {
              console.log("Video element loaded metadata");
              setIsVideoElementMounted(true);
            }}
          />

          {webcamError ? (
            <div className="w-full h-full absolute inset-0 bg-red-900/30 flex items-center justify-center text-center p-4">
              <p className="text-white text-sm">
                {webcamError}
                <br />
                <button
                  onClick={toggleWebcam}
                  className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg"
                >
                  Try Again
                </button>
              </p>
            </div>
          ) : !hasWebcamAccess ? (
            <div className="w-full h-full absolute inset-0 bg-gray-800 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <button
                  onClick={toggleWebcam}
                  className="px-3 py-1 text-white rounded-lg"
                >
                  <Camera className="w-20 h-20 " />
                </button>
              </div>
            </div>
          ) : null}

          {/* Microphone status indicator in video container */}
          {hasWebcamAccess && (
            <div
              className={`absolute bottom-3 right-3 p-1.5 rounded-full ${
                hasMicAccess ? "bg-green-500/80" : "bg-red-500/80"
              }`}
            >
              {hasMicAccess ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" x2="12" y1="19" y2="22"></line>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <line x1="2" x2="22" y1="2" y2="22"></line>
                  <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"></path>
                  <path d="M5 10v2a7 7 0 0 0 12 7"></path>
                  <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"></path>
                  <path d="M9 9v3a3 3 0 0 0 5.12 2.12"></path>
                  <line x1="12" x2="12" y1="19" y2="22"></line>
                </svg>
              )}
            </div>
          )}
        </div>
      </div>
      <div className=" h-dvh flex flex-col items-center justify-center gap-4 p-14">
        <TextToSpeech text={text} />
        <SpeechAnimation />
        <div className=" flex items-center justify-center gap-3">
          {isListening ? (
            <button
              onClick={stopListening}
              className="mt-2 cursor-pointer p-5 m-auto flex items-center justify-center bg-red-800/30 border border-red-600 hover:bg-red-800/40 rounded-full focus:outline-none"
            >
              <Pause className="w-8 h-8" />
            </button>
          ) : (
            <button
              onClick={startListening}
              className="mt-2 cursor-pointer p-5 m-auto flex items-center justify-center bg-blue-800/30 border border-blue-600 hover:bg-blue-800/40 rounded-full focus:outline-none"
            >
              <Mic className="w-8 h-8" />
            </button>
          )}
        </div>
      </div>
      <div className=" flex flex-col justify-center items-center h-dvh p-14">
        <div className=" h-[50%] w-full relative mb-10">
          <div className=" h-full w-full p-4 overflow-y-scroll ">
            <div className=" bg-gradient-to-b from-[#000000] to-[#00000010] h-[100px] w-full absolute top-0 left-0"></div>
            <div className=" mb-8">
              <h1 className=" text-blue-500/70 font-bold mb-1">
                AI Interviewer
              </h1>
              <p className=" text-gray-300/80">
                Hello! Thank you for applying for the Software Engineering
                Internship. Can you briefly introduce yourself?
              </p>
            </div>
            <div className=" mb-8">
              <h1 className=" text-blue-500/70 font-bold mb-1">You</h1>
              <p className=" text-gray-300/80">
                Hi! I&apos;m Induwara, a final-year software engineering
                student. I&apos;m passionate about full-stack development and
                AI-based systems. I&apos;ve worked on a few personal and
                academic projects using React, Node.js, and Python, and I&apos;m
                currently researching recommendation engines.
              </p>
            </div>
            <div className=" mb-8">
              <h1 className=" text-blue-500/70 font-bold mb-1">
                AI Interviewer
              </h1>
              <p className=" text-gray-300/80">
                That&apos;s great! Could you tell me about a project you&apos;re
                proud of?
              </p>
            </div>
            <div className=" mb-8">
              <h1 className=" text-blue-500/70 font-bold mb-1">You</h1>
              <p className=" text-gray-300/80">
                Sure! Recently, I worked on a project called SmartGaming, a
                unified platform that combines game streaming, training,
                personalized recommendations, and secure purchasing. My role
                focused on designing and implementing a custom recommendation
                engine that uses player behavior and preferences to suggest
                games and training modules.
              </p>
            </div>
            <div className=" mb-8">
              <h1 className=" text-blue-500/70 font-bold mb-1">
                AI Interviewer
              </h1>
              <p className=" text-gray-300/80">
                Nice work! Which programming languages and tools are you most
                comfortable with?
              </p>
            </div>
            <div className=" mb-8">
              <h1 className=" text-blue-500/70 font-bold mb-1">You</h1>
              <p className=" text-gray-300/80">
                I&apos;m most comfortable with JavaScript/TypeScript, Python,
                and Java. I often use React for frontend, Node.js and Express
                for backend, and MongoDB or Firebase for databases. For version
                control, I use Git and GitHub.
              </p>
            </div>
            <div className=" mb-8">
              <h1 className=" text-blue-500/70 font-bold mb-1">
                AI Interviewer
              </h1>
              <p className=" text-gray-300/80">
                Good. Have you ever worked in a team environment? How do you
                handle collaboration?
              </p>
            </div>
            <div className=" mb-8">
              <h1 className=" text-blue-500/70 font-bold mb-1">You</h1>
              <p className=" text-gray-300/80">
                Yes, all my major projects were team-based. We used tools like
                Trello, GitHub Projects, and Slack for coordination. I always
                try to ensure open communication, give regular updates, and do
                code reviews to keep everyone on the same page.
              </p>
            </div>
            <div className=" mb-8">
              <h1 className=" text-blue-500 font-bold mb-1">AI Interviewer</h1>
              <p>
                Sounds like you have solid experience. Any questions for us?
              </p>
            </div>
          </div>
        </div>
        {isListening && (
          <div className=" recording-indicator bg-red-500/20 text-red-500 border border-red-700 font-semibold px-20 py-3 flex justify-center items-center rounded-lg mb-4">
            <div className=" h-3 aspect-square rounded-full animate-pulse bg-red-500 mr-2"></div>
            <p>Recording your answer...</p>
          </div>
        )}
        <div className="relative w-full rounded-xl h-auto border border-gray-700 text-white shadow-md">
          <div>
            <textarea
              onPaste={(e) => {
                e.preventDefault();
                return false;
              }}
              onCopy={(e) => {
                e.preventDefault();
                return false;
              }}
              value={transcript}
              onChange={handleAnswerChange}
              placeholder="Your answer here..."
              className="w-full mb-10 h-32 outline-none focus:outline-none bg-transparent border-gray-600 rounded-lg px-6 py-4 text-white"
            />
          </div>
          <div className="absolute bottom-2 right-2 flex items-center justify-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setTranscript("")}
                    className="mt-2 cursor-pointer m-auto flex items-center justify-center bg-green-800/30 border border-green-600 hover:bg-green-800/40 rounded-full h-8 aspect-square focus:outline-none"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 text-white p-2 rounded-md text-sm max-w-[200px] text-center">
                  Clear Answer
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex justify-between items-center w-full">
          {isSubmitBtnAvailable && !interviewEnded && (
            <div className=" w-full flex justify-end items-center">
              <button className="mt-5 mr-5 mb-24 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-6 rounded-lg">
                Skip
              </button>
              <button
                onClick={handleSubmit}
                disabled={!transcript}
                className="mt-5 mb-24 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-6 rounded-lg"
              >
                Submit Answer
              </button>
            </div>
          )}

          {interviewEnded && recordedBlob && (
            <div className="mt-5 mb-24 flex gap-4">
              <button
                onClick={() =>
                  downloadRecording(`interview-${interviewId}.webm`)
                }
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Recording
              </button>
              <button
                onClick={() => saveRecording(interviewId, candidateId)}
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSavingRecording ? "Saving..." : "Save to Server"}
              </button>
              <button
                onClick={() => setShowPreviewModal(true)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg"
              >
                Preview Recording
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Recording Preview Modal */}
      <RecordingPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        recordingUrl={recordedBlob ? getRecordingUrl() : null}
        onDownload={() => downloadRecording(`interview-${interviewId}.webm`)}
        onSave={handleSaveRecording}
        isLoading={isSavingRecording}
      />
    </div>
  );
}

export default Page;
