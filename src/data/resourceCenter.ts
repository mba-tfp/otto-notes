import { MessageSquare } from 'lucide-react';

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
  icon?: React.ComponentType<{ className?: string }>;
  videoUrl?: string;
  duration?: string;
  date?: string;
  content: string;
  isVideo?: boolean;
}

export const categories: ResourceCategory[] = [
  { id: 'getting-started', label: 'Getting Started', description: 'Onboarding guides for new users' },
  { id: 'contact-support', label: 'Contact Support', description: 'Chat with our support team' },
];

export const topics: ResourceTopic[] = [
  // Getting Started — Video Guides
  {
    id: 'letters-workflow',
    categoryId: 'getting-started',
    title: 'Letters workflow',
    description: 'Learn how to create, review, and send referral letters from a session.',
    videoUrl: 'https://vimeo.com/1219876667/e0e9f04f7d?share=copy&fl=sv&fe=ci',
    duration: '3:24',
    date: 'Aug 15, 2026',
    isVideo: true,
    content: `
## Letters workflow

This guide covers the complete letters workflow in Otto Notes.

### Step 1: Generate a note
Start a session and capture your consultation notes. Once the note is ready, click **Send to Letters**.

### Step 2: Review the letter
The letter is generated automatically from the session content. Review the draft and make any edits.

### Step 3: Send or save
When ready, mark the letter as reviewed and send it to the recipient. Letters can also be saved to send later.

### Note
Administrator and General Admin roles see all clinic letters, physicians and nurses only see their own. Mark as sent is final, the letter becomes read only after.
    `,
  },
  {
    id: 'manage-create-templates',
    categoryId: 'getting-started',
    title: 'Manage and create templates',
    description: 'Build custom templates and organize your personal template library.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '4:12',
    date: 'Aug 14, 2026',
    isVideo: true,
    content: `
## Manage and create templates

This guide covers how to manage and build templates in Otto Notes.

### Step 1: Browse your library
Go to **My Templates** to search, sort, and manage your personal templates. Hover over any template to edit, duplicate, or delete it.

### Step 2: Start a new template
Click **Create a template**, then add a name and description.

### Step 3: Build the content
Use plain text for section headings, square brackets for placeholders the AI fills in, quotation marks for word-for-word content, and round brackets for AI instructions.

### Step 4: Set visibility and type
Visibility is **Just me**, **Clinic**, or **TFP Network**. Type is **Note** for clinical notes, **Letter** for letters routed to the Letters section, or **Document** for general forms. Flag before publishing, the template editor's Type field needs to be confirmed live, one internal reference lists only Note and Document as dropdown options.

### Step 5: Save
The template is now available from the Note tab dropdown in your sessions.
    `,
  },
  {
    id: 'template-hub',
    categoryId: 'getting-started',
    title: 'Template hub',
    description: 'Browse and install templates shared by the Otto Notes community.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '2:48',
    date: 'Aug 13, 2026',
    isVideo: true,
    content: `
## Template hub

This guide covers how to find and use community templates in Otto Notes.

### Step 1: Browse the hub
Go to **Template hub** to see templates shared across the TFP network. Filter by clinic, specialty, or category, or search directly.

### Step 2: Preview a template
Click a card to see who created it, their specialty and clinic, and the full template content.

### Step 3: Add it to your library
One click adds it to **My Templates**, where you can edit and customize it.
    `,
  },
  {
    id: 'settings-in-otto',
    categoryId: 'getting-started',
    title: 'Settings in Otto notes',
    description: 'Configure your profile, signature, AI preferences, and account settings.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '5:06',
    date: 'Aug 12, 2026',
    isVideo: true,
    content: `
## Settings in Otto notes

This guide covers your settings and preferences in Otto Notes.

### Step 1: Update your profile
Manage your name, title, and contact information.

### Step 2: Set your signature
Add or update your signature, and toggle whether it's appended automatically to AI-generated letters.

### Step 3: Adjust AI settings
Writing style controls how brief or detailed notes are, language diversity controls how varied the phrasing is. Neither changes what content is included.

### Step 4: Manage users
Administrator and General Admin roles can invite, disable, or delete users here.

### Step 5: Update security
Change your account password.
    `,
  },
  {
    id: 'generating-note',
    categoryId: 'getting-started',
    title: 'Generating a note in Otto notes',
    description: 'Capture audio or dictation and convert it into a structured clinical note.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '6:15',
    date: 'Aug 11, 2026',
    isVideo: true,
    content: `
## Generating a note in Otto notes

This guide covers how to generate a note in Otto Notes.

### Step 1: Start a session
Click **New session** and add patient details, searching from Otto Onboard, previously CNP, or your EMR, or create a new patient.

### Step 2: Capture the encounter
Use **Transcribe** with your microphone, or switch to **Dictate**. Add extra context by typing in the **Context** tab, or upload supporting documents like lab results.

### Step 3: Generate the note
Go to the **Note** tab, select a template, and Otto will generate the note from your transcript, context, and any uploaded files.

### Step 4: Review and confirm
Check the AI-generated note, edit if needed, and click **Reviewed**. Use the + icon to try a different template on the same transcript without overwriting this note.
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
