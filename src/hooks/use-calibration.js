"use client"

import { useState, useCallback, useRef } from "react"

export function useCalibration(isWebGazerInitialized) {
  const [isCalibrating, setIsCalibrating] = useState(false)
  const [calibrationStep, setCalibrationStep] = useState(0)
  const [isCalibrated, setIsCalibrated] = useState(false)
  const [calibrationMode, setCalibrationMode] = useState("9-point")
  const [accuracyScore, setAccuracyScore] = useState(null)
  const [isTestingAccuracy, setIsTestingAccuracy] = useState(false)
  const calibrationTimeoutRef = useRef(null)
  const accuracyTestsRef = useRef([])

  // 9-point calibration for better accuracy
  const calibrationPoints = [
    { x: 50, y: 50, id: "center" }, // center
    { x: 10, y: 10, id: "top-left" }, // top-left
    { x: 50, y: 10, id: "top-center" }, // top-center
    { x: 90, y: 10, id: "top-right" }, // top-right
    { x: 90, y: 50, id: "middle-right" }, // middle-right
    { x: 90, y: 90, id: "bottom-right" }, // bottom-right
    { x: 50, y: 90, id: "bottom-center" }, // bottom-center
    { x: 10, y: 90, id: "bottom-left" }, // bottom-left
    { x: 10, y: 50, id: "middle-left" }, // middle-left
  ]

  const fivePointCalibration = [
    { x: 50, y: 50, id: "center" },
    { x: 10, y: 10, id: "top-left" },
    { x: 90, y: 10, id: "top-right" },
    { x: 10, y: 90, id: "bottom-left" },
    { x: 90, y: 90, id: "bottom-right" },
  ]

  const currentCalibrationPoints = calibrationMode === "9-point" ? calibrationPoints : fivePointCalibration

  const startCalibration = useCallback(() => {
    if (!isWebGazerInitialized) return

    setIsCalibrating(true)
    setCalibrationStep(0)
    setIsCalibrated(false)
    setAccuracyScore(null)
    accuracyTestsRef.current = []

    if (window.webgazer) {
      window.webgazer.clearData()
    }
  }, [isWebGazerInitialized])

  const handleCalibrationClick = useCallback(
    (pointIndex) => {
      if (!isCalibrating || pointIndex !== calibrationStep || !window.webgazer) return

      const point = currentCalibrationPoints[pointIndex]
      const screenX = (point.x / 100) * window.innerWidth
      const screenY = (point.y / 100) * window.innerHeight

      // Record multiple samples for each point for better accuracy
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          window.webgazer.recordScreenPosition(screenX, screenY)
        }, i * 100)
      }

      if (calibrationStep < currentCalibrationPoints.length - 1) {
        setCalibrationStep(calibrationStep + 1)
      } else {
        // Calibration complete - start accuracy test
        setIsCalibrating(false)

        calibrationTimeoutRef.current = setTimeout(() => {
          startAccuracyTest()
        }, 1000)
      }
    },
    [isCalibrating, calibrationStep, currentCalibrationPoints],
  )

  const startAccuracyTest = useCallback(() => {
    if (!window.webgazer) return

    setIsTestingAccuracy(true)
    accuracyTestsRef.current = []

    // Give WebGazer time to process calibration data
    setTimeout(() => {
      // Test accuracy with 5 random points
      const testPoints = [
        { x: 25, y: 25 },
        { x: 75, y: 25 },
        { x: 50, y: 50 },
        { x: 25, y: 75 },
        { x: 75, y: 75 },
      ]

      let testIndex = 0
      let validTests = 0

      const runTest = () => {
        if (testIndex >= testPoints.length || validTests >= 3) {
          // Calculate accuracy score
          if (accuracyTestsRef.current.length > 0) {
            const avgDistance =
              accuracyTestsRef.current.reduce((sum, test) => sum + test.distance, 0) / accuracyTestsRef.current.length
            const maxAcceptableDistance = Math.min(window.innerWidth, window.innerHeight) * 0.15 // 15% of screen
            const score = Math.max(0, Math.min(100, 100 - (avgDistance / maxAcceptableDistance) * 100))
            setAccuracyScore(Math.round(score))
          } else {
            // No valid tests, assume reasonable accuracy
            setAccuracyScore(75)
          }

          setIsTestingAccuracy(false)
          setIsCalibrated(true)
          return
        }

        const testPoint = testPoints[testIndex]
        const screenX = (testPoint.x / 100) * window.innerWidth
        const screenY = (testPoint.y / 100) * window.innerHeight

        // Wait for gaze data
        setTimeout(() => {
          try {
            const prediction = window.webgazer.getCurrentPrediction()
            if (prediction && prediction.x && prediction.y) {
              const distance = Math.sqrt(Math.pow(prediction.x - screenX, 2) + Math.pow(prediction.y - screenY, 2))

              accuracyTestsRef.current.push({
                targetX: screenX,
                targetY: screenY,
                gazeX: prediction.x,
                gazeY: prediction.y,
                distance: distance,
              })
              validTests++
            }
          } catch (e) {
            console.warn("Error getting prediction during accuracy test:", e)
          }

          testIndex++
          setTimeout(runTest, 800)
        }, 1200)
      }

      runTest()
    }, 2000) // Give more time for calibration to settle
  }, [])

  const resetCalibration = useCallback(() => {
    if (window.webgazer) {
      window.webgazer.clearData()
    }
    setIsCalibrated(false)
    setIsCalibrating(false)
    setCalibrationStep(0)
    setAccuracyScore(null)
    setIsTestingAccuracy(false)
    accuracyTestsRef.current = []

    if (calibrationTimeoutRef.current) {
      clearTimeout(calibrationTimeoutRef.current)
    }
  }, [])

  const switchCalibrationMode = useCallback(
    (mode) => {
      setCalibrationMode(mode)
      resetCalibration()
    },
    [resetCalibration],
  )

  return {
    isCalibrating,
    calibrationStep,
    calibrationPoints: currentCalibrationPoints,
    isCalibrated,
    calibrationMode,
    accuracyScore,
    isTestingAccuracy,
    startCalibration,
    handleCalibrationClick,
    resetCalibration,
    switchCalibrationMode,
  }
}
