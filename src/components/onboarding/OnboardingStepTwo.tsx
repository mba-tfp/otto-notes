import { useMemo, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExt from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { RichTextToolbar } from '@/components/letters/RichTextToolbar';
import type { OnboardingFormState } from './NewUserOnboardingModal';

const SIGNATURE_STORAGE_KEY = 'medical-scribe-signature-settings';

interface Props {
  form: OnboardingFormState;
  onBack: () => void;
  onContinue: () => void;
}

export const OnboardingStepTwo = ({ form, onBack, onContinue }: Props) => {
  const defaultSignature = useMemo(() => {
    const name = `${form.title} ${form.firstName} ${form.lastName}`.trim();
    return `<p>${name}${form.specialty ? ` — ${form.specialty}` : ''}</p>`;
  }, [form]);

  const [appendToLetters, setAppendToLetters] = useState(true);
  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExt,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: defaultSignature,
  });

  const handleContinue = () => {
    localStorage.setItem(
      SIGNATURE_STORAGE_KEY,
      JSON.stringify({
        content: editor?.getHTML() || defaultSignature,
        enabled: true,
        appendToLetters,
      })
    );
    onContinue();
  };

  return (
    <div>
      <header className="relative border-b border-border px-6 pb-4 pt-6">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="absolute left-5 top-6 gap-1.5 px-1 text-muted-foreground hover:bg-transparent hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <DialogTitle className="text-center text-2xl font-semibold text-foreground">
          Set up your signature
        </DialogTitle>
        <DialogDescription className="mt-1 text-center text-sm text-muted-foreground">
          Create a signature to append to your notes and letters.
        </DialogDescription>
      </header>

      <div className="space-y-6 p-6">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-foreground">Signature content</Label>
          {editor && (
            <div className="overflow-hidden rounded-md border border-border">
              <div className="border-b border-border px-1 py-1">
                <RichTextToolbar
                  editor={editor}
                  exclude={['Heading 1', 'Heading 2', 'Heading 3', 'Strikethrough', 'Justify']}
                />
              </div>
              <EditorContent
                editor={editor}
                className="min-h-[132px] px-4 py-5 text-base text-muted-foreground [&_.tiptap]:min-h-[90px] [&_.tiptap]:outline-none"
              />
            </div>
          )}
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-6">
          <div className="space-y-1">
            <Label className="text-sm font-medium text-foreground">Append to AI-generated letters</Label>
            <p className="text-sm text-muted-foreground">Auto-add signature to AI-generated letters.</p>
          </div>
          <Switch checked={appendToLetters} onCheckedChange={setAppendToLetters} />
        </div>

        <Button type="button" size="lg" className="w-full" onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
};