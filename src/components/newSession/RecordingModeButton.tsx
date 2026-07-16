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
  const isTranscribe = mode === 'transcribe';

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
            {isTranscribe ? 'Transcribe' : 'Dictate'}
          </>
        )}
      </Button>

      {/* Segmented control for mode selection */}
      <div className="flex items-center rounded-full border border-[hsl(216_20%_90%)] bg-white overflow-hidden">
        <button
          onClick={() => onModeChange('transcribe')}
          className={cn(
            "px-4 py-2 text-[13px] font-medium transition-colors",
            mode === 'transcribe'
              ? "bg-[hsl(5_85%_92%)] text-foreground"
              : "bg-white text-foreground/70 hover:bg-sidebar"
          )}
        >
          Transcribe
        </button>
        <button
          onClick={() => onModeChange('dictate')}
          className={cn(
            "px-4 py-2 text-[13px] font-medium transition-colors",
            mode === 'dictate'
              ? "bg-[hsl(5_85%_92%)] text-foreground"
              : "bg-white text-foreground/70 hover:bg-sidebar"
          )}
        >
          Dictate
        </button>
      </div>
    </div>
  );
};
