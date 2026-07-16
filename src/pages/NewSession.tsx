import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { SessionHeaderRow } from "@/components/newSession/SessionHeaderRow";
import { SessionInfoBar } from "@/components/newSession/SessionInfoBar";
import { TwoColumnLayout } from "@/components/newSession/TwoColumnLayout";
import { AskAIInput } from "@/components/newSession/AskAIInput";
import { ConsentPopupDialog } from "@/components/newSession/ConsentPopupDialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Patient, RecordingMode, NoteTab, Session } from "@/types/session";
import { useToast } from "@/hooks/use-toast";
import { useSessions } from "@/contexts/SessionsContext";
import { usePatients } from "@/contexts/PatientsContext";
import { useSettings } from "@/contexts/SettingsContext";
import { generateNoteFromTemplate, availableTemplates } from "@/data/templates";
import { format } from "date-fns";
import { DEMO_NOTES } from "@/data/demoContent";
import { DesktopAppPromoModal } from "@/components/onboarding/DesktopAppPromoModal";

const NewSession = () => {
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    addSession,
    updateSession,
    getSession
  } = useSessions();
  const {
    patients,
    addPatient,
    updatePatient: updatePatientInContext,
    deletePatient: deletePatientInContext
  } = usePatients();
  const { privacySettings } = useSettings();
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    return searchParams.get("id");
  });
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientRequired, setPatientRequired] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [selectedPhysician, setSelectedPhysician] = useState<string | null>(null);
  const [recordingMode, setRecordingMode] = useState<RecordingMode>("transcribe");
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [selectedMicrophoneId, setSelectedMicrophoneId] = useState("");
  const [selectedSpeakerId, setSelectedSpeakerId] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const [inputLanguage, setInputLanguage] = useState("en");
  const [outputLanguage, setOutputLanguage] = useState("en");
  const [contextContent, setContextContent] = useState("");
  const [transcriptContent, setTranscriptContent] = useState("");
  const [dictationContent, setDictationContent] = useState("");
  const [noteTabs, setNoteTabs] = useState<NoteTab[]>([{
    id: "1",
    title: "Untitled 1",
    templateId: "",
    content: ""
  }]);
  const [activeNoteTabId, setActiveNoteTabId] = useState("1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sessionDate] = useState(new Date());
  const pendingClearTranscript = useRef(false);
  const sessionPersistedRef = useRef(false);

  // Generate a local ID on mount without persisting to context
  useEffect(() => {
    if (!currentSessionId) {
      const newId = `session-${Date.now()}`;
      setCurrentSessionId(newId);
    }
  }, [currentSessionId]);
  useEffect(() => {
    if (currentSessionId) {
      const existingSession = getSession(currentSessionId);
      if (existingSession) {
        sessionPersistedRef.current = true;
        setContextContent(existingSession.contextContent || "");
        setTranscriptContent(existingSession.transcriptContent || "");
        setDictationContent(existingSession.dictationContent || "");
        setRecordingMode(existingSession.mode || "transcribe");
        setInputLanguage(existingSession.inputLanguage || "en");
        setOutputLanguage(existingSession.outputLanguage || "en");
        if (existingSession.patientId) {
          const patient = patients.find(p => p.id === existingSession.patientId);
          if (patient) setSelectedPatient(patient);
        }
        if (existingSession.notes && existingSession.notes.length > 0) {
          setNoteTabs(existingSession.notes.map(n => ({
            id: n.id,
            title: n.title,
            templateId: n.type,
            content: n.content
          })));
        }
      }
    }
  }, [currentSessionId, getSession, patients]);
  const saveSessionChanges = useCallback(() => {
    if (!currentSessionId) return;

    const hasAnyContent =
      contextContent.trim().length > 0 ||
      transcriptContent.trim().length > 0 ||
      dictationContent.trim().length > 0 ||
      !!selectedPatient ||
      noteTabs.some(t => t.content.trim().length > 0);

    if (!sessionPersistedRef.current) {
      // Only persist once user has provided meaningful input
      if (!hasAnyContent) return;

      const now = new Date();
      const newSession: Session = {
        id: currentSessionId,
        title: selectedPatient?.name || "Untitled session",
        date: now,
        time: format(now, "h:mma"),
        language: "English",
        duration: 0,
        status: "draft",
        hasTranscript: transcriptContent.trim().length > 0,
        hasNotes: noteTabs.some(t => t.content.trim().length > 0),
        mode: recordingMode,
        contextContent,
        transcriptContent,
        dictationContent,
        inputLanguage,
        outputLanguage,
        patientId: selectedPatient?.id,
        patientName: selectedPatient?.name,
        notes: noteTabs.map(t => ({
          id: t.id,
          type: (t.templateId || "custom") as "clinical_note" | "custom" | "letter_to_gp" | "soap_note",
          title: t.title,
          content: t.content,
          isClosable: true
        }))
      };
      addSession(newSession);
      sessionPersistedRef.current = true;
      return;
    }

    updateSession(currentSessionId, {
      contextContent,
      transcriptContent,
      dictationContent,
      mode: recordingMode,
      inputLanguage,
      outputLanguage,
      patientId: selectedPatient?.id,
      patientName: selectedPatient?.name,
      title: selectedPatient?.name || "Untitled session",
      hasTranscript: transcriptContent.trim().length > 0,
      notes: noteTabs.map(t => ({
        id: t.id,
        type: (t.templateId || "custom") as "clinical_note" | "custom" | "letter_to_gp" | "soap_note",
        title: t.title,
        content: t.content,
        isClosable: true
      }))
    });
  }, [currentSessionId, addSession, updateSession, contextContent, transcriptContent, dictationContent, recordingMode, inputLanguage, outputLanguage, selectedPatient, noteTabs]);
  useEffect(() => {
    const timeout = setTimeout(() => saveSessionChanges(), 1000);
    return () => clearTimeout(timeout);
  }, [saveSessionChanges]);
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording && !isPaused) {
      interval = setInterval(() => setRecordingDuration(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording && !isPaused) {
      interval = setInterval(() => setAudioLevel(Math.random() * 100), 100);
    } else {
      setAudioLevel(0);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);
  const startRecording = useCallback((clearTranscript = false) => {
    if (clearTranscript) {
      if (recordingMode === 'transcribe') {
        setTranscriptContent("");
      } else {
        setDictationContent("");
      }
    }
    setRecordingDuration(0);
    setIsPaused(false);
    setIsRecording(true);
    toast({
      title: "Recording started",
      description: `${recordingMode === "transcribe" ? "Transcribing" : "Dictating"}...`
    });
  }, [recordingMode, toast]);

  const handleToggleRecording = useCallback(() => {
    if (!isRecording) {
      // Check if there's existing content
      const hasExistingContent = recordingMode === 'transcribe'
        ? transcriptContent.trim().length > 0
        : dictationContent.trim().length > 0;

      if (hasExistingContent) {
        setShowRestartDialog(true);
        return;
      }

      // No existing content - check consent then start
      if (privacySettings.consentPopupEnabled) {
        setShowConsentDialog(true);
      } else {
        startRecording();
      }
    } else {
      // Stopping recording
      setIsRecording(false);
      setIsPaused(false);
      toast({
        title: "Recording stopped",
        description: "Your recording has been saved."
      });
    }
  }, [isRecording, recordingMode, transcriptContent, dictationContent, privacySettings.consentPopupEnabled, startRecording, toast]);

  const handleRestartKeep = useCallback(() => {
    setShowRestartDialog(false);
    pendingClearTranscript.current = false;
    if (privacySettings.consentPopupEnabled) {
      setShowConsentDialog(true);
    } else {
      startRecording(false);
    }
  }, [privacySettings.consentPopupEnabled, startRecording]);

  const handleRestartFresh = useCallback(() => {
    setShowRestartDialog(false);
    pendingClearTranscript.current = true;
    if (privacySettings.consentPopupEnabled) {
      setShowConsentDialog(true);
    } else {
      startRecording(true);
    }
  }, [privacySettings.consentPopupEnabled, startRecording]);

  const handleTogglePause = useCallback(() => {
    setIsPaused(prev => {
      const newPaused = !prev;
      toast({
        title: newPaused ? "Recording paused" : "Recording resumed",
        description: newPaused ? "Click Resume to continue." : `${recordingMode === "transcribe" ? "Transcribing" : "Dictating"}...`
      });
      return newPaused;
    });
  }, [recordingMode, toast]);
  const handleModeChange = (mode: RecordingMode) => setRecordingMode(mode);
  const handleUploadAudio = () => toast({
    title: "Upload audio",
    description: "Audio upload feature coming soon."
  });
  const handleSelectPatient = (patient: Patient | null) => {
    setSelectedPatient(patient);
    if (patient) setPatientRequired(false);
    if (currentSessionId && patient) {
      updateSession(currentSessionId, {
        patientId: patient.id,
        patientName: patient.name,
        title: patient.name
      });
    } else if (currentSessionId) {
      updateSession(currentSessionId, {
        patientId: undefined,
        patientName: undefined,
        title: "Untitled session"
      });
    }
  };
  const handleCreatePatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    addPatient(newPatient);
    handleSelectPatient(newPatient);
    toast({
      title: "Patient created",
      description: `${patientData.name} has been added.`
    });
  };
  const handleUpdatePatient = (patient: Patient) => {
    updatePatientInContext(patient.id, patient);
    if (selectedPatient?.id === patient.id) setSelectedPatient(patient);
    toast({
      title: "Patient updated",
      description: "Changes have been saved."
    });
  };
  const handleDeletePatient = (patientId: string) => {
    deletePatientInContext(patientId);
    if (selectedPatient?.id === patientId) setSelectedPatient(null);
    toast({
      title: "Patient deleted",
      description: "Patient has been removed.",
      variant: "destructive"
    });
  };
  const handleAISubmit = (prompt: string) => toast({
    title: "Processing...",
    description: `AI is working on: "${prompt}"`
  });
  const hasContent = contextContent.trim().length > 0 || transcriptContent.trim().length > 0 || dictationContent.trim().length > 0;
  const handleGenerate = useCallback((templateId: string) => {
    if (!templateId) return;
    setIsGenerating(true);
    setTimeout(() => {
      const template = availableTemplates.find(t => t.id === templateId);
      const generatedContent = generateNoteFromTemplate(templateId, transcriptContent, contextContent);
      let updatedTabs: NoteTab[] = [];
      setNoteTabs(prevTabs => {
        const mapped = prevTabs.map(t => t.id === activeNoteTabId ? {
          ...t,
          templateId,
          title: template?.name || t.title,
          content: generatedContent
        } : t);
        updatedTabs = mapped;
        return mapped;
      });
      setIsGenerating(false);
      if (currentSessionId) {
        updateSession(currentSessionId, {
          status: "complete",
          hasNotes: true,
          notes: updatedTabs.map(t => ({
            id: t.id,
            type: t.templateId as any || "custom",
            title: t.title,
            content: t.content,
            isClosable: true
          }))
        });
      }
      toast({
        title: "Note generated",
        description: `${template?.name} has been created.`
      });
    }, 800);
  }, [activeNoteTabId, toast, currentSessionId, updateSession, transcriptContent, contextContent]);
  return <AppLayout>
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background w-full">
        <SessionHeaderRow
          selectedPatient={selectedPatient}
          patients={patients}
          onSelectPatient={handleSelectPatient}
          onCreatePatient={handleCreatePatient}
          onUpdatePatient={handleUpdatePatient}
          onDeletePatient={handleDeletePatient}
          isPatientHighlighted={patientRequired}
          selectedPartner={selectedPartner}
          onPartnerChange={setSelectedPartner}
          selectedPhysician={selectedPhysician}
          onPhysicianChange={setSelectedPhysician}
          recordingMode={recordingMode}
          onModeChange={handleModeChange}
        />

        <SessionInfoBar sessionDate={sessionDate} recordingDuration={recordingDuration} selectedMicrophoneId={selectedMicrophoneId} onMicrophoneChange={setSelectedMicrophoneId} selectedSpeakerId={selectedSpeakerId} onSpeakerChange={setSelectedSpeakerId} audioLevel={audioLevel} recordingMode={recordingMode} isRecording={isRecording} isPaused={isPaused} onModeChange={handleModeChange} onToggleRecording={handleToggleRecording} onTogglePause={handleTogglePause} onUploadAudio={handleUploadAudio} />

        <div className="flex-1 overflow-hidden">
          <TwoColumnLayout recordingMode={recordingMode} transcriptContent={transcriptContent} onTranscriptChange={setTranscriptContent} isRecording={isRecording} isPaused={isPaused} contextContent={contextContent} onContextChange={setContextContent} noteTabs={noteTabs} activeNoteTabId={activeNoteTabId} onNoteTabsChange={setNoteTabs} onActiveNoteTabChange={setActiveNoteTabId} isGenerating={isGenerating} hasContent={hasContent} onGenerate={handleGenerate} sessionId={currentSessionId || undefined} patientName={selectedPatient?.name} sessionDate={sessionDate} selectedPatient={selectedPatient} />
        </div>

        {/* Helper text - Review note warning */}
        <div className="px-4 py-2 bg-muted/30 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-amber-500">⚠</span>
            <span>Review your note before use to ensure it accurately represents the visit</span>
          </div>
        </div>
      </div>

      {/* Consent Popup Dialog */}
      <ConsentPopupDialog
        open={showConsentDialog}
        onOpenChange={setShowConsentDialog}
        onConfirm={() => startRecording(pendingClearTranscript.current)}
      />

      {/* Restart Confirmation Dialog */}
      <AlertDialog open={showRestartDialog} onOpenChange={setShowRestartDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Existing {recordingMode === 'transcribe' ? 'transcript' : 'dictation'} found</AlertDialogTitle>
            <AlertDialogDescription>
              You already have content from a previous recording. Would you like to keep it and continue, or start fresh?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-0">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-muted text-foreground hover:bg-muted/80" onClick={handleRestartKeep}>
              Keep &amp; Continue
            </AlertDialogAction>
            <AlertDialogAction onClick={handleRestartFresh}>
              Start Fresh
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DesktopAppPromoModal />
    </AppLayout>;
};
export default NewSession;