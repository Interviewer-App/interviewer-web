// components/StreamVideoCall.tsx
'use client';
import { useEffect, useState } from 'react';
import {
  StreamCall,
  StreamVideo,
  useCallStateHooks,
  VideoPreview,
  ParticipantView,
  CallControls,
  StreamTheme,
  SpeakerLayout,
  CallParticipantsList,
  CallingState,
} from '@stream-io/video-react-sdk';
import { 
  useCall,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  ScreenShareButton,
  RecordCallButton,
  
} from '@stream-io/video-react-sdk';
import { initializeStreamClient } from '@/lib/api/streamClient';
import { getSession } from 'next-auth/react';

export const StreamVideoCall = ({ callId }) => {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
 


  useEffect(() => {
    const setupCall = async () => {
      const session = await getSession();
      const userId = session.user?.id; // Get from your auth system
      const client = await initializeStreamClient(userId);
      const call = client.call('default', callId);

      await call.join({ create: true });
      setClient(client);
      setCall(call);
    };

    setupCall();

    return () => {
      if (call) {
        call.leave();
      }
      if (client) {
        client.disconnectUser();
      }
    };
  }, []);

  if (!client || !call) return <div>Loading...</div>;

  return (
    <StreamVideo client={client} options={{ 
      theme: 'dark', // or 'light'
      style: {
        colors: {
          accent: 'var(--str-video__primary-color)',
          static_black: 'var(--str-video__text-color)',
          static_white: 'var(--str-video__background-color)',
        }
      }}}
>
      <StreamCall call={call}>
        <StreamTheme>
       
          <div className="remote-participants">
              <RemoteParticipants />
            </div>
          {/* <div className="video-container">
            <div className="local-preview">
              <VideoPreview />
            </div>

            <div className="remote-participants">
              <RemoteParticipants />
            </div>
            
          </div> */}
          {/* <CustomCallControls/> */}
        
              <div>
                <CallControls  onLeave={() => window.location.href = '/'}/>
                  </div>
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
};

const RemoteParticipants = () => {
  const { useParticipants  } = useCallStateHooks();
  const participants = useParticipants();
  const { useCallCallingState } = useCallStateHooks();
  const [showParticipants, setShowParticipants] = useState(false);
  const callingState = useCallCallingState();
  if (callingState !== CallingState.JOINED) {
    return <div>Loading...</div>;
  }
  return (
    <>
    {/* <CallParticipantsList onClose={() => setShowParticipants(false)} /> */}
      {participants.map((participant) => (
        <ParticipantView
          key={participant.sessionId}
          participant={participant}
        />
      ))}
    </>
  );
};


const CustomCallControls = () => {
  const call = useCall();
  const { useIsCallRecordingInProgress } = useCallStateHooks();
  const isRecording = useIsCallRecordingInProgress();

  if (!call) return null;

  return (
    <div className="custom-controls-container">
      <ToggleAudioPreviewButton 
        className="control-button"
      />
      
      <ToggleVideoPreviewButton
        className="control-button"
      />
      
      <ScreenShareButton
        className="control-button"
      />
      
      <RecordCallButton
        className="control-button"
      />
      
      {isRecording && <div className="recording-indicator">● Recording</div>}
      
      {/* <LeaveCallButton
        className="leave-button"
        onPress={() => call.leave()}
      /> */}
    </div>
  );
}