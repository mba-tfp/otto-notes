import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { MicrophoneSelector } from './MicrophoneSelector';
import { RecordingModeButton } from './RecordingModeButton';
import { RecordingMode } from '@/types/session';
import { cn } from '@/lib/utils';

interface SessionInfoBarProps {
  sessionDate: Date;
  recordingDuration: number;
  selectedMicrophoneId: string;
  onMicrophoneChange: (deviceId: string) => void;
  audioLevel: number;
  recordingMode: RecordingMode;
  isRecording: boolean;
  isPaused: boolean;
  onModeChange: (mode: RecordingMode) => void;
  onToggleRecording: () => void;
  onTogglePause: () => void;
  onUploadAudio: () => void;
}

export const SessionInfoBar = ({
  sessionDate,
  recordingDuration,
  selectedMicrophoneId,
  onMicrophoneChange,
  audioLevel,
  recordingMode,
  isRecording,
  isPaused,
  onModeChange,
  onToggleRecording,
  onTogglePause,
  onUploadAudio
}: SessionInfoBarProps) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-background">
      {/* Left side: Date chip only - language moved to NoteTab */}
      <div className="flex items-center gap-3">
        {/* Date chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 text-foreground rounded-full text-[13px] bg-white">
          <Calendar className="h-3.5 w-3.5 stroke-[1.5]" />
          <span>{format(sessionDate, "MMM d, yyyy h:mma")}</span>
        </div>
      </div>

      {/* Right side: Timer, Mic, Record button with mode selector */}
      <div className="flex items-center gap-4">
        {/* Timer with paused indicator */}
        <span className={cn(
          "font-medium text-[13px] tabular-nums",
          isPaused ? "text-amber-500" : "text-foreground/80"
        )}>
          {formatDuration(recordingDuration)}
          {isPaused && <span className="ml-1 text-xs">(paused)</span>}
        </span>
        
        <MicrophoneSelector 
          selectedDeviceId={selectedMicrophoneId} 
          onDeviceChange={onMicrophoneChange} 
          audioLevel={audioLevel} 
        />
        
        <RecordingModeButton 
          mode={recordingMode} 
          isRecording={isRecording}
          isPaused={isPaused}
          onModeChange={onModeChange} 
          onToggleRecording={onToggleRecording}
          onTogglePause={onTogglePause}
          onUploadAudio={onUploadAudio} 
        />
      </div>
    </div>
  );
};
