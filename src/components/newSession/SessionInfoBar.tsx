import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { MicrophoneSelector } from './MicrophoneSelector';
import { SpeakerSelector } from './SpeakerSelector';

interface SessionInfoBarProps {
  sessionDate: Date;
  recordingDuration: number;
  isPaused: boolean;
  selectedMicrophoneId: string;
  onMicrophoneChange: (deviceId: string) => void;
  selectedSpeakerId: string;
  onSpeakerChange: (deviceId: string) => void;
  audioLevel: number;
}

export const SessionInfoBar = ({
  sessionDate,
  recordingDuration,
  isPaused,
  selectedMicrophoneId,
  onMicrophoneChange,
  selectedSpeakerId,
  onSpeakerChange,
  audioLevel,
}: SessionInfoBarProps) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-background">
      {/* Left: Date chip */}
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 text-foreground rounded-full text-[13px] bg-white">
          <Calendar className="h-3.5 w-3.5 stroke-[1.5]" />
          <span>{format(sessionDate, "MMM d, yyyy h:mma")}</span>
        </div>
      </div>

      {/* Right: Timer + Mic + Speaker */}
      <div className="flex items-center gap-4">
        <span className={cn(
          "font-medium text-[13px] tabular-nums",
          isPaused ? "text-amber-500" : "text-foreground/80"
        )}>
          {formatDuration(recordingDuration)}
          {isPaused && <span className="ml-1 text-xs">(paused)</span>}
        </span>

        <div className="flex items-center gap-[19px]">
          <MicrophoneSelector
            selectedDeviceId={selectedMicrophoneId}
            onDeviceChange={onMicrophoneChange}
            audioLevel={audioLevel}
          />

          <SpeakerSelector
            selectedDeviceId={selectedSpeakerId}
            onDeviceChange={onSpeakerChange}
          />
        </div>
      </div>
    </div>
  );
};
