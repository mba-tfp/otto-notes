import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingStepOne } from './OnboardingStepOne';
import { OnboardingStepTwo } from './OnboardingStepTwo';
import { OnboardingStepThree } from './OnboardingStepThree';

export interface OnboardingFormState {
  title: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  specialty: string;
  primaryLocation: string;
  phoneCountryCode: string;
  phoneNumber: string;
  displayLanguage: string;
  agreedToTerms: boolean;
}

export const NewUserOnboardingModal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<OnboardingFormState>({
    title: 'Dr.',
    firstName: '',
    lastName: '',
    preferredName: '',
    specialty: '',
    primaryLocation: '',
    phoneCountryCode: 'CA',
    phoneNumber: '',
    displayLanguage: 'English',
    agreedToTerms: false,
  });

  const handleStepOneContinue = async () => {
    const isValid = form.firstName.trim() && form.lastName.trim() && form.specialty;
    if (!isValid) return;
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const res = await supabase.functions.invoke('update-user-profile', {
          body: {
            first_name: form.firstName.trim(),
            last_name: form.lastName.trim(),
            signature_title: form.title,
            signature_preferred_name: form.preferredName.trim() || null,
            signature_specialty: form.specialty,
            primary_location: form.primaryLocation || null,
            phone_country_code: form.phoneCountryCode,
            phone_number: form.phoneNumber.trim() || null,
            language: form.displayLanguage,
            profile_completed: true,
          },
        });
        if (res.error) throw res.error;
      }
    } catch (error) {
      console.error('Profile setup error:', error);
    } finally {
      setSaving(false);
    }
    setStep(2);
  };

  const finishOnboarding = () => {
    toast({ title: 'Welcome!', description: 'Your profile has been set up successfully.' });
    navigate('/new-session');
  };

  // Dynamic width: profile and signature are compact, training is wider for its two-column list.
  const modalWidth = step === 3 ? 'max-w-2xl' : step === 1 ? 'max-w-[512px]' : 'max-w-[512px]';

  return (
    <Dialog open modal>
      <DialogContent
        className={`${modalWidth} max-h-[90vh] p-0 gap-0 overflow-hidden transition-all`}
        hideCloseButton
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {step === 1 ? (
          <OnboardingStepOne
            form={form}
            setForm={setForm}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            saving={saving}
            onContinue={handleStepOneContinue}
          />
        ) : step === 2 ? (
          <OnboardingStepTwo
            form={form}
            onBack={() => setStep(1)}
            onContinue={() => setStep(3)}
          />
        ) : (
          <OnboardingStepThree
            onBack={() => setStep(2)}
            onFinish={finishOnboarding}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
