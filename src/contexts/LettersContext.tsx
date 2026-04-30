import { createContext, useContext, useState, ReactNode } from 'react';
import { Letter, LetterStatus, LetterFormData } from '@/types/letter';

interface LettersContextType {
  letters: Letter[];
  selectedLetterId: string | null;
  setSelectedLetterId: (id: string | null) => void;
  getLettersByStatus: (status: LetterStatus) => Letter[];
  getLetter: (id: string) => Letter | undefined;
  createLetter: (data: LetterFormData) => Letter;
  updateLetterContent: (id: string, content: string) => void;
  markAsSent: (id: string) => void;
  unsendLetter: (id: string) => void;
  deleteLetter: (id: string) => void;
  acknowledgeDoctorNote: (id: string) => void;
  getLetterBySessionId: (sessionId: string) => Letter | undefined;
}

const LettersContext = createContext<LettersContextType | undefined>(undefined);

const UNSEND_WINDOW_MS = 24 * 60 * 60 * 1000;

export const canUnsend = (letter: Letter | undefined | null): boolean => {
  if (!letter || letter.status !== 'sent' || !letter.sentAt) return false;
  return Date.now() - new Date(letter.sentAt).getTime() < UNSEND_WINDOW_MS;
};

// Demo data
const demoLetters: Letter[] = [
  {
    id: 'letter-1',
    sessionId: 'session-1',
    patientName: 'Sarah Johnson',
    patientId: 'patient-1',
    sessionDate: new Date('2024-12-15'),
    templateType: 'Letter to GP',
    originatingDoctor: 'Dr. Shahid Saya',
    status: 'to_be_sent',
    content: `<p>Dear Dr. Smith,</p>
<p>Re: <strong>Sarah Johnson</strong> (DOB: 15/03/1985)</p>
<p>Thank you for referring this patient who attended our fertility clinic on 15th December 2024. I am writing to update you on our findings and proposed management plan.</p>
<h3>History</h3>
<p>Mrs. Johnson is a 39-year-old woman who has been trying to conceive for approximately 18 months. She reports regular menstrual cycles of 28–30 days with no intermenstrual or post-coital bleeding. There is no significant past medical or surgical history. She is a non-smoker and consumes alcohol occasionally.</p>
<h3>Previous Investigations</h3>
<ul>
<li>Day 2 FSH: 7.2 IU/L (normal)</li>
<li>AMH: 14.8 pmol/L (satisfactory ovarian reserve)</li>
<li>Transvaginal ultrasound: Normal uterine cavity, bilateral ovaries with antral follicle count of 12</li>
<li>Hysterosalpingogram: Bilateral tubal patency confirmed</li>
<li>Partner semen analysis: Within normal parameters (WHO 2021 criteria)</li>
</ul>
<h3>Assessment</h3>
<p>Based on the above investigations, this couple has <strong>unexplained subfertility</strong>. Given Mrs. Johnson's age and duration of subfertility, we have discussed the treatment options available including ovulation induction with timed intercourse, intrauterine insemination (IUI), and in vitro fertilisation (IVF).</p>
<h3>Plan</h3>
<ol>
<li>The patient has elected to proceed with IVF treatment</li>
<li>First cycle planned for January 2025 following pre-treatment screening</li>
<li>Commenced on folic acid 5mg daily and vitamin D supplementation</li>
<li>Counselling session arranged for 22nd December 2024</li>
</ol>
<p>I would be grateful if you could continue to prescribe folic acid 5mg daily for this patient. Please do not hesitate to contact me if you require any further information.</p>
<p>Yours sincerely,<br>
<strong>Dr. Shahid Saya</strong><br>
Consultant in Reproductive Medicine</p>`,
    doctorNote: 'Please double-check the AMH value with the lab report before sending. Also ensure the GP address is correct — patient mentioned she recently changed practices.',
    approvedAt: new Date('2024-12-15T14:30:00'),
    createdAt: new Date('2024-12-15T14:30:00'),
    updatedAt: new Date('2024-12-15T14:30:00'),
  },
  {
    id: 'letter-2',
    sessionId: 'session-2',
    patientName: 'Michael Chen',
    patientId: 'patient-2',
    sessionDate: new Date('2024-12-14'),
    templateType: 'Consult Letter',
    originatingDoctor: 'Dr. Sarah Johnson',
    status: 'to_be_sent',
    content: `Dear Colleague,

Re: Michael Chen - Initial Consultation

This letter confirms that Mr. Chen attended our clinic on 14th December 2024 for an initial fertility assessment.

**History:**
Trying to conceive for 18 months without success.

**Investigations Requested:**
- Semen analysis
- Hormone profile

**Follow-up:**
Patient to return in 4 weeks with results.

Kind regards,
Dr. Sarah Johnson`,
    approvedAt: new Date('2024-12-14T10:00:00'),
    createdAt: new Date('2024-12-14T10:00:00'),
    updatedAt: new Date('2024-12-16T09:00:00'),
  },
  {
    id: 'letter-3',
    sessionId: 'session-3',
    patientName: 'Emily Watson',
    patientId: 'patient-3',
    sessionDate: new Date('2024-12-10'),
    templateType: 'Letter to GP',
    originatingDoctor: 'Dr. Shahid Saya',
    status: 'sent',
    content: `Dear Dr. Thompson,

Re: Emily Watson

Follow-up letter regarding ongoing treatment...`,
    sentAt: new Date('2024-12-11T11:00:00'),
    approvedAt: new Date('2024-12-10T16:00:00'),
    createdAt: new Date('2024-12-10T16:00:00'),
    updatedAt: new Date('2024-12-11T11:00:00'),
  },
  {
    id: 'letter-4',
    sessionId: 'session-4',
    patientName: 'James Williams',
    patientId: 'patient-4',
    sessionDate: new Date('2024-12-12'),
    templateType: 'Letter to GP',
    originatingDoctor: 'Dr. Michael Chen',
    status: 'sent',
    content: `Dear Dr. Richards,

Re: James Williams

Treatment summary letter...`,
    sentAt: new Date('2024-12-13T09:30:00'),
    approvedAt: new Date('2024-12-12T15:00:00'),
    createdAt: new Date('2024-12-12T15:00:00'),
    updatedAt: new Date('2024-12-13T09:30:00'),
  },
];

export const LettersProvider = ({ children }: { children: ReactNode }) => {
  const [letters, setLetters] = useState<Letter[]>(demoLetters);
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);

  const getLettersByStatus = (status: LetterStatus) => {
    return letters.filter(letter => letter.status === status);
  };

  const getLetter = (id: string) => {
    return letters.find(letter => letter.id === id);
  };

  const getLetterBySessionId = (sessionId: string) => {
    return letters.find(letter => letter.sessionId === sessionId);
  };

  const createLetter = (data: LetterFormData): Letter => {
    const newLetter: Letter = {
      id: `letter-${Date.now()}`,
      sessionId: data.sessionId,
      patientName: data.patientName,
      patientId: data.patientId,
      sessionDate: data.sessionDate,
      templateType: data.templateType,
      originatingDoctor: 'Dr. Shahid Saya', // Current user
      status: 'to_be_sent',
      content: data.content,
      doctorNote: data.doctorNote,
      approvedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setLetters(prev => [newLetter, ...prev]);
    return newLetter;
  };

  const updateLetterContent = (id: string, content: string) => {
    setLetters(prev => prev.map(letter => 
      letter.id === id 
        ? { ...letter, content, updatedAt: new Date() }
        : letter
    ));
  };

  const markAsSent = (id: string) => {
    setLetters(prev => prev.map(letter =>
      letter.id === id
        ? { ...letter, status: 'sent' as LetterStatus, sentAt: new Date(), updatedAt: new Date() }
        : letter
    ));
  };

  const unsendLetter = (id: string) => {
    setLetters(prev => prev.map(letter =>
      letter.id === id && canUnsend(letter)
        ? { ...letter, status: 'to_be_sent' as LetterStatus, sentAt: undefined, updatedAt: new Date() }
        : letter
    ));
  };

  const deleteLetter = (id: string) => {
    setLetters(prev => prev.filter(letter => letter.id !== id));
    if (selectedLetterId === id) setSelectedLetterId(null);
  };

  const acknowledgeDoctorNote = (id: string) => {
    setLetters(prev => prev.map(letter =>
      letter.id === id
        ? { ...letter, doctorNoteAcknowledgedAt: new Date(), doctorNoteAcknowledgedBy: 'Current User', updatedAt: new Date() }
        : letter
    ));
  };

  return (
    <LettersContext.Provider value={{
      letters,
      selectedLetterId,
      setSelectedLetterId,
      getLettersByStatus,
      getLetter,
      createLetter,
      updateLetterContent,
      markAsSent,
      deleteLetter,
      acknowledgeDoctorNote,
      getLetterBySessionId,
    }}>
      {children}
    </LettersContext.Provider>
  );
};

export const useLetters = () => {
  const context = useContext(LettersContext);
  if (!context) {
    throw new Error('useLetters must be used within a LettersProvider');
  }
  return context;
};
