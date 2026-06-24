import { useState, useCallback, useEffect, useRef } from 'react';
import { Plus, X, FileText, ChevronDown, Copy, Undo, Redo, MoreHorizontal, Loader2, AlertCircle, Send, Download, CheckCircle, Globe, AlertTriangle, Pencil, Save, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { NoteTab as NoteTabType } from '@/types/session';
import { useToast } from '@/hooks/use-toast';
import { TEMPLATES } from '@/data/demoContent';
import { useLetters } from '@/contexts/LettersContext';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SendToLettersDialog } from './SendToLettersDialog';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
];

interface NoteTabProps {
  tabs: NoteTabType[];
  activeTabId: string;
  onTabsChange: (tabs: NoteTabType[]) => void;
  onActiveTabChange: (tabId: string) => void;
  isGenerating: boolean;
  hasContent: boolean;
  onGenerate: (templateId: string) => void;
  sessionId?: string;
  patientName?: string;
  sessionDate?: Date;
}

// Extended tab type to include language and history
interface ExtendedTabState {
  language: string;
  undoStack: string[];
  redoStack: string[];
}

export const NoteTab = ({
  tabs,
  activeTabId,
  onTabsChange,
  onActiveTabChange,
  isGenerating,
  hasContent,
  onGenerate,
  sessionId,
  patientName,
  sessionDate,
}: NoteTabProps) => {
  const { toast } = useToast();
  const { createLetter, getLetterBySessionId } = useLetters();
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const [showNoContentWarning, setShowNoContentWarning] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  
  // Per-tab state for language and undo/redo history
  const [tabStates, setTabStates] = useState<Record<string, ExtendedTabState>>(() => {
    const initial: Record<string, ExtendedTabState> = {};
    tabs.forEach(tab => {
      initial[tab.id] = {
        language: 'en',
        undoStack: [],
        redoStack: [],
      };
    });
    return initial;
  });

  // Per-tab edit/preview mode
  const [tabModes, setTabModes] = useState<Record<string, 'preview' | 'edit'>>({});
  const currentMode: 'preview' | 'edit' = tabModes[activeTabId] || 'preview';
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  const setMode = (mode: 'preview' | 'edit') => {
    setTabModes(prev => ({ ...prev, [activeTabId]: mode }));
  };

  // When generating starts, force preview mode for the resulting content
  useEffect(() => {
    if (isGenerating) {
      setTabModes(prev => ({ ...prev, [activeTabId]: 'preview' }));
    }
  }, [isGenerating, activeTabId]);

  useEffect(() => {
    if (currentMode === 'edit' && editorRef.current) {
      editorRef.current.focus();
    }
  }, [currentMode, activeTabId]);

  const handleSaveNote = () => {
    setMode('preview');
    toast({ title: 'Note saved', description: 'Your changes have been saved.' });
  };

  // Get the current tab's template ID
  const currentTemplateId = activeTab?.templateId || '';
  
  // Check if this session already has a letter
  const existingLetter = sessionId ? getLetterBySessionId(sessionId) : undefined;
  const hasGeneratedContent = activeTab?.content && activeTab.content.trim().length > 0;

  // Get current tab state
  const currentTabState = tabStates[activeTabId] || { language: 'en', undoStack: [], redoStack: [] };

  const handleTemplateSelect = (templateId: string) => {
    // Update the tab's templateId
    const newTabs = tabs.map(t =>
      t.id === activeTabId ? { ...t, templateId } : t
    );
    onTabsChange(newTabs);

    if (!hasContent) {
      setShowNoContentWarning(true);
      return;
    }
    setShowNoContentWarning(false);
    // Trigger generation with this template
    setTimeout(() => onGenerate(templateId), 100);
  };

  const addNewTab = () => {
    const newTab: NoteTabType = {
      id: crypto.randomUUID(),
      title: `Untitled ${tabs.length + 1}`,
      templateId: '',
      content: '',
    };
    onTabsChange([...tabs, newTab]);
    onActiveTabChange(newTab.id);
    
    // Initialize state for new tab
    setTabStates(prev => ({
      ...prev,
      [newTab.id]: {
        language: 'en',
        undoStack: [],
        redoStack: [],
      }
    }));
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      toast({
        title: "Cannot close",
        description: "You must have at least one note tab.",
        variant: "destructive",
      });
      return;
    }
    const newTabs = tabs.filter(t => t.id !== tabId);
    onTabsChange(newTabs);
    if (activeTabId === tabId) {
      onActiveTabChange(newTabs[0].id);
    }
    
    // Clean up tab state
    setTabStates(prev => {
      const newState = { ...prev };
      delete newState[tabId];
      return newState;
    });
  };

  const updateTabContent = useCallback((content: string) => {
    // Save current content to undo stack before updating
    const currentContent = activeTab?.content || '';
    if (currentContent !== content) {
      setTabStates(prev => ({
        ...prev,
        [activeTabId]: {
          ...prev[activeTabId],
          undoStack: [...(prev[activeTabId]?.undoStack || []), currentContent].slice(-50), // Keep last 50 states
          redoStack: [], // Clear redo stack on new change
        }
      }));
    }
    
    const newTabs = tabs.map(t =>
      t.id === activeTabId ? { ...t, content } : t
    );
    onTabsChange(newTabs);
  }, [activeTabId, activeTab, tabs, onTabsChange]);

  const handleUndo = useCallback(() => {
    const state = tabStates[activeTabId];
    if (!state || state.undoStack.length === 0) return;
    
    const currentContent = activeTab?.content || '';
    const previousContent = state.undoStack[state.undoStack.length - 1];
    
    setTabStates(prev => ({
      ...prev,
      [activeTabId]: {
        ...prev[activeTabId],
        undoStack: prev[activeTabId].undoStack.slice(0, -1),
        redoStack: [...prev[activeTabId].redoStack, currentContent],
      }
    }));
    
    const newTabs = tabs.map(t =>
      t.id === activeTabId ? { ...t, content: previousContent } : t
    );
    onTabsChange(newTabs);
  }, [activeTabId, activeTab, tabs, onTabsChange, tabStates]);

  const handleRedo = useCallback(() => {
    const state = tabStates[activeTabId];
    if (!state || state.redoStack.length === 0) return;
    
    const currentContent = activeTab?.content || '';
    const nextContent = state.redoStack[state.redoStack.length - 1];
    
    setTabStates(prev => ({
      ...prev,
      [activeTabId]: {
        ...prev[activeTabId],
        undoStack: [...prev[activeTabId].undoStack, currentContent],
        redoStack: prev[activeTabId].redoStack.slice(0, -1),
      }
    }));
    
    const newTabs = tabs.map(t =>
      t.id === activeTabId ? { ...t, content: nextContent } : t
    );
    onTabsChange(newTabs);
  }, [activeTabId, activeTab, tabs, onTabsChange, tabStates]);

  const handleLanguageChange = (language: string) => {
    setTabStates(prev => ({
      ...prev,
      [activeTabId]: {
        ...prev[activeTabId],
        language,
      }
    }));
  };

  const handleCopy = () => {
    if (activeTab?.content) {
      navigator.clipboard.writeText(activeTab.content);
      toast({
        title: "Copied",
        description: "Note content copied to clipboard.",
      });
    }
  };

  const handleExportPDF = () => {
    toast({
      title: "Export PDF",
      description: "PDF export feature coming soon.",
    });
  };

  const handlePrint = () => {
    if (activeTab?.content) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${patientName || 'Note'} - ${selectedTemplate?.name || 'Clinical Note'}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 40px; white-space: pre-wrap; }
              </style>
            </head>
            <body>${activeTab.content}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleSendNow = (doctorNote?: string) => {
    if (activeTab?.content && sessionId) {
      createLetter({
        sessionId,
        patientName: patientName || 'Unknown Patient',
        sessionDate: sessionDate || new Date(),
        templateType: selectedTemplate?.name || 'Clinical Note',
        content: activeTab.content,
        doctorNote,
      });
      toast({
        title: "Letter sent",
        description: "The letter has been sent directly.",
      });
    }
  };

  const handleDownload = () => {
    if (activeTab?.content) {
      const blob = new Blob([activeTab.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${patientName || 'note'}-${selectedTemplate?.name || 'clinical-note'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Downloaded",
        description: "Note has been downloaded.",
      });
    }
  };

  const handleApproveAndSendToLetters = (doctorNote?: string) => {
    if (activeTab?.content && sessionId) {
      createLetter({
        sessionId,
        patientName: patientName || 'Unknown Patient',
        sessionDate: sessionDate || new Date(),
        templateType: selectedTemplate?.name || 'Clinical Note',
        content: activeTab.content,
        doctorNote,
      });
      toast({
        title: "Approved & sent to Letters",
        description: "The note has been approved and sent to admin for dispatch.",
      });
    }
  };

  const selectedTemplate = TEMPLATES.find(t => t.id === currentTemplateId);
  const canUndo = (tabStates[activeTabId]?.undoStack.length || 0) > 0;
  const canRedo = (tabStates[activeTabId]?.redoStack.length || 0) > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Sub-tabs */}
      <div className="flex items-center border-b border-border px-2 bg-muted/30">
        <div className="flex items-center overflow-x-auto">
          <TooltipProvider delayDuration={300}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onActiveTabChange(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm border-b-2 transition-colors whitespace-nowrap",
                  tab.id === activeTabId
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>{tab.title}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => closeTab(tab.id, e)}
                      className="ml-1 p-0.5 rounded hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">Close tab</TooltipContent>
                </Tooltip>
              </button>
            ))}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 shrink-0"
                  onClick={addNewTab}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">Add note tab</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Note content area */}
      <div className="flex-1 flex flex-col p-4">
        {/* Template selection toolbar */}
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2" disabled={isGenerating}>
                {selectedTemplate ? (
                  <>
                    {selectedTemplate.name}
                    <ChevronDown className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Select a template
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              {TEMPLATES.map(template => (
                <DropdownMenuItem
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className="flex flex-col items-start"
                >
                  <span className="font-medium">{template.name}</span>
                  <span className="text-xs text-muted-foreground">{template.description}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleExportPDF}>Export as PDF</DropdownMenuItem>
                    <DropdownMenuItem onClick={handlePrint}>Print</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">More options</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="ml-auto flex items-center gap-1">
            {/* Language selector per template */}
            <Select value={currentTabState.language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-auto h-8 gap-1 border-0 bg-transparent hover:bg-muted px-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>{languages.find(l => l.code === currentTabState.language)?.flag}</span>
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleCopy} disabled={!activeTab?.content}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">Copy</TooltipContent>
              </Tooltip>
              {currentMode === 'edit' && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={handleUndo}
                        disabled={!canUndo}
                      >
                        <Undo className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">Undo</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={handleRedo}
                        disabled={!canRedo}
                      >
                        <Redo className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">Redo</TooltipContent>
                  </Tooltip>
                </>
              )}
              {hasGeneratedContent && currentMode === 'preview' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 px-2"
                  onClick={() => setMode('edit')}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              )}
              {hasGeneratedContent && currentMode === 'edit' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 px-2"
                    onClick={() => setMode('preview')}
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 gap-1.5"
                    onClick={handleSaveNote}
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                </>
              )}
            </TooltipProvider>
          </div>
        </div>



        {/* Loading State */}
        {isGenerating && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-muted-foreground">Generating note...</span>
          </div>
        )}

        {/* No Content Warning */}
        {!isGenerating && showNoContentWarning && !activeTab?.content && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
            <AlertCircle className="h-10 w-10 text-amber-500" />
            <div>
              <p className="font-medium text-foreground">No content to generate from</p>
              <p className="text-sm text-muted-foreground mt-1">
                Please add patient information in the Context tab or record a transcript first.
              </p>
            </div>
          </div>
        )}

        {/* Note content - preview (read-only) or edit (textarea) */}
        {!isGenerating && (!showNoContentWarning || activeTab?.content) && (
          currentMode === 'edit' || !hasGeneratedContent ? (
            <Textarea
              ref={editorRef}
              value={activeTab?.content || ''}
              onChange={(e) => updateTabContent(e.target.value)}
              placeholder="Select a template above to generate a note"
              className="flex-1 min-h-[300px] resize-none border-0 shadow-none focus-visible:ring-0 p-0 text-base leading-relaxed"
            />
          ) : (
            <div className="flex-1 min-h-[300px] text-base leading-relaxed whitespace-pre-wrap text-foreground">
              {activeTab?.content}
            </div>
          )
        )}

        {/* Review disclaimer - always visible */}
        <div className="flex items-center gap-2 px-3 py-2 mt-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md text-sm text-amber-800 dark:text-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          <span>Review your note before use to ensure it accurately represents the visit</span>
        </div>

        {/* Letter Actions - Show when note has content */}
        {hasGeneratedContent && !isGenerating && (
          <div className="mt-4 pt-4 border-t border-border">
            {existingLetter ? (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {existingLetter.status === 'sent' ? 'Sent' : 'Approved & pending'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  This note has been sent to Letters
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowSendDialog(true)}>
                  <Send className="h-4 w-4" />
                  Send now
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button size="sm" className="gap-2" onClick={() => setShowSendDialog(true)}>
                  <CheckCircle className="h-4 w-4" />
                  Approve & send to Letters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <SendToLettersDialog
        open={showSendDialog}
        onOpenChange={setShowSendDialog}
        patientName={patientName || 'Unknown Patient'}
        templateType={selectedTemplate?.name || 'Clinical Note'}
        onConfirm={handleApproveAndSendToLetters}
      />
    </div>
  );
};
