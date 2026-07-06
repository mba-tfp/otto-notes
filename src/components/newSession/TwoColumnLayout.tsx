import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { NoteTab as NoteTabType, RecordingMode, Patient } from '@/types/session';
import { RightColumnPanel } from './RightColumnPanel';
import { useBreakpoint } from '@/hooks/useBreakpoint';

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
  const bp = useBreakpoint();

  const leftPaneLabel = recordingMode === 'dictate' ? 'Dictation' : 'Transcript';

  const LeftPanel = (
    <div className="flex flex-col h-full border-r border-border">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-1 rounded-full',
            recordingMode === 'dictate'
              ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400'
              : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
          )}
        >
          <span className="text-sm font-medium">{leftPaneLabel}</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <Textarea
          value={transcriptContent}
          onChange={(e) => onTranscriptChange(e.target.value)}
          placeholder={
            recordingMode === 'dictate'
              ? 'Your dictation will appear here as you speak...'
              : 'Your transcript will appear here as you speak or record...'
          }
          className="w-full h-full min-h-[300px] resize-none border-0 shadow-none focus-visible:ring-0 p-0 text-base leading-relaxed"
        />
      </div>
    </div>
  );

  const RightPanel = (
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
  );

  // Mobile: single-column tabs
  if (bp === 'mobile') {
    return (
      <Tabs defaultValue="left" className="flex flex-col h-full">
        <TabsList className="mx-4 mt-2 grid grid-cols-2 shrink-0">
          <TabsTrigger value="left">{leftPaneLabel}</TabsTrigger>
          <TabsTrigger value="right">Context / Note</TabsTrigger>
        </TabsList>
        <TabsContent value="left" className="flex-1 overflow-hidden mt-2">
          {LeftPanel}
        </TabsContent>
        <TabsContent value="right" className="flex-1 overflow-hidden mt-2">
          {RightPanel}
        </TabsContent>
      </Tabs>
    );
  }

  // Tablet: fixed 50/50 non-resizable
  if (bp === 'tablet') {
    return (
      <div className="grid grid-cols-2 h-full">
        <div className="h-full overflow-hidden">{LeftPanel}</div>
        <div className="h-full overflow-hidden">{RightPanel}</div>
      </div>
    );
  }

  // Desktop: original resizable layout
  return (
    <div className="flex flex-col h-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={40} minSize={25}>
          {LeftPanel}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60} minSize={35}>
          {RightPanel}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
