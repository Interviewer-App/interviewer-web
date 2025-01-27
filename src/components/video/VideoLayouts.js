import { useCallStateHooks, ParticipantView } from '@stream-io/video-react-sdk';

export default function VideoLayouts({ role }) {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  return (
    <div
      participantsBarPosition={role === 'company' ? 'right' : 'bottom'}
      mode={role === 'company' ? 'grid' : 'spotlight'}
    >
      {/* <Stage
        participantViewOptions={{
          menuPosition: 'bottom',
          highlightBorderColor: '#2563eb',
        }}
      /> */}
      {role === 'candidate' && (
        <div className="self-preview">
          {participants.find(p => p.isLocalParticipant) && (
            <ParticipantView 
              participant={participants.find(p => p.isLocalParticipant)}
              mode="thumbnail"
            />
          )}
        </div>
      )}
    </div>
  );
}