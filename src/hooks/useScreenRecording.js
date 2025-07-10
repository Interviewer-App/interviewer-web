'use client';

import { useState, useRef, useCallback } from 'react';

const useScreenRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [error, setError] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  // Request screen recording permission and setup
  const requestPermission = useCallback(async () => {
    try {
      setError(null);
      
      // Request screen capture
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: 'screen',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: true // Include system audio
      });

      // Request microphone access
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      // Combine screen and microphone audio
      const combinedStream = new MediaStream();
      
      // Add video track from screen
      screenStream.getVideoTracks().forEach(track => {
        combinedStream.addTrack(track);
      });

      // Add audio tracks
      screenStream.getAudioTracks().forEach(track => {
        combinedStream.addTrack(track);
      });
      
      audioStream.getAudioTracks().forEach(track => {
        combinedStream.addTrack(track);
      });

      streamRef.current = combinedStream;
      setPermissionGranted(true);
      
      // Handle stream end (when user stops sharing)
      screenStream.getVideoTracks()[0].addEventListener('ended', () => {
        stopRecording();
      });

      return combinedStream;
    } catch (err) {
      console.error('Error requesting screen recording permission:', err);
      setError(err.message);
      setPermissionGranted(false);
      throw err;
    }
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      if (!streamRef.current) {
        await requestPermission();
      }

      if (!streamRef.current) {
        throw new Error('No media stream available');
      }

      chunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm;codecs=vp9,opus' // Use VP9 for better compression
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        setIsRecording(false);
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        setError(event.error.message);
        setIsRecording(false);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setError(null);

    } catch (err) {
      console.error('Error starting recording:', err);
      setError(err.message);
      setIsRecording(false);
    }
  }, [requestPermission]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }

    // Stop all tracks to release resources
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }

    setIsRecording(false);
  }, [isRecording]);

  // Download the recorded video
  const downloadRecording = useCallback((filename = 'interview-recording.webm') => {
    if (!recordedBlob) {
      console.warn('No recording available to download');
      return;
    }

    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [recordedBlob]);

  // Save recording to server
  const saveRecording = useCallback(async (interviewId, candidateId) => {
    if (!recordedBlob) {
      throw new Error('No recording available to save');
    }

    const formData = new FormData();
    formData.append('recording', recordedBlob, `interview-${interviewId}-${Date.now()}.webm`);
    formData.append('interviewId', interviewId);
    formData.append('candidateId', candidateId);
    formData.append('timestamp', new Date().toISOString());

    try {
      const response = await fetch('/api/save-recording', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to save recording: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      console.error('Error saving recording:', err);
      throw err;
    }
  }, [recordedBlob]);

  // Get recording URL for preview
  const getRecordingUrl = useCallback(() => {
    if (!recordedBlob) return null;
    return URL.createObjectURL(recordedBlob);
  }, [recordedBlob]);

  // Clear recorded data
  const clearRecording = useCallback(() => {
    if (recordedBlob) {
      URL.revokeObjectURL(URL.createObjectURL(recordedBlob));
    }
    setRecordedBlob(null);
    setError(null);
  }, [recordedBlob]);

  return {
    isRecording,
    recordedBlob,
    error,
    permissionGranted,
    requestPermission,
    startRecording,
    stopRecording,
    downloadRecording,
    saveRecording,
    getRecordingUrl,
    clearRecording
  };
};

export default useScreenRecording;
