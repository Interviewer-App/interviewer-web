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
import socket from "../../../../lib/utils/socket";
import { useSession } from "next-auth/react";
import { getAutomatedTranscript } from "@/lib/api/interview-session";
import CodeEditor from "@/components/CodeEditor/CodeEditor";
import { useSearchParams, useRouter } from "next/navigation";



function Page() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isSubmitBtnAvailable, setIsSubmitBtnAvailable] = useState(true);
  const [questionType, setQuestionType] = useState("TECHNICAL_OPEN_ENDED"); // or "CODING"
  const [question, setQuestion] = useState({});
  const [questionCountDown, setQuestionCountDown] = useState(120); // Default 2 minutes, will be updated based on question.estimatedTimeMinutes
  const [text, setText] = useState(
    " Hello! I am a robot that can speak. Click on me to hear what I have to say."
  );
  const questionTimerRef = useRef(null);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [showRecordingControls, setShowRecordingControls] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSavingRecording, setIsSavingRecording] = useState(false);
  const [hasWebcamAccess, setHasWebcamAccess] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const [isVideoElementMounted, setIsVideoElementMounted] = useState(false);
  const [hasMicAccess, setHasMicAccess] = useState(false);
  const [micError, setMicError] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(1200); // 20 minutes in seconds
  const [dialog, setDialog] = useState([]);
  const [sessionId, setSessionId] = useState(
    searchParams.get("sessionID") || null
  );
  const timerRef = useRef(null);
  // const [questionType, setQuestionType] = useState("TECHNICAL_CODING");
  // Create a ref for the video element
  const videoRef = useRef(null);

  // Mock interview and candidate IDs - replace with actual values from your auth system
  const [interviewId] = useState("interview_" + Date.now());
  const [candidateId] = useState("candidate_" + Date.now());
  const [automaticinterviewEnded, setAutomaticInterviewEnded] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    setElapsedTime(question.estimatedTimeMinutes * 60); // Convert minutes to seconds
  }, [question]);

  useEffect(() => {
    const fetchAutomatedTranscript = async () => {
      try {
        const response = await getAutomatedTranscript(sessionId);
        if (response.data) {
          setDialog(response.data.transcript);
        }
      } catch (err) {
        if (err.response) {
          const { data } = err.response;

          if (data && data.message) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: `Transcription History Fetching Faild: ${data.message}`,
              action: <ToastAction altText="Try again">Try again</ToastAction>,
            });
          } else {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "An unexpected error occurred. Please try again.",
              action: <ToastAction altText="Try again">Try again</ToastAction>,
            });
          }
        } else {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "An unexpected error occurred. Please check your network and try again.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      }
    };

    if (sessionId) fetchAutomatedTranscript();
  }, [sessionId]);

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

    // Clear timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (questionTimerRef.current) {
      clearTimeout(questionTimerRef.current);
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
      } finally {
        // Clear recording state
        router.push("/");
      }

    }, 2000);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Question countdown timer with auto-submit
  useEffect(() => {
    if (questionCountDown > 0 && !interviewEnded) {
      questionTimerRef.current = setTimeout(() => {
        setQuestionCountDown((prev) => prev - 1);
      }, 1000);
    } else if (questionCountDown === 0 && !interviewEnded) {
      // Auto-submit when countdown reaches 0
      handleSubmit();
    }

    return () => {
      if (questionTimerRef.current) {
        clearTimeout(questionTimerRef.current);
      }
    };
  }, [questionCountDown, interviewEnded]);

  // Reset question countdown when a new question is received
  useEffect(() => {
    const latestQuestion = dialog
      .slice()
      .reverse()
      .find((entry) => entry.role === "interviewer" && entry.questionId);

    if (latestQuestion) {
      // Use question's estimated time (convert minutes to seconds) or default to 2 minutes
      const timeInSeconds = question.estimatedTimeMinutes ? question.estimatedTimeMinutes * 60 : 120;
      setQuestionCountDown(timeInSeconds);
    }
  }, [dialog, question.estimatedTimeMinutes]);

  // Update countdown timer when question changes (separate from dialog changes)
  useEffect(() => {
    if (question.estimatedTimeMinutes) {
      const timeInSeconds = question.estimatedTimeMinutes * 60;
      setQuestionCountDown(timeInSeconds);
    }
  }, [question]);

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
    // Get sessionId from searchParams
    // const sessionId = searchParams.get('sessionID');

    // Find the latest question in the dialog to get the currentQuestionId
    const latestQuestion = dialog
      .slice()
      .reverse()
      .find((entry) => entry.role === "interviewer" && entry.questionId);

    const currentQuestionId = latestQuestion ? latestQuestion.questionId : null;

    if (!sessionId || !currentQuestionId) {
      console.error("Missing sessionId or currentQuestionId");
      return;
    }

    // Create new dialog entry for the candidate's answer
    const newDialogEntry = {
      role: "candidate",
      content: transcript || "No answer provided (time expired)",
    };

    // Update dialog state
    setDialog((prev) => [...prev, newDialogEntry]);

    // Emit the answer to the server via socket.io
    socket.emit("submitAutomatedInterviewAnswer", {
      sessionId,
      questionId: currentQuestionId,
      answer: transcript || "No answer provided (time expired)",
    });

    // Clear the transcript and reset countdown
    setTranscript("");
    // Reset countdown based on question's estimated time or default to 2 minutes
    const timeInSeconds = question.estimatedTimeMinutes ? question.estimatedTimeMinutes * 60 : 120;
    setQuestionCountDown(timeInSeconds);
  };

  const handleSkip = async () => {
    // const sessionId = searchParams.get('sessionID');

    // Find the latest question in the dialog to get the currentQuestionId
    const latestQuestion = dialog
      .slice()
      .reverse()
      .find((entry) => entry.role === "interviewer" && entry.questionId);

    const currentQuestionId = latestQuestion ? latestQuestion.questionId : null;

    if (!sessionId || !currentQuestionId) {
      console.error("Missing sessionId or currentQuestionId");
      return;
    }

    // Create new dialog entry for the candidate's answer
    const newDialogEntry = {
      role: "candidate",
      content: "skip this question",
    };

    // Update dialog state
    setDialog((prev) => [...prev, newDialogEntry]);

    // Emit the answer to the server via socket.io
    socket.emit("submitAutomatedInterviewAnswer", {
      sessionId,
      questionId: currentQuestionId,
      answer: "skip this question",
    });

    // Clear the transcript and reset countdown
    setTranscript("");
    // Reset countdown based on question's estimated time or default to 2 minutes
    const timeInSeconds = question.estimatedTimeMinutes ? question.estimatedTimeMinutes * 60 : 120;
    setQuestionCountDown(timeInSeconds);
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

  // useEffect(() => {
  //   const data ={
  //     candidateId : session.user.candidateID,
  //     sessionId : searchParams.get('sessionID'),
  //   }
  //   // socket.emit('startAutomatedInterview', data);
  //   console.log('candidateId', data.candidateId);
  //   console.log('sessionId', data.sessionId);
  // }
  // , []);

  // useEffect(() => {
  //   socket.on('question', (data) => {
  //     console.log("Received question data:", data);
  //   });
  // }, []);

  return (
    <div
      className={` w-full bg-black h-dvh grid ${
        questionType === "technical-coding" ? "grid-cols-1" : "grid-cols-3"
      }`}
    >
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
                      <Download className="w-3 h-3" />dialog
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
      {questionType !== "technical-coding" ? (
        <>
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
            <div className="h-[50%] w-full relative mb-10">
              <div className="h-full w-full p-4 overflow-y-scroll">
                <div className="bg-gradient-to-b from-[#000000] to-[#00000010] h-[30px] w-full absolute top-0 left-0"></div>
                {dialog.length === 0 ? (
                  <div className="mb-8">
                    <h1 className="text-blue-500/70 font-bold mb-1">
                      AI Interviewer
                    </h1>
                    <p className="text-gray-300/80">
                      Waiting for the interview to start...
                    </p>
                  </div>
                ) : (
                  dialog.map((entry, index) => (
                    <div key={index} className="mb-8">
                      <h1 className="text-blue-500/70 font-bold mb-1">
                        {entry.role === "interviewer"
                          ? "AI Interviewer"
                          : "You"}
                      </h1>
                      <p className="text-gray-300/80">{entry.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
            {isListening && (
              <div className=" recording-indicator bg-red-500/20 text-red-500 border border-red-700 font-semibold px-20 py-3 flex justify-center items-center rounded-lg mb-4">
                <div className=" h-3 aspect-square rounded-full animate-pulse bg-red-500 mr-2"></div>
                <p>Recording your answer...</p>
              </div>
            )}

            {/* Question Countdown Timer */}
            {/* <div className="flex justify-center items-center mb-4">
              <div className={`px-6 py-3 rounded-lg font-bold text-lg ${
                questionCountDown <= 30
                  ? 'bg-red-500/20 text-red-500 border border-red-700'
                  : questionCountDown <= 60
                  ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-700'
                  : 'bg-blue-500/20 text-blue-500 border border-blue-700'
              }`}>
                Time Remaining: {formatTime(questionCountDown)}
              </div>
            </div> */}
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
                  <button
                    onClick={handleSkip}
                    className="mt-5 mr-5 mb-24 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-6 rounded-lg"
                  >
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
        </>
      ) : (
        <>
          <CodeEditor
            question={question}
            handleSubmit={handleSubmit}
            setTranscript={setTranscript}
            isSubmitBtnAvailable={isSubmitBtnAvailable}
            sessionID={sessionId}
            socket={socket}
            time={formatTime(elapsedTime)}
            questionCountDown={questionCountDown}
            questionTimer={formatTime(questionCountDown)}
          />
        </>
      )}
      {/* Recording Preview Modal */}
      <TextToSpeech
        dialog={dialog}
        setDialog={setDialog}
        setQuestion={setQuestion}
        setQuestionType={setQuestionType}
      />
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
