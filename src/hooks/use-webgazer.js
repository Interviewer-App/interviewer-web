"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export function useWebGazer() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [gazePosition, setGazePosition] = useState(null)
  const [accuracy, setAccuracy] = useState(null)
  const gazeHistoryRef = useRef([])
  const smoothingWindowSize = 5
  const confidenceThreshold = 0.3

  // Smoothing function using moving average
  const smoothGazePosition = useCallback((newGaze) => {
    const now = Date.now()

    // Validate input
    if (!newGaze || isNaN(newGaze.x) || isNaN(newGaze.y)) {
      return gazeHistoryRef.current.length > 0
        ? gazeHistoryRef.current[gazeHistoryRef.current.length - 1]
        : { x: 0, y: 0 }
    }

    gazeHistoryRef.current.push({ ...newGaze, timestamp: now })

    // Keep only recent samples (last 300ms for better smoothing)
    gazeHistoryRef.current = gazeHistoryRef.current.filter((sample) => now - sample.timestamp < 300)

    if (gazeHistoryRef.current.length < 2) {
      return newGaze
    }

    // Use weighted average with more recent samples having higher weight
    let totalWeight = 0
    let weightedX = 0
    let weightedY = 0

    gazeHistoryRef.current.forEach((sample) => {
      const age = now - sample.timestamp
      const weight = Math.exp(-age / 150) // Slightly slower decay for smoother movement
      weightedX += sample.x * weight
      weightedY += sample.y * weight
      totalWeight += weight
    })

    return {
      x: weightedX / totalWeight,
      y: weightedY / totalWeight,
    }
  }, [])

  const loadWebGazer = useCallback(async () => {
    return new Promise((resolve, reject) => {
      if (window.webgazer) {
        resolve()
        return
      }

      const script = document.createElement("script")
      script.src = "https://webgazer.cs.brown.edu/webgazer.js"
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error("Failed to load WebGazer.js"))
      document.head.appendChild(script)
    })
  }, [])

  const initializeWebGazer = useCallback(async () => {
    if (isInitialized || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      await loadWebGazer()

      // Request higher quality camera stream
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280, min: 640 },
            height: { ideal: 720, min: 480 },
            frameRate: { ideal: 30, min: 15 },
            facingMode: "user",
          },
        })
        stream.getTracks().forEach((track) => track.stop())
      } catch (permissionError) {
        throw new Error("Camera permission denied. Please allow camera access and try again.")
      }

      await Promise.race([
        new Promise((resolve, reject) => {
          window.webgazer
            .setRegression("ridge") // Use ridge regression for better accuracy
            .setTracker("TFFacemesh") // Use TensorFlow face mesh tracker
            .setGazeListener((data, timestamp) => {
              if (data && data.x !== null && data.y !== null && !isNaN(data.x) && !isNaN(data.y)) {
                // Don't clamp coordinates - we need raw data for out-of-bounds detection
                const rawX = data.x
                const rawY = data.y

                // Apply smoothing to raw coordinates
                const smoothed = smoothGazePosition({ x: rawX, y: rawY })

                // Calculate confidence based on face detection
                let confidence = 1.0
                try {
                  const tracker = window.webgazer?.getTracker?.()
                  if (tracker && tracker.getCurrentPrediction) {
                    const prediction = tracker.getCurrentPrediction()
                    confidence = prediction?.faceInViewConfidence || 0.8
                  }
                } catch (e) {
                  // Fallback confidence
                  confidence = 0.8
                }

                setGazePosition({
                  x: smoothed.x,
                  y: smoothed.y,
                  confidence: confidence,
                })
              }
            })
            .begin()
            .then(() => {
              // Configure WebGazer for better accuracy
              window.webgazer.params.showVideo = false
              window.webgazer.params.showFace = false
              window.webgazer.params.showFacePoints = false
              window.webgazer.params.showGazeDot = false

              // Hide UI elements
              setTimeout(() => {
                const video = document.getElementById("webgazerVideoFeed")
                const canvas = document.getElementById("webgazerFaceOverlay")
                const faceOverlay = document.getElementById("webgazerFaceFeedbackBox")

                if (video) video.style.display = "none"
                if (canvas) canvas.style.display = "none"
                if (faceOverlay) faceOverlay.style.display = "none"
              }, 100)

              setIsInitialized(true)
              resolve()
            })
            .catch(reject)
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("WebGazer initialization timeout")), 15000),
        ),
      ])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to initialize eye tracking"
      setError(errorMessage)
      console.error("WebGazer initialization error:", err)
    } finally {
      setIsLoading(false)
    }
  }, [isInitialized, isLoading, loadWebGazer, smoothGazePosition])

  const cleanup = useCallback(() => {
    if (window.webgazer && isInitialized) {
      window.webgazer.end()
      setIsInitialized(false)
      setGazePosition(null)
      gazeHistoryRef.current = []
    }
  }, [isInitialized])

  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  return {
    isInitialized,
    isLoading,
    error,
    gazePosition,
    accuracy,
    initializeWebGazer,
    cleanup,
  }
}
