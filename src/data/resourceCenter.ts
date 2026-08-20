import { BookOpen, FileText, Mic, Mail, Sparkles, MessageSquare } from 'lucide-react';

export interface ResourceCategory {
  id: string;
  label: string;
  description: string;
}

export interface ResourceTopic {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  videoUrl?: string;
  content: string;
}

export const categories: ResourceCategory[] = [
  { id: 'getting-started', label: 'Getting Started', description: 'Onboarding guides for new users' },
  { id: 'contact-support', label: 'Contact Support', description: 'Chat with our support team' },
];

export const topics: ResourceTopic[] = [
  // Getting Started
  {
    id: 'create-first-session',
    categoryId: 'getting-started',
    title: 'Create Your First Session',
    description: 'Learn how to start a new clinical session and capture notes.',
    icon: BookOpen,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: `
## Create Your First Session

Getting started with Otto Notes is simple. Follow these steps to create your first clinical session.

### Step 1: Click "New Session"
Navigate to the sidebar and click the **New Session** button. This will open a blank session workspace.

### Step 2: Add Patient Details
Use the patient selector at the top to search for an existing patient or add a new one. Fill in the relevant demographic information.

### Step 3: Choose Your Input Method
You can capture clinical notes in several ways:
- **Dictation**: Use real-time voice recording to capture your notes hands-free.
- **Manual Entry**: Type directly into the note editor.
- **Context Panel**: Add relevant medical context before generating notes.

### Step 4: Generate & Review
Once you've captured your input, click **Generate Note** to produce a structured clinical note. Review and edit as needed before saving.

### Tips
- Use templates to standardize your note format across visits.
- You can attach files like lab results or referral letters to any session.
- The AI Assistant can help refine or restructure your notes.
    `,
  },
  {
    id: 'using-templates',
    categoryId: 'getting-started',
    title: 'Using Templates',
    description: 'Customize and apply templates to streamline your workflow.',
    icon: FileText,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: `
## Using Templates

Templates help you maintain consistency and save time across clinical encounters.

### Accessing Templates
Navigate to **My Templates** from the sidebar to view your saved templates, or visit the **Template Hub** to discover community-shared templates.

### Creating a Template
1. Click **Create Template** in the My Templates page.
2. Choose a template type (e.g., SOAP Note, Consultation, Follow-up).
3. Define the structure, headings, and any default content.
4. Save your template for future use.

### Applying a Template
When starting a new session, select a template from the template picker. The note structure will be pre-filled based on your template, and you can customize it per encounter.

### Tips
- Star your most-used templates for quick access.
- Templates can include placeholder variables that auto-fill with patient data.
    `,
  },
  {
    id: 'dictation-recording',
    categoryId: 'getting-started',
    title: 'Dictation & Recording',
    description: 'Use voice recording to capture clinical notes hands-free.',
    icon: Mic,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: `
## Dictation & Recording

Otto Notes supports real-time voice dictation so you can focus on your patient while your notes are captured automatically.

### Starting a Recording
1. Open a new or existing session.
2. Click the **Record** button in the dictation panel.
3. Speak naturally — Otto Notes will transcribe your words in real time.

### Recording Modes
- **Monologue**: Best for solo dictation where only the physician is speaking.
- **Dialogue**: Captures a two-way conversation between physician and patient.

### Editing Transcripts
After recording, review the transcript in the Transcript tab. You can edit any text before generating the final note.

### Tips
- Use a high-quality microphone for best results.
- Speak clearly and at a moderate pace.
- You can pause and resume recording as needed.
    `,
  },
  {
    id: 'managing-letters',
    categoryId: 'getting-started',
    title: 'Managing Letters',
    description: 'Create, send, and manage referral and patient letters.',
    icon: Mail,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: `
## Managing Letters

The Letters section helps you create and manage referral letters, patient correspondence, and other clinical documents.

### Creating a Letter
1. Navigate to **Letters** from the sidebar.
2. Letters are automatically generated when you send a note from a session.
3. You can also create letters manually from the Letters page.

### Letter Statuses
- **To be sent**: Draft letters awaiting review and sending.
- **Sent**: Letters that have been finalized and sent.

### Deleting Letters
If a letter was created by mistake, you can delete it from the letter detail view or the letter list (only for "To be sent" letters).

### Tips
- Review all letters before sending to ensure accuracy.
- Use the physician search to quickly find referring doctors.
    `,
  },
  {
    id: 'ai-assistant-basics',
    categoryId: 'getting-started',
    title: 'AI Assistant Basics',
    description: 'Learn how to use the AI assistant to enhance your notes.',
    icon: Sparkles,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: `
## AI Assistant Basics

The AI Assistant helps you refine, restructure, and enhance your clinical notes using natural language commands.

### Accessing the AI Assistant
Click **AI Assistant** in the sidebar to open the assistant. You can start a new conversation or continue a previous one.

### What Can the AI Assistant Do?
- **Summarize** lengthy notes into concise formats.
- **Restructure** notes into different templates (e.g., SOAP format).
- **Suggest** missing clinical information or follow-up actions.
- **Translate** notes into different languages.

### Tips
- Be specific in your prompts for best results.
- You can ask follow-up questions to refine the output.
- The assistant works best with structured clinical content.
    `,
  },

  // Contact Support
  {
    id: 'send-message',
    categoryId: 'contact-support',
    title: 'Send us a message',
    description: 'Chat with our support team — we typically reply in under 10 minutes.',
    icon: MessageSquare,
    content: '',
  },
];
