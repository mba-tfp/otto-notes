import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Plus, X, FileText, ChevronDown, Copy, Undo, Redo, MoreHorizontal, Loader2, AlertCircle, AlertTriangle, Bold, Italic, List, Paperclip, Printer, FileDown, Send, PenLine, CheckCircle, Globe, Pencil, Save, Eye } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { RichTextToolbar } from '@/components/letters/RichTextToolbar';
import { Patient } from '@/types/session';
import { getDemoCnpDocs, DemoCnpDocument } from '@/data/demoCnpDocuments';
import { CnpDocumentsPickerModal } from './CnpDocumentsPickerModal';



const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.png', '.jpg', '.jpeg'];

const filterFiles = (files: File[]) => {
  const valid: File[] = [];
  const invalid: File[] = [];
  files.forEach(f => {
    const ext = '.' + f.name.split('.').pop()?.toLowerCase();
    if (ALLOWED_EXTENSIONS.includes(ext)) valid.push(f);
    else invalid.push(f);
  });
  return { valid, invalid };
};
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { NoteTab as NoteTabType } from '@/types/session';
import { useToast } from '@/hooks/use-toast';
import { availableTemplates } from '@/data/templates';
import { useLetters } from '@/contexts/LettersContext';
import { useDocumentOCR } from '@/hooks/useDocumentOCR';
import { FileProcessingItem } from './FileProcessingItem';
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

interface ExtendedTabState {
  language: string;
  undoStack: string[];
  redoStack: string[];
}

interface RightColumnPanelProps {
  activeView: 'context' | 'note';
  onViewChange: (view: 'context' | 'note') => void;
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

export const RightColumnPanel = ({
  activeView,
  onViewChange,
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
}: RightColumnPanelProps) => {
  const { toast } = useToast();
  const { createLetter, getLetterBySessionId } = useLetters();
  const { files: attachedFiles, addFiles, removeFile, retryProcessing, addImportedDocuments } = useDocumentOCR();
  const [showNoContentWarning, setShowNoContentWarning] = useState(false);

  // CNP demo document import state
  const [cnpBannerDismissed, setCnpBannerDismissed] = useState(false);
  const [cnpPickerOpen, setCnpPickerOpen] = useState(false);
  const [cnpImportedFilenames, setCnpImportedFilenames] = useState<Set<string>>(new Set());
  const cnpDocs = getDemoCnpDocs(selectedPatient?.cnpId);
  const cnpPartnerName = selectedPatient?.partnerFirstName && selectedPatient?.partnerLastName
    ? `${selectedPatient.partnerFirstName} ${selectedPatient.partnerLastName}`
    : undefined;

  const cnpToastFiredRef = useRef<string | null>(null);

  useEffect(() => {
    setCnpBannerDismissed(false);
    setCnpPickerOpen(false);
    setCnpImportedFilenames(new Set());
    cnpToastFiredRef.current = null;
  }, [selectedPatient?.id]);

  useEffect(() => {
    if (!selectedPatient || cnpDocs.length === 0) return;
    if (cnpToastFiredRef.current === selectedPatient.id) return;
    if (cnpBannerDismissed || cnpImportedFilenames.size > 0) return;
    // Don't double-up with the inline banner — only toast when user is on Note view
    if (activeView === 'context') return;
    cnpToastFiredRef.current = selectedPatient.id;
    sonnerToast.custom(
      (t) => (
        <div className="flex items-center gap-3 w-full bg-background rounded-md border border-border border-l-4 border-l-primary shadow-lg px-4 py-3 text-sm text-foreground">
          <span className="flex-1">
            📎 {selectedPatient.name} has {cnpDocs.length} documents in Otto Onboard —{' '}
            <button
              onClick={() => {
                sonnerToast.dismiss(t);
                setCnpPickerOpen(true);
              }}
              className="font-semibold text-primary hover:text-primary/80 underline-offset-2 hover:underline"
            >
              Import now
            </button>
          </span>
        </div>
      ),
      { duration: 6000, position: 'top-right' }
    );
  }, [selectedPatient?.id, cnpDocs.length, cnpBannerDismissed, cnpImportedFilenames.size, activeView]);

  const handleCnpImport = (docs: DemoCnpDocument[]) => {
    addImportedDocuments(docs.map(d => ({ name: d.filename })));
    setCnpImportedFilenames(prev => {
      const next = new Set(prev);
      docs.forEach(d => next.add(d.filename));
      return next;
    });
    setCnpPickerOpen(false);
  };

  const [showSendDialog, setShowSendDialog] = useState(false);
  
  // Per-tab state for language and undo/redo history
  const [tabStates, setTabStates] = useState<Record<string, ExtendedTabState>>(() => {
    const initial: Record<string, ExtendedTabState> = {};
    noteTabs.forEach(tab => {
      initial[tab.id] = {
        language: 'en',
        undoStack: [],
        redoStack: [],
      };
    });
    return initial;
  });
  
  const activeTab = noteTabs.find(t => t.id === activeNoteTabId) || noteTabs[0];
  const currentTemplateId = activeTab?.templateId || '';
  const currentTabState = tabStates[activeNoteTabId] || { language: 'en', undoStack: [], redoStack: [] };
  const selectedTemplate = availableTemplates.find(t => t.id === currentTemplateId);
  
  // Letter workflow
  const existingLetter = sessionId ? getLetterBySessionId(sessionId) : undefined;
  const hasGeneratedContent = activeTab?.content && activeTab.content.trim().length > 0;

  // Per-tab preview/edit mode (default preview)
  const [tabModes, setTabModes] = useState<Record<string, 'preview' | 'edit'>>({});
  const currentMode: 'preview' | 'edit' = tabModes[activeNoteTabId] || 'preview';
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const setMode = (mode: 'preview' | 'edit') => {
    setTabModes(prev => ({ ...prev, [activeNoteTabId]: mode }));
  };
  useEffect(() => {
    if (isGenerating) {
      setTabModes(prev => ({ ...prev, [activeNoteTabId]: 'preview' }));
    }
  }, [isGenerating, activeNoteTabId]);

  // Convert stored content (which may be plain text) to HTML paragraphs so
  // line breaks survive both Tiptap setContent and preview rendering.
  const toEditorHtml = useCallback((content: string): string => {
    if (!content) return '';
    if (/<[a-z][\s\S]*>/i.test(content)) return content;
    const esc = (s: string) =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return content
      .split(/\n\s*\n/)
      .map(block => `<p>${esc(block).replace(/\n/g, '<br/>')}</p>`)
      .join('');
  }, []);

  // Tiptap rich-text editor (used in edit mode)
  const isSyncingFromTabRef = useRef(false);
  const updateTabContentRef = useRef<(content: string) => void>(() => {});
  const richEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: toEditorHtml(activeTab?.content || ''),
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[300px] text-base leading-relaxed text-foreground',
      },
    },
    onUpdate: ({ editor }) => {
      if (isSyncingFromTabRef.current) return;
      const html = editor.getHTML();
      updateTabContentRef.current(html === '<p></p>' ? '' : html);
    },
  });


  // Sync editor content when the active tab changes or content changes externally (e.g., generation)
  useEffect(() => {
    if (!richEditor) return;
    if (richEditor.isFocused) return;
    const nextHtml = toEditorHtml(activeTab?.content || '');
    if (richEditor.getHTML() !== nextHtml) {
      isSyncingFromTabRef.current = true;
      richEditor.commands.setContent(nextHtml, { emitUpdate: false });
      isSyncingFromTabRef.current = false;
    }
  }, [activeNoteTabId, activeTab?.content, richEditor, toEditorHtml]);


  useEffect(() => {
    if (currentMode === 'edit' && richEditor) {
      richEditor.commands.focus();
    }
  }, [currentMode, activeNoteTabId, richEditor]);

  const handleSaveNote = () => {
    setMode('preview');
    toast({ title: 'Note saved', description: 'Your changes have been saved.' });
  };

  const handleMarkReviewed = () => {
    toast({
      title: "Note reviewed",
      description: "The note has been marked as reviewed.",
    });
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const { valid, invalid } = filterFiles(Array.from(selectedFiles));
      if (invalid.length > 0) {
        toast({ title: "Unsupported file type", description: "Only PDF, DOCX, DOC, PNG, and JPEG are allowed.", variant: "destructive" });
      }
      if (valid.length > 0) addFiles(valid);
    }
    e.target.value = '';
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      const { valid, invalid } = filterFiles(droppedFiles);
      if (invalid.length > 0) {
        toast({ title: "Unsupported file type", description: "Only PDF, DOCX, DOC, PNG, and JPEG are allowed.", variant: "destructive" });
      }
      if (valid.length > 0) addFiles(valid);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    // Update the tab's templateId
    const template = availableTemplates.find(t => t.id === templateId);
    const newTabs = noteTabs.map(t =>
      t.id === activeNoteTabId ? { ...t, templateId, title: template?.name || t.title } : t
    );
    onNoteTabsChange(newTabs);
    setShowNoContentWarning(false);
    
    // Always trigger generation - demo content will be used if no transcript/context
    onGenerate(templateId);
  };

  const addNewTab = () => {
    const newTab: NoteTabType = {
      id: crypto.randomUUID(),
      title: `Untitled ${noteTabs.length + 1}`,
      templateId: '',
      content: '',
    };
    onNoteTabsChange([...noteTabs, newTab]);
    onActiveNoteTabChange(newTab.id);
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (noteTabs.length === 1) {
      toast({
        title: "Cannot close",
        description: "You must have at least one note tab.",
        variant: "destructive",
      });
      return;
    }
    const newTabs = noteTabs.filter(t => t.id !== tabId);
    onNoteTabsChange(newTabs);
    if (activeNoteTabId === tabId) {
      onActiveNoteTabChange(newTabs[0].id);
    }
  };

  const updateTabContent = useCallback((content: string) => {
    // Push current content to undo stack before updating
    const currentContent = activeTab?.content || '';
    if (currentContent !== content) {
      setTabStates(prev => ({
        ...prev,
        [activeNoteTabId]: {
          ...prev[activeNoteTabId],
          undoStack: [...(prev[activeNoteTabId]?.undoStack || []), currentContent],
          redoStack: [], // Clear redo stack on new edit
        },
      }));
    }
    
    const newTabs = noteTabs.map(t =>
      t.id === activeNoteTabId ? { ...t, content } : t
    );
    onNoteTabsChange(newTabs);
  }, [activeNoteTabId, activeTab?.content, noteTabs, onNoteTabsChange]);

  // Keep the editor's onUpdate callback pointing at the latest updateTabContent
  useEffect(() => {
    updateTabContentRef.current = updateTabContent;
  }, [updateTabContent]);


  const handleUndo = useCallback(() => {
    const { undoStack } = currentTabState;
    if (undoStack.length === 0) return;
    
    const previousContent = undoStack[undoStack.length - 1];
    const currentContent = activeTab?.content || '';
    
    setTabStates(prev => ({
      ...prev,
      [activeNoteTabId]: {
        ...prev[activeNoteTabId],
        undoStack: undoStack.slice(0, -1),
        redoStack: [...(prev[activeNoteTabId]?.redoStack || []), currentContent],
      },
    }));
    
    const newTabs = noteTabs.map(t =>
      t.id === activeNoteTabId ? { ...t, content: previousContent } : t
    );
    onNoteTabsChange(newTabs);
  }, [activeNoteTabId, activeTab?.content, currentTabState, noteTabs, onNoteTabsChange]);

  const handleRedo = useCallback(() => {
    const { redoStack } = currentTabState;
    if (redoStack.length === 0) return;
    
    const nextContent = redoStack[redoStack.length - 1];
    const currentContent = activeTab?.content || '';
    
    setTabStates(prev => ({
      ...prev,
      [activeNoteTabId]: {
        ...prev[activeNoteTabId],
        undoStack: [...(prev[activeNoteTabId]?.undoStack || []), currentContent],
        redoStack: redoStack.slice(0, -1),
      },
    }));
    
    const newTabs = noteTabs.map(t =>
      t.id === activeNoteTabId ? { ...t, content: nextContent } : t
    );
    onNoteTabsChange(newTabs);
  }, [activeNoteTabId, activeTab?.content, currentTabState, noteTabs, onNoteTabsChange]);

  const handleLanguageChange = (langCode: string) => {
    setTabStates(prev => ({
      ...prev,
      [activeNoteTabId]: {
        ...prev[activeNoteTabId],
        language: langCode,
      },
    }));
    toast({
      title: "Language updated",
      description: `Output language set to ${languages.find(l => l.code === langCode)?.name}`,
    });
  };

  const canUndo = currentTabState.undoStack.length > 0;
  const canRedo = currentTabState.redoStack.length > 0;

  const handleCopyAll = () => {
    if (activeTab?.content) {
      const plain = richEditor?.getText() || activeTab.content.replace(/<[^>]+>/g, '');
      navigator.clipboard.writeText(plain);

      toast({
        title: "Note copied to clipboard",
        description: "The full note content has been copied.",
      });
    } else {
      toast({
        title: "Nothing to copy",
        description: "The note is empty.",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = () => {
    toast({
      title: "Email sent (stub)",
      description: "Email functionality will be available soon.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    toast({
      title: "Exporting as PDF",
      description: "PDF export functionality will be available soon.",
    });
  };

  const handleExportWord = () => {
    toast({
      title: "Exporting as Word",
      description: "Word document export functionality will be available soon.",
    });
  };

  const handleSendToEMR = () => {
    toast({
      title: "Sent to EMR (stub)",
      description: "EMR integration will be available soon.",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Right Pane Header Row - Context/Note toggle only */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        {/* Context / Note Toggle */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onViewChange('context')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-all",
              activeView === 'context'
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <FileText className="h-3.5 w-3.5" />
            Context
          </button>
          <button
            onClick={() => onViewChange('note')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-all",
              activeView === 'note'
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <PenLine className="h-3.5 w-3.5" />
            Note
          </button>
        </div>
      </div>

      {/* Template Tabs Row - Only visible when Note is active */}
      {activeView === 'note' && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/20">
          <div className="flex items-center overflow-x-auto flex-1">
            {noteTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onActiveNoteTabChange(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm transition-colors whitespace-nowrap rounded-md mx-0.5",
                  tab.id === activeNoteTabId
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <FileText className="h-3.5 w-3.5" />
                <span className="max-w-[120px] truncate">{tab.title}</span>
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  className="ml-1 p-0.5 rounded hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </button>
              </button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 shrink-0"
              onClick={addNewTab}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Template Selection and Actions Row - Only in Note view */}
      {activeView === 'note' && (
        <div className="flex items-center gap-3 px-4 py-2 border-b border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 h-8" disabled={isGenerating}>
                {selectedTemplate ? (
                  <>
                    <span>{selectedTemplate.icon}</span>
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
            <DropdownMenuContent className="w-64 bg-popover">
              {availableTemplates.map(template => (
                <DropdownMenuItem
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className="flex items-center gap-2"
                >
                  <span>{template.icon}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{template.name}</span>
                    <span className="text-xs text-muted-foreground">{template.type}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Actions Menu - Streamlined */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-popover">
              <DropdownMenuItem onClick={handleExportPDF}>
                <FileDown className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="ml-auto flex items-center gap-1">
            {hasGeneratedContent && currentMode === 'preview' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 px-2"
                onClick={() => setMode('edit')}
                title="Edit note"
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
                  title="Preview"
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




            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleCopyAll}
              disabled={!activeTab?.content}
              title="Copy note"
            >
              <Copy className="h-4 w-4" />
            </Button>

            {/* Language Selector */}
            <Select value={currentTabState.language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-auto h-8 gap-1 border-0 bg-transparent hover:bg-muted px-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>{languages.find(l => l.code === currentTabState.language)?.flag}</span>
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


        </div>
      )}

      {/* Panel Content */}
      <div className="flex-1 overflow-auto">
        {activeView === 'context' ? (
          // Context Panel
          <div className="flex flex-col h-full p-4">
            {/* CNP Onboarding Documents Banner */}
            {selectedPatient && cnpDocs.length > 0 && cnpImportedFilenames.size === 0 && !cnpBannerDismissed && (
              <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-md border border-primary/30 border-l-4 border-l-primary bg-primary/10 text-sm text-primary">
                <Paperclip className="h-4 w-4 text-primary shrink-0" />
                <span className="flex-1">{cnpDocs.length} documents available from Otto Onboard</span>
                <button
                  onClick={() => setCnpPickerOpen(true)}
                  className="text-sm font-semibold text-primary hover:text-primary/80 px-2"
                >
                  Import
                </button>
                <button
                  onClick={() => setCnpBannerDismissed(true)}
                  className="p-1 rounded text-primary hover:bg-primary/20"
                  aria-label="Dismiss"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {selectedPatient && cnpImportedFilenames.size > 0 && (
              <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-md border border-primary/30 border-l-4 border-l-primary bg-primary/10 text-sm text-primary">
                <Paperclip className="h-4 w-4 shrink-0 text-primary" />
                <span className="flex-1">{cnpImportedFilenames.size} documents imported from Otto Onboard</span>
                <button
                  onClick={() => setCnpPickerOpen(true)}
                  className="text-sm font-semibold text-primary hover:text-primary/80 px-2"
                >
                  {cnpImportedFilenames.size < cnpDocs.length ? 'Add more' : 'View imported'}
                </button>
              </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center gap-1 mb-3 pb-3 border-b border-border">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Text Area */}
            <Textarea
              value={contextContent}
              onChange={(e) => onContextChange(e.target.value)}
              placeholder="Input any additional medical context you want included as part of your note."
              className="flex-1 min-h-[150px] resize-none border-0 shadow-none focus-visible:ring-0 p-0 text-base"
            />

            {/* File attachment area - inside Context panel only */}
            <div className="mt-4">
              <div
                className={cn(
                  "border-2 border-dashed border-border rounded-lg p-4 text-center",
                  "hover:border-primary/50 transition-colors cursor-pointer"
                )}
                onClick={() => document.getElementById('right-panel-file-input')?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
              >
                <input
                  id="right-panel-file-input"
                  type="file"
                  multiple
                  accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <div className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    <span className="text-sm">Drag & drop, click to attach, or paste (Ctrl+V) screenshots</span>
                  </div>
                  <span className="text-xs">PDF, DOCX, DOC, PNG, JPEG</span>
                </div>
              </div>

              {selectedPatient && cnpDocs.length > 0 && cnpBannerDismissed && cnpImportedFilenames.size === 0 && (
                <button
                  onClick={() => setCnpPickerOpen(true)}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 hover:underline underline-offset-2"
                >
                  <Paperclip className="h-3 w-3" />
                  {cnpDocs.length} documents available from Otto Onboard — Show
                </button>
              )}

              {/* Files list with processing status */}
              {attachedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachedFiles.map(file => (
                    <FileProcessingItem
                      key={file.id}
                      file={file}
                      onRemove={removeFile}
                      onRetry={retryProcessing}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Note Panel
          <div className="flex flex-col h-full p-4">
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
                    Please add context or a transcript first.
                  </p>
                </div>
              </div>
            )}

            {/* Note textarea - show when not generating and either has content or no warning */}
            {!isGenerating && (!showNoContentWarning || activeTab?.content) && (
              <>
                {currentMode === 'edit' || !hasGeneratedContent ? (
                  <div className="flex-1 flex flex-col min-h-[300px]">
                    {richEditor && (
                      <div className="mb-2 pb-2 border-b border-border">
                        <RichTextToolbar editor={richEditor} />
                      </div>
                    )}
                    <EditorContent
                      editor={richEditor}
                      className="flex-1 min-h-[260px] [&_.ProseMirror]:min-h-[260px] [&_.ProseMirror]:outline-none"
                    />
                  </div>
                ) : (
                  <div
                    className="flex-1 min-h-[300px] text-base leading-relaxed text-foreground prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: activeTab?.content || '' }}
                  />
                )}


                {/* Review disclaimer + Letter Actions */}
                <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-200">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span>Review your note before use to ensure it accurately represents the visit</span>
                  </div>
                  {hasGeneratedContent && (
                    <div className="flex items-center gap-2 ml-auto shrink-0">
                      {existingLetter ? (
                        <>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {existingLetter.status === 'sent' ? 'Sent' : 'Approved & pending'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Sent to Letters
                          </span>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" size="sm" className="gap-2" onClick={handleMarkReviewed}>
                            <CheckCircle className="h-4 w-4" />
                            Reviewed
                          </Button>
                          {selectedTemplate?.type === 'Letter' && (
                            <Button size="sm" className="gap-2" onClick={() => setShowSendDialog(true)}>
                              <Send className="h-4 w-4" />
                              Send to Letters
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </>
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

      {selectedPatient && cnpDocs.length > 0 && (
        <CnpDocumentsPickerModal
          open={cnpPickerOpen}
          onOpenChange={setCnpPickerOpen}
          patientName={selectedPatient.name}
          partnerName={cnpPartnerName}
          documents={cnpDocs}
          importedFilenames={cnpImportedFilenames}
          onImport={handleCnpImport}
        />
      )}
    </div>
  );
};
