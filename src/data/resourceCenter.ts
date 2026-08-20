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

The Template Hub is your source for community-shared templates across specialties and clinics.

### Browsing templates
Use filters for specialty, clinic, template type, and language to find the right template.

### Installing a template
1. Open a template detail page.
2. Click **Use Template** to add it to your library.
3. Customize it to fit your workflow.

### Tips
- Filter by your specialty to see the most relevant templates first.
- Community templates can be cloned and modified privately.
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

Personalize Otto Notes to match your workflow and preferences.

### Profile
Update your name, clinic, specialty, and contact details. These fields are used throughout the app.

### Signature
Create a digital signature using the rich text editor. It is applied to letters and documents automatically.

### AI settings
Adjust **Temperature** and **Nucleus Sampling** to control how creative or focused the AI output is.

### Privacy
Manage consent and data-sharing preferences from a single toggle.

### Tips
- Remember to click **Save** after making changes in any settings tab.
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

Otto Notes turns your spoken or written input into a structured clinical note.

### Step 1: Choose an input method
- **Transcribe** captures live conversation.
- **Dictate** is optimized for monologue-style dictation.
- **Virtual Call** handles remote consultation audio.

### Step 2: Add context
Select the patient, template type, and any relevant documents before generating.

### Step 3: Generate and review
Click **Generate Note** to produce a structured draft. Review the output, edit as needed, and save.

### Tips
- Use pause and resume during long recordings.
- Attach files to give the AI more context about the patient.
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
