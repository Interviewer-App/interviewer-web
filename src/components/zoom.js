'use client';
import { useEffect, useRef, useState } from 'react';

// Ensure React is available globally for Zoom SDK
if (typeof window !== 'undefined') {
  window.React = require('react');
  window.ReactDOM = require('react-dom');
}

const ZoomWrapper = () => {
  const meetingContainer = useRef(null);
  const [zoomError, setZoomError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const zoomClient = useRef(null);

  useEffect(() => {
    let script;
    const loadZoomSDK = () => {
      return new Promise((resolve, reject) => {
        if (window.ZoomMtgEmbedded) {
          resolve();
          return;
        }

        script = document.createElement('script');
        script.id = 'zoom-sdk-script';
        script.src = 'https://source.zoom.us/zoom-meeting-embedded-2.17.0.min.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Zoom SDK'));
        document.head.appendChild(script);
      });
    };

    const initializeZoom = async () => {
      try {
        if (!window.ZoomMtgEmbedded) {
          throw new Error('Zoom SDK not loaded');
        }

        // Create client instance
        zoomClient.current = window.ZoomMtgEmbedded.createClient();
        
        // Initialize SDK
        await zoomClient.current.init({
          zoomAppRoot: meetingContainer.current,
          language: 'en-US',
          customize: {
            video: {
              popper: { disableDraggable: true }
            }
          }
        });

        // Join meeting
        await zoomClient.current.join({
          sdkKey: 'eKAdUX2TJWSsRS9s2pISA',
          signature: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBLZXkiOiJlS0FkVVgyVEpXU3NSUzlzMnBJU0EiLCJzZGtLZXkiOiJlS0FkVVgyVEpXU3NSUzlzMnBJU0EiLCJtbiI6IjEyMzEyNDEyNDEyNCIsInJvbGUiOjEsInRva2VuRXhwIjoxNzQ1MDQwMzkxLCJpYXQiOjE3NDUwMzY3OTEsImV4cCI6MTc0NTA0MDM5MX0.8m8ggCEmpN30P0YIM7wBfX73eTXZEj9pNJ7wtvHfmqESL4hW7nkWAqJoCeRd0GD4Q',
          meetingNumber: '123124124124',
          password: '1234',
          userName: 'UshanAdhi'
        });

      } catch (error) {
        console.error('Zoom error:', error);
        setZoomError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const setupZoom = async () => {
      try {
        setIsLoading(true);
        await loadZoomSDK();
        await initializeZoom();
      } catch (error) {
        console.error('Setup error:', error);
        setZoomError(error.message);
        setIsLoading(false);
      }
    };

    setupZoom();

    return () => {
      // Cleanup Zoom client
      if (zoomClient.current) {
        zoomClient.current.leave();
        zoomClient.current.destroy();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[80vh]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
        </div>
      )}

      {zoomError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-4 text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Zoom Error
          </h3>
          <p className="text-gray-600 mb-4">{zoomError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <div ref={meetingContainer} className="w-full h-full bg-gray-100" />
    </div>
  );
};

export default ZoomWrapper;