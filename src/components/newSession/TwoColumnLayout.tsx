import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { NoteTab as NoteTabType, RecordingMode, Patient } from '@/types/session';
import { RightColumnPanel } from './RightColumnPanel';

interface TwoColumnLayoutProps {
  recordingMode: RecordingMode;
  transcriptContent: string;
  onTranscriptChange: (content: string) => void;
  isRecording: boolean;
  isPaused: boolean;
  contextContent: string;
  onContextChange: (content: string) => void;
  noteTabs: NoteTabType[];
  activeNoteTabId: string;
  onNoteTabsChange: (tabs: NoteTabType[]) => void;
  onActiveNoteTabChange: (tabId: string) => void;
  isGenerating: boolean;
  hasContent: boolean;
  onGenerate: (templateId: string) => void;
  sessionId?: string;
  patientName?: string;
  sessionDate?: Date;
  selectedPatient?: Patient | null;
}

export const TwoColumnLayout = ({
  recordingMode,
  transcriptContent,
  onTranscriptChange,
  isRecording,
  isPaused,
  contextContent,
  onContextChange,
  noteTabs,
  activeNoteTabId,
  onNoteTabsChange,
  onActiveNoteTabChange,
  isGenerating,
  hasContent,
  onGenerate,
  sessionId,
  patientName,
  sessionDate,
  selectedPatient,
}: TwoColumnLayoutProps) => {
  const [rightView, setRightView] = useState<'context' | 'note'>('context');
  
  // Label for left pane based on recording mode
  const leftPaneLabel = recordingMode === 'dictate' ? 'Dictation' : 'Transcript';

  return (
    <div className="flex flex-col h-full min-w-0 min-h-0">
      {/* Two Column Content */}
      <ResizablePanelGroup direction="horizontal" className="h-full min-w-0">
        {/* Left Column - Transcript/Dictate */}
        <ResizablePanel defaultSize={40} minSize={25}>
          <div className="flex flex-col h-full border-r border-border">
            {/* Left Pane Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <div className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full",
                recordingMode === 'dictate' 
                  ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400"
                  : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
              )}>
                <span className="text-sm font-medium">{leftPaneLabel}</span>
              </div>
            </div>
            
            {/* Transcript/Dictate Content - Plain text, no toolbar */}
            <div className="flex-1 overflow-auto p-4">
              <Textarea
                value={transcriptContent}
                onChange={(e) => onTranscriptChange(e.target.value)}
                placeholder={recordingMode === 'dictate' 
                  ? "Your dictation will appear here as you speak..."
                  : "Your transcript will appear here as you speak or record..."
                }
                className="w-full h-full min-h-[300px] resize-none border-0 shadow-none focus-visible:ring-0 p-0 text-base leading-relaxed"
              />
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Right Column - Context/Note with its own header */}
        <ResizablePanel defaultSize={60} minSize={35}>
          <RightColumnPanel
            activeView={rightView}
            onViewChange={setRightView}
            contextContent={contextContent}
            onContextChange={onContextChange}
            noteTabs={noteTabs}
            activeNoteTabId={activeNoteTabId}
            onNoteTabsChange={onNoteTabsChange}
            onActiveNoteTabChange={onActiveNoteTabChange}
            isGenerating={isGenerating}
            hasContent={hasContent}
            onGenerate={onGenerate}
            sessionId={sessionId}
            patientName={patientName}
            sessionDate={sessionDate}
            selectedPatient={selectedPatient}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
