import { FileText, X, RotateCcw, AlertCircle, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AttachedFile } from '@/types/attachedFile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FileProcessingItemProps {
  file: AttachedFile;
  onRemove: (fileId: string) => void;
  onRetry?: (fileId: string) => void;
}

export const FileProcessingItem = ({ file, onRemove, onRetry }: FileProcessingItemProps) => {
  const isProcessing = file.status === 'uploading' || file.status === 'processing';
  const isError = file.status === 'error';
  const isComplete = file.status === 'complete';

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "relative inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border transition-all w-auto flex-shrink-0",
              isError ? "border-destructive/40 bg-destructive/5" : "border-border bg-muted/50",
              isProcessing && "border-primary/30 bg-primary/5"
            )}
          >
            {/* Icon */}
            <div className="flex-shrink-0">
              {isProcessing ? (
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
              ) : isError ? (
                <AlertCircle className="h-4 w-4 text-destructive" />
              ) : isComplete ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <FileText className="h-4 w-4 text-muted-foreground" />
              )}
            </div>

            {/* Truncated filename */}
            <span className="text-xs text-foreground truncate max-w-[240px] leading-tight">
              {file.name}
            </span>

      {/* Status label */}
      {isProcessing && (
        <span className="text-[10px] text-muted-foreground flex-shrink-0">
          {file.status === 'uploading' ? 'Uploading…' : 'Reading…'}
        </span>
      )}

      {/* Remove button */}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0 h-4 w-4 p-0 rounded-full hover:bg-destructive/10 ml-0.5"
              onClick={() => onRemove(file.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">Remove file</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Error retry */}
      {isError && onRetry && (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="text-[10px] text-destructive hover:underline flex items-center gap-0.5 flex-shrink-0"
                onClick={() => onRetry(file.id)}
              >
                <RotateCcw className="h-2.5 w-2.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">Retry</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Progress bar */}
      {isProcessing && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/10 rounded-b-md overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${file.progress}%` }}
          />
        </div>
      )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs max-w-[400px] break-all">
          {file.name}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
