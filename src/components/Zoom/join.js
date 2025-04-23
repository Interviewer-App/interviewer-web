'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Script from 'next/script';

const ZoomMeeting = () => {
  const [isZoomReady, setIsZoomReady] = useState(false);
  const [isZoomLoaded, setIsZoomLoaded] = useState(false);
  const [ZoomMtg, setZoomMtg] = useState(null);

  // First, we'll load the Zoom scripts using Next.js Script component
  // This ensures they load in the right order and properly in the client
  useEffect(() => {
    if (typeof window !== 'undefined' && !isZoomLoaded) {
      setIsZoomLoaded(true);
    }
  }, [isZoomLoaded]);

  // Handle actual Zoom initialization once scripts are loaded
  useEffect(() => {
    if (!isZoomReady || !isZoomLoaded) return;

    const startZoom = async () => {
      const meetConfig = {
        sdkKey: 'eKAdUX2TJWSsRS9s2pISA',
        sdkSecret: '6HNobch79kBBz1E57EpEToRd8envqb2C',
        meetingNumber: '99488065055',
        passWord: '2343242',
        userName: 'Your User',
        userEmail: '',
        leaveUrl: 'http://localhost:3000/',
        role: 1
      };

      try {
        // Generate signature
        ZoomMtg.generateSDKSignature({
          meetingNumber: meetConfig.meetingNumber,
          sdkKey: meetConfig.sdkKey,
          sdkSecret: meetConfig.sdkSecret,
          role: meetConfig.role,
          success: function(res) {
            console.log('Signature generated successfully');
            
            // Init with the generated signature
            ZoomMtg.init({
              debug: true,
              leaveUrl: meetConfig.leaveUrl,
              disableCORP: true,
              isSupportAV: true,
              success: () => {
                console.log('Zoom initialized successfully');
                
                // Join the meeting
                ZoomMtg.join({
                  signature: res.result,
                  sdkKey: meetConfig.sdkKey,
                  meetingNumber: meetConfig.meetingNumber,
                  passWord: meetConfig.passWord,
                  userName: meetConfig.userName,
                  userEmail: meetConfig.userEmail,
                  success: () => {
                    console.log('Joined meeting successfully');
                  },
                  error: (error) => {
                    console.error('Failed to join meeting:', error);
                  }
                });
              },
              error: (error) => {
                console.error('Failed to initialize Zoom:', error);
              }
            });
          },
          error: function(error) {
            console.error('Failed to generate signature:', error);
          }
        });
      } catch (error) {
        console.error('Error in Zoom initialization:', error);
      }
    };

    startZoom();

    // Clean up
    return () => {
      if (ZoomMtg) {
        try {
          ZoomMtg.leaveMeeting({});
        } catch (e) {
          console.log('Cleanup error:', e);
        }
      }
    };
  }, [isZoomReady, isZoomLoaded, ZoomMtg]);

  // This handles importing and setting up the Zoom SDK
  const handleZoomScriptsLoaded = () => {
    if (typeof window !== 'undefined') {
      import('@zoomus/websdk').then(({ ZoomMtg }) => {
        ZoomMtg.setZoomJSLib('https://source.zoom.us/2.18.0/lib', '/av');
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareWebSDK();
        setZoomMtg(ZoomMtg);
        setIsZoomReady(true);
      }).catch(error => {
        console.error('Failed to import Zoom SDK:', error);
      });
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <h1 className="text-2xl font-bold p-4">Zoom Meeting</h1>
      
      {/* External Scripts needed for Zoom */}
      <Script 
        src="https://source.zoom.us/2.18.0/lib/vendor/react.min.js" 
        strategy="beforeInteractive"
        onLoad={() => console.log('React loaded')}
      />
      <Script 
        src="https://source.zoom.us/2.18.0/lib/vendor/react-dom.min.js" 
        strategy="beforeInteractive"
        onLoad={() => console.log('ReactDOM loaded')}
      />
      <Script 
        src="https://source.zoom.us/2.18.0/lib/vendor/redux.min.js" 
        strategy="beforeInteractive"
        onLoad={() => console.log('Redux loaded')}
      />
      <Script 
        src="https://source.zoom.us/2.18.0/lib/vendor/redux-thunk.min.js" 
        strategy="beforeInteractive"
        onLoad={() => console.log('Redux-Thunk loaded')}
      />
      <Script 
        src="https://source.zoom.us/2.18.0/zoom-meeting-2.18.0.min.js"
        strategy="afterInteractive" 
        onLoad={handleZoomScriptsLoaded}
      />
      
      {!isZoomReady && (
        <div className="flex items-center justify-center flex-1">
          <p className="text-lg">Loading Zoom components...</p>
        </div>
      )}
      
      <div id="zmmtg-root"></div>
    </div>
  );
};

export default ZoomMeeting;