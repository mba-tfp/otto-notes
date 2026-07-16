export interface Session {
  id: string;
  title: string;
  patientId?: string;
  patientName?: string;
  patientDetails?: string;
  date: Date;
  time: string;
  language: string;
  duration: number; // in seconds
  status: 'empty' | 'recording' | 'processing' | 'complete' | 'error' | 'draft';
  hasTranscript: boolean;
  hasNotes: boolean;
  transcript?: TranscriptData;
  dictation?: string;
  notes?: NoteData[];
  mode: RecordingMode;
  contextContent: string;
  transcriptContent: string;
  dictationContent: string;
  inputLanguage: string;
  outputLanguage: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Patient {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  identifier?: string;
  additionalContext?: string;
  emrId?: string;
  cnpId?: string;
  dateOfBirth?: Date;
  partnerFirstName?: string;
  partnerLastName?: string;
  partnerEmrId?: string;
  partnerDateOfBirth?: Date;
  referringPhysicianId?: string;
  referringPhysicianName?: string;
  referringPhysicianClinic?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReferringPhysician {
  id: string;
  first_name: string;
  last_name: string;
  clinic_name?: string;
  city?: string;
  province?: string;
  specialty?: string;
}

export interface NoteTab {
  id: string;
  title: string;
  templateId: string;
  content: string;
}

export type RecordingMode = 'transcribe' | 'dictate';
export type MainTab = 'context' | 'transcript' | 'dictation' | 'note';

export interface TranscriptData {
  segments: {
    timestamp: string;
    text: string;
  }[];
  fullText: string;
}

export interface NoteData {
  id: string;
  type: 'clinical_note' | 'letter_to_gp' | 'soap_note' | 'custom';
  title: string;
  content: string;
  isClosable: boolean;
}

export const demoSessions: Session[] = [
  {
    id: "1",
    title: "Untitled session",
    date: new Date("2025-11-27T22:45:00"),
    time: "10:45PM",
    language: "English",
    duration: 0,
    status: "draft",
    hasTranscript: false,
    hasNotes: false,
    mode: 'transcribe',
    contextContent: '',
    transcriptContent: '',
    dictationContent: '',
    inputLanguage: 'en',
    outputLanguage: 'en'
  },
  {
    id: "2",
    title: "John Smith - Follow-up",
    patientName: "John Smith",
    date: new Date("2025-11-27T17:36:00"),
    time: "5:36PM",
    language: "English",
    duration: 312,
    status: "complete",
    hasTranscript: true,
    hasNotes: true,
    mode: 'transcribe',
    contextContent: 'Patient: 45-year-old male\nOccupation: Accountant',
    transcriptContent: "Patient is a 45-year-old male presenting with complaints of persistent lower back pain.",
    dictationContent: '',
    inputLanguage: 'en',
    outputLanguage: 'en',
    transcript: {
      segments: [
        { timestamp: "0:00", text: "Patient is a 45-year-old male presenting with complaints of persistent lower back pain." }
      ],
      fullText: "Patient is a 45-year-old male presenting with complaints of persistent lower back pain."
    },
    notes: [
      {
        id: "n1",
        type: "clinical_note",
        title: "SOAP Note",
        content: "SUBJECTIVE:\n45-year-old male presenting with persistent lower back pain...",
        isClosable: true
      }
    ]
  },
  {
    id: "3",
    title: "Sarah Johnson",
    patientName: "Sarah Johnson",
    patientDetails: "New patient consultation",
    date: new Date("2025-11-26T02:59:00"),
    time: "2:59AM",
    language: "English",
    duration: 422,
    status: "complete",
    hasTranscript: true,
    hasNotes: true,
    mode: 'dictate',
    contextContent: '',
    transcriptContent: '',
    dictationContent: "This patient came to see me for an initial consultation...",
    inputLanguage: 'en',
    outputLanguage: 'en',
    notes: [
      {
        id: "n1",
        type: "letter_to_gp",
        title: "GP Referral Letter",
        content: "Dear Doctor,\n\nRe: Sarah Johnson\n\nI am writing to refer the above patient...",
        isClosable: true
      }
    ]
  },
  {
    id: "4",
    title: "Michael Chen",
    patientName: "Michael Chen",
    date: new Date("2025-11-27T17:34:00"),
    time: "5:34PM",
    language: "English",
    duration: 0,
    status: "draft",
    hasTranscript: false,
    hasNotes: false,
    mode: 'transcribe',
    contextContent: '',
    transcriptContent: '',
    dictationContent: '',
    inputLanguage: 'en',
    outputLanguage: 'en'
  }
];
