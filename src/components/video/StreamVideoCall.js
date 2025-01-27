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
} from '@stream-io/video-react-sdk';
import { initializeStreamClient } from '@/lib/api/streamClient';
import { getSession } from 'next-auth/react';

export const StreamVideoCall = ({ callId }) => {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  

  useEffect(() => {
    const setupCall = async () => {
        debugger
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
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <div className="video-container">
          <div className="local-preview">
            <VideoPreview />
          </div>
          
          <div className="remote-participants">
            <RemoteParticipants />
          </div>
          <CallControls />
        </div>
      </StreamCall>
    </StreamVideo>
  );
};

const RemoteParticipants = () => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  return (
    <>
      {participants.map((participant) => (
        <ParticipantView
          key={participant.sessionId}
          participant={participant}
        />
      ))}
    </>
  );
};