'use client';
import { 
  useCall,
  useCallStateHooks,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  ScreenShareButton,
  RecordCallButton,
  LeaveCallButton
} from '@stream-io/video-react-sdk';

export default function CustomCallControls() {
  const call = useCall();
  const { useIsCallRecordingInProgress } = useCallStateHooks();
  const isRecording = useIsCallRecordingInProgress();

  if (!call) return null;

  return (
    <div className="custom-controls-container">
      <ToggleAudioPreviewButton 
        className="control-button"
        onPress={() => call.microphone.toggle()}
      />
      
      <ToggleVideoPreviewButton
        className="control-button"
        onPress={() => call.camera.toggle()}
      />
      
      <ScreenShareButton
        className="control-button"
        onPress={() => call.toggleScreenShare()}
      />
      
      <RecordCallButton
        className="control-button"
        onPress={() => call.toggleRecording()}
      />
      
      {isRecording && <div className="recording-indicator">● Recording</div>}
      
      <LeaveCallButton
        className="leave-button"
        onPress={() => call.leave()}
      />
    </div>
  );
}