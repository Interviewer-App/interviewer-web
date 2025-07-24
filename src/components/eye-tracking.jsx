"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Eye,
  Camera,
  Target,
  AlertCircle,
  CheckCircle2,
  Zap,
  TriangleAlert,
} from "lucide-react";
import { useWebGazer } from "@/hooks/use-webgazer";
import { useCalibration } from "@/hooks/use-calibration";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { AccuracyTips } from "./accuracy-tips";
import InterviewRoomPage from "./interview-room/InterviewRoomComponent";
import { Badge } from "./ui/badge";
import { usePathname } from "next/navigation";
import socket from "@/lib/utils/socket";

export default function EyeTracking({ sessionId }) {
  const pathname = usePathname();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showTestDot, setShowTestDot] = useState(false);
  const [isLookingOutOfBounds, setIsLookingOutOfBounds] = useState(false);
  const [outOfBoundsAlert, setOutOfBoundsAlert] = useState(false);
  const [alertSensitivity, setAlertSensitivity] = useState(50); // pixels margin
  // const [sessionId, setSessionId] = useState(null);

  const {
    isInitialized,
    isLoading,
    error,
    gazePosition,
    initializeWebGazer,
    cleanup,
  } = useWebGazer();

  const {
    isCalibrating,
    calibrationStep,
    calibrationPoints,
    isCalibrated,
    calibrationMode,
    accuracyScore,
    isTestingAccuracy,
    startCalibration,
    handleCalibrationClick,
    resetCalibration,
    switchCalibrationMode,
  } = useCalibration(isInitialized);

  const enterFullscreen = useCallback(async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        // Fullscreen not supported, continue without it
        console.warn("Fullscreen API not supported");
        setIsFullscreen(true); // Treat as fullscreen for UI purposes
      }
      setShowInstructions(false);
    } catch (err) {
      console.warn(
        "Fullscreen request failed, continuing without fullscreen:",
        err
      );
      // Continue without fullscreen - don't block the experience
      setIsFullscreen(true); // Treat as fullscreen for UI purposes
      setShowInstructions(false);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
      setIsFullscreen(false);
      setShowInstructions(true);
    } catch (err) {
      console.warn("Failed to exit fullscreen:", err);
      // Force exit by resetting state
      setIsFullscreen(false);
      setShowInstructions(true);
    }
  }, []);

  // useEffect(() => {
  //   const unwrapParams = async () => {
  //     const resolvedParams = await params;
  //     setSessionId(resolvedParams.id);
  //   };
  //   unwrapParams();
  // }, [params]);

  const handleStart = async () => {
    try {
      await initializeWebGazer();
      // Try fullscreen, but don't fail if it doesn't work
      await enterFullscreen();
    } catch (err) {
      console.error("Failed to start eye tracking:", err);
      // If WebGazer fails, show error, but if only fullscreen fails, continue
      if (err instanceof Error && err.message.includes("WebGazer")) {
        // WebGazer initialization failed, this is a real error
        return;
      }
      // Otherwise, continue without fullscreen
      setIsFullscreen(true);
      setShowInstructions(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      if (!isCurrentlyFullscreen && isFullscreen) {
        // User exited fullscreen (e.g., pressed ESC)
        setIsFullscreen(false);
        setShowInstructions(true);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isFullscreen) {
        exitFullscreen();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen, exitFullscreen]);

  const handleForceShowDot = useCallback(() => {
    setShowTestDot(true);
    setTimeout(() => setShowTestDot(false), 3000);
  }, []);

  // Function to play alert sound
  const playAlertSound = useCallback(() => {
    try {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // 800Hz tone
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn("Could not play alert sound:", error);
    }
  }, []);

  // Monitor gaze position for out-of-bounds detection
  useEffect(() => {
    if (!gazePosition || !isCalibrated || isCalibrating || isTestingAccuracy) {
      return;
    }

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const margin = alertSensitivity; // Use configurable sensitivity

    const isOutOfBounds =
      gazePosition.x < -margin ||
      gazePosition.x > screenWidth + margin ||
      gazePosition.y < -margin ||
      gazePosition.y > screenHeight + margin;

    // Debug logging
    console.log("Gaze Position:", {
      x: gazePosition.x,
      y: gazePosition.y,
      screenWidth,
      screenHeight,
      margin,
      isOutOfBounds,
      leftBound: -margin,
      rightBound: screenWidth + margin,
      topBound: -margin,
      bottomBound: screenHeight + margin,
    });

    if (isOutOfBounds && !isLookingOutOfBounds) {
      console.log("TRIGGERING OUT OF BOUNDS ALERT!");
      setIsLookingOutOfBounds(true);
      setOutOfBoundsAlert(true);
      playAlertSound(); // Play sound when going out of bounds
      socket.emit('offScreenUpdate', { sessionId: sessionId, isOffScreen: outOfBoundsAlert });
      
      // Auto-hide alert after 3 seconds
      setTimeout(() => {
        socket.emit('offScreenUpdate', { sessionId: sessionId, isOffScreen: outOfBoundsAlert });
        setOutOfBoundsAlert(false);
      }, 3000);
    } else if (!isOutOfBounds && isLookingOutOfBounds) {
      console.log("Back in bounds");
      setIsLookingOutOfBounds(false);
    }
  }, [
    gazePosition,
    isCalibrated,
    isCalibrating,
    isTestingAccuracy,
    isLookingOutOfBounds,
    playAlertSound,
    alertSensitivity,
  ]);

  if (showInstructions && !isFullscreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-black to-[#1B1D22]">
        <Card className="w-full max-w-2xl bg-[#1B1D22] border-gray-500/40">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-white">
              Eye Tracking Setup
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              We'll use eye tracking to enhance your interview experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                Setup Steps:
              </h3>
              <ol className="space-y-2 text-sm text-muted-foreground ml-7">
                <li>1. Allow webcam access when prompted by your browser.</li>
                <li>
                  2. The system may ask to enter fullscreen mode - this is
                  optional, but recommended.
                </li>
                <li>
                  3. Complete a quick 5-point calibration by clicking each red
                  dot on the screen.
                </li>
                <li>
                  4. Once done, a blue dot will appear and follow your gaze in
                  real time.
                </li>
                <li>
                  5. To exit tracking at any time, click the Exit button or
                  press the ESC key.
                </li>
              </ol>
            </div>

            <Alert className=" bg-yellow-700/10 border-yellow-500/40 text-white">
              <TriangleAlert className="h-4 w-4 !text-white" />
              <AlertDescription>
                Your privacy is protected - all video data is processed locally
                and never leaves your browser.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleStart}
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Initializing...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Start Eye Tracking
                  </>
                )}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        <AccuracyTips />
      </div>
    );
  }

  if (isFullscreen) {
    return (
      <div
        className={cn(
          "fixed inset-0 text-white bg-transparent overflow-hidden",
          !document.fullscreenElement && isFullscreen && "relative min-h-screen"
        )}
      >
        {/* Header Controls */}
        {/* <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Badge
              variant={isInitialized ? "default" : "secondary"}
              className="bg-blue-600"
            >
              <Eye className="w-3 h-3 mr-1" />
              {isInitialized ? "Tracking Active" : "Initializing..."}
            </Badge>

            {isCalibrated && (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Calibrated
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (document.fullscreenElement) {
                  exitFullscreen();
                } else {
                  setIsFullscreen(false);
                  setShowInstructions(true);
                }
              }}
              className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              {document.fullscreenElement ? "Exit Fullscreen" : "Exit Tracking"}
            </Button>
          </div>
        </div> */}

        {/* Out of Bounds Alert */}
        {/* {outOfBoundsAlert && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <Alert className="bg-red-900/90 border-red-600 text-white shadow-lg animate-pulse">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <AlertDescription className="text-lg font-semibold">
                ⚠️ Please look at the screen!
              </AlertDescription>
            </Alert>
          </div>
        )} */}

        {/* Out of Bounds Visual Border */}
        {/* {isLookingOutOfBounds && (
          <div className="absolute inset-0 z-30 pointer-events-none">
            <div className="w-full h-full border-4 border-red-500 animate-pulse shadow-[inset_0_0_50px_rgba(239,68,68,0.5)]" />
          </div>
        )} */}

        {/* Gaze Position Debug Info */}
        {/* {gazePosition && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 flex gap-2">
            <Badge
              variant="outline"
              className="bg-gray-800 border-gray-600 text-white"
            >
              Gaze: ({Math.round(gazePosition.x)}, {Math.round(gazePosition.y)})
            </Badge>
            {gazePosition.confidence && (
              <Badge
                variant="outline"
                className={cn(
                  "bg-gray-800 border-gray-600",
                  gazePosition.confidence > 0.7
                    ? "text-green-400"
                    : gazePosition.confidence > 0.4
                    ? "text-yellow-400"
                    : "text-red-400"
                )}
              >
                Confidence: {Math.round(gazePosition.confidence * 100)}%
              </Badge>
            )}
            {accuracyScore !== null && (
              <Badge
                variant="outline"
                className={cn(
                  "bg-gray-800 border-gray-600",
                  accuracyScore > 80
                    ? "text-green-400"
                    : accuracyScore > 60
                    ? "text-yellow-400"
                    : "text-red-400"
                )}
              >
                <Zap className="w-3 h-3 mr-1" />
                Accuracy: {accuracyScore}%
              </Badge>
            )}
            <Badge
              variant="outline"
              className={cn(
                "bg-gray-800 border-gray-600",
                isLookingOutOfBounds
                  ? "text-red-400 animate-pulse"
                  : "text-green-400"
              )}
            >
              {isLookingOutOfBounds ? "OUT OF BOUNDS" : "IN BOUNDS"}
            </Badge>
          </div>
        )} */}

        {/* Calibration Instructions */}
        {(isCalibrating || isTestingAccuracy) && (
          <>
            {isTestingAccuracy && (
              <div
                className="absolute w-8 h-8 bg-yellow-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none shadow-lg shadow-yellow-500/50 animate-pulse border-2 border-white"
                style={{
                  left: "50%",
                  top: "50%",
                }}
              />
            )}
            <div className="absolute top-[16.892vh] left-1/2 transform -translate-x-1/2 z-40 text-center">
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  {isCalibrating && (
                    <>
                      <p className="text-white mb-2">
                        {calibrationMode.toUpperCase()} Calibration - Step{" "}
                        {calibrationStep + 1} of {calibrationPoints.length}
                      </p>
                      <p className="text-gray-300 text-sm">
                        Look at the red dot and click it to calibrate
                      </p>
                    </>
                  )}
                  {isTestingAccuracy && (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2" />
                      <p className="text-white mb-2">Testing Accuracy...</p>
                      <p className="text-gray-300 text-sm">
                        Please look at the center of the screen
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Calibration Button */}
        {isInitialized &&
          !isCalibrating &&
          !isCalibrated &&
          !isTestingAccuracy && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
              <Card className="bg-[#1B1D22] border-gray-500/40">
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Ready to Calibrate
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Choose your calibration mode for better accuracy
                  </p>

                  {/* <div className="flex gap-2 mb-4">
                    <Button
                      variant={
                        calibrationMode === "5-point" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => switchCalibrationMode("5-point")}
                      className={
                        calibrationMode === "5-point"
                          ? ""
                          : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      }
                    >
                      5-Point (Fast)
                    </Button>
                    <Button
                      variant={
                        calibrationMode === "9-point" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => switchCalibrationMode("9-point")}
                      className={
                        calibrationMode === "9-point"
                          ? ""
                          : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      }
                    >
                      9-Point (Accurate)
                    </Button>
                  </div> */}

                  <Button
                    onClick={startCalibration}
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Start Calibration
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

        {/* Recalibrate Button */}
        {/* {isCalibrated && !isCalibrating && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40">
            <Button
              variant="outline"
              onClick={resetCalibration}
              className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              <Target className="w-4 h-4 mr-2" />
              Recalibrate
            </Button>
          </div>
        )} */}

        {/* Calibration Dots */}
        {isCalibrating &&
          calibrationPoints.map((point, index) => (
            <button
              key={index}
              className={cn(
                "absolute w-6 h-6 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-300",
                index === calibrationStep
                  ? "bg-red-500 animate-pulse scale-125 shadow-lg shadow-red-500/50"
                  : "bg-red-300 scale-75 opacity-50"
              )}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
              }}
              onClick={() => handleCalibrationClick(index)}
              disabled={index !== calibrationStep}
            />
          ))}

        {/* Gaze Tracking Dot */}
        {gazePosition &&
          isCalibrated &&
          !isCalibrating &&
          !isTestingAccuracy && (
            <>
              {/* Main gaze dot */}
              {/* <div
                className="absolute w-6 h-6 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none shadow-lg shadow-blue-500/50 border-2 border-white"
                style={{
                  left: `${gazePosition.x}px`,
                  top: `${gazePosition.y}px`,
                }}
              />
              {/* Glow effect
              <div
                className="absolute w-12 h-12 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none opacity-30 animate-pulse"
                style={{
                  left: `${gazePosition.x}px`,
                  top: `${gazePosition.y}px`,
                }}
              /> */}
              <InterviewRoomPage id={sessionId} />
            </>
          )}

        {/* Debug info for gaze position */}
        {/* {gazePosition && (
          <div className="absolute bottom-20 left-4 z-40 bg-gray-800 p-2 rounded text-xs text-white">
            <div>
              Raw Position: ({Math.round(gazePosition.x)},{" "}
              {Math.round(gazePosition.y)})
            </div>
            <div>
              Screen Size: {window.innerWidth} x {window.innerHeight}
            </div>
            <div>
              Bounds: X({-alertSensitivity} to{" "}
              {window.innerWidth + alertSensitivity}) Y({-alertSensitivity} to{" "}
              {window.innerHeight + alertSensitivity})
            </div>
            <div>Calibrated: {isCalibrated ? "Yes" : "No"}</div>
            <div>Calibrating: {isCalibrating ? "Yes" : "No"}</div>
            <div>Testing: {isTestingAccuracy ? "Yes" : "No"}</div>
            <div
              className={cn(
                "font-semibold",
                isLookingOutOfBounds ? "text-red-400" : "text-green-400"
              )}
            >
              Out of Bounds: {isLookingOutOfBounds ? "YES" : "NO"}
            </div>
            <div className="text-yellow-400">Margin: {alertSensitivity}px</div>
          </div>
        )} */}

        {/* Instructions Overlay */}
        {/* {isCalibrated && !isCalibrating && (
          <div className="absolute bottom-4 right-4 z-40 space-y-2">
            <Card className="bg-gray-800/90 border-gray-600">
              <CardContent className="p-3">
                <p className="text-white text-sm">
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  Blue dot follows your gaze
                </p>
                <p className="text-gray-300 text-xs mt-1">
                  Press ESC to exit fullscreen
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/90 border-gray-600">
              <CardContent className="p-3">
                <p className="text-white text-sm mb-2">Alert Sensitivity</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-300">Strict</span>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={alertSensitivity}
                    onChange={(e) =>
                      setAlertSensitivity(Number(e.target.value))
                    }
                    className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none slider"
                  />
                  <span className="text-xs text-gray-300">Loose</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {alertSensitivity}px margin
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsLookingOutOfBounds(true);
                    setOutOfBoundsAlert(true);
                    playAlertSound();
                    setTimeout(() => {
                      setOutOfBoundsAlert(false);
                      setIsLookingOutOfBounds(false);
                    }, 3000);
                  }}
                  className="mt-2 w-full bg-orange-600 text-white hover:bg-orange-700"
                >
                  Test Alert
                </Button>
              </CardContent>
            </Card>
          </div>
        )} */}
        {/* Debug Panel */}
        {/* <DebugPanel
          gazePosition={gazePosition}
          isCalibrated={isCalibrated}
          isCalibrating={isCalibrating}
          isTestingAccuracy={isTestingAccuracy}
          accuracyScore={accuracyScore}
          onForceShowDot={handleForceShowDot}
        /> */}

        {/* Test Dot */}
        {showTestDot && (
          <div
            className="absolute w-8 h-8 bg-yellow-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none shadow-lg shadow-yellow-500/50 animate-pulse border-2 border-white"
            style={{
              left: "50%",
              top: "50%",
            }}
          />
        )}
      </div>
    );
  }

  return null;
}
