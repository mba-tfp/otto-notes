import { Mic, Square, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecordingMode } from '@/types/session';
import { cn } from '@/lib/utils';

interface RecordingModeButtonProps {
  mode: RecordingMode;
  isRecording: boolean;
  isPaused: boolean;
  onModeChange: (mode: RecordingMode) => void;
  onToggleRecording: () => void;
  onTogglePause: () => void;
  onUploadAudio: () => void;
}

export const RecordingModeButton = ({
  mode,
  isRecording,
  isPaused,
  onModeChange,
  onToggleRecording,
  onTogglePause,
  onUploadAudio,
}: RecordingModeButtonProps) => {
  const actionLabel =
    mode === 'transcribe' ? 'Transcribe' :
    mode === 'dictate' ? 'Dictate' :
    'Start Call';

  return (
    <div className="flex items-center gap-2">
      {/* Pause/Resume button - only visible when recording */}
      {isRecording && (
        <Button
          variant="outline"
          className="gap-2 font-medium rounded-full"
          onClick={onTogglePause}
        >
          {isPaused ? (
            <>
              <Play className="h-4 w-4 fill-current" />
              Resume
            </>
          ) : (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          )}
        </Button>
      )}

      {/* Primary action button - Salmon CTA */}
      <Button
        className={cn(
          "gap-2 font-medium min-w-[120px] rounded-full",
          "bg-brand hover:bg-[hsl(5_85%_68%)] text-brand-foreground",
          isRecording && !isPaused && "animate-pulse"
        )}
        onClick={onToggleRecording}
      >
        {isRecording ? (
          <>
            <Square className="h-4 w-4 fill-current" />
            Stop
          </>
        ) : (
          <>
            <Mic className="h-4 w-4 stroke-[1.5]" />
            {actionLabel}
          </>
        )}
      </Button>
    </div>
  );
};
