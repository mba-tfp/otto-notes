import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PhoneInput } from '@/components/ui/phone-input';
import { specialtyOptions } from '@/data/hubTemplates';
import type { OnboardingFormState } from './NewUserOnboardingModal';

interface Props {
  form: OnboardingFormState;
  setForm: (form: OnboardingFormState) => void;
  imagePreview: string | undefined;
  setImagePreview: (url: string | undefined) => void;
  saving: boolean;
  onContinue: () => void;
}

export const OnboardingStepOne = ({ form, setForm, imagePreview, setImagePreview, saving, onContinue }: Props) => {
  const { toast } = useToast();
  const isValid = form.firstName.trim() && form.lastName.trim() && form.specialty;

  const getInitials = () => {
    const f = form.firstName?.[0] || '';
    const l = form.lastName?.[0] || '';
    return (f + l).toUpperCase() || '?';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Please upload an image under 5MB.', variant: 'destructive' });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <header className="border-b border-border px-6 pb-4 pt-6">
        <DialogTitle className="text-2xl font-semibold text-foreground text-center">
          Tell us about yourself
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground text-center mt-1">
          Let's get your account set up.
        </DialogDescription>
      </header>

      <div className="px-6 pb-6 pt-6">

      {/* Profile Image */}
      <div className="flex items-center gap-4 mb-5">
        <Avatar className="h-16 w-16">
          <AvatarImage src={imagePreview} />
          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm text-muted-foreground mb-1.5">JPG, PNG up to 5MB</p>
          <label htmlFor="onboarding-image-upload">
            <Button type="button" variant="outline" size="sm" className="cursor-pointer" asChild>
              <span>
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                Upload
              </span>
            </Button>
          </label>
          <input id="onboarding-image-upload" type="file" accept="image/jpeg,image/png" onChange={handleImageUpload} className="hidden" />
        </div>
      </div>

      {/* Title + First/Last Name */}
      <div className="grid grid-cols-[112px_1fr_1fr] gap-3 mb-5">
        <div>
          <Label className="text-sm font-medium mb-1.5 block">Title</Label>
          <Select value={form.title} onValueChange={(v) => setForm({ ...form, title: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Dr.">Dr.</SelectItem>
              <SelectItem value="Mr.">Mr.</SelectItem>
              <SelectItem value="Mrs.">Mrs.</SelectItem>
              <SelectItem value="Ms.">Ms.</SelectItem>
              <SelectItem value="Mx.">Mx.</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm font-medium mb-1.5 block">
            First Name <span className="text-destructive">*</span>
          </Label>
          <Input
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
        </div>
        <div>
          <Label className="text-sm font-medium mb-1.5 block">
            Last Name <span className="text-destructive">*</span>
          </Label>
          <Input
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>
      </div>

      {/* Specialty */}
      <div className="mb-5">
        <Label className="text-sm font-medium mb-1.5 block">
          Specialty <span className="text-destructive">*</span>
        </Label>
        <Select value={form.specialty} onValueChange={(v) => setForm({ ...form, specialty: v })}>
          <SelectTrigger><SelectValue placeholder="Select speciality" /></SelectTrigger>
          <SelectContent>
            {specialtyOptions.filter(s => s !== 'All').map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Primary Location */}
      <div className="mb-5">
        <Label className="text-sm font-medium mb-1.5 block">Primary location <span className="font-normal text-muted-foreground">(optional)</span></Label>
        <Select value={form.primaryLocation} onValueChange={(v) => setForm({ ...form, primaryLocation: v })}>
          <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Victoria">Victoria</SelectItem>
            <SelectItem value="Vancouver">Vancouver</SelectItem>
            <SelectItem value="Kelowna">Kelowna</SelectItem>
            <SelectItem value="Surrey">Surrey</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Phone Number */}
      <div className="mb-5">
        <Label className="text-sm font-medium mb-1.5 block">Phone Number <span className="font-normal text-muted-foreground">(optional)</span></Label>
        <PhoneInput
          countryCode={form.phoneCountryCode}
          onCountryCodeChange={(code) => setForm({ ...form, phoneCountryCode: code })}
          value={form.phoneNumber}
          onChange={(val) => setForm({ ...form, phoneNumber: val })}
        />
      </div>

      {/* Display Language */}
      <div className="mb-5">
        <Label className="text-sm font-medium mb-1.5 block">Display language</Label>
        <Select value={form.displayLanguage} onValueChange={(v) => setForm({ ...form, displayLanguage: v })}>
          <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="French">French</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Continue Button */}
      <Button
        onClick={onContinue}
        disabled={!isValid || saving}
        className="w-full"
        size="lg"
      >
        {saving ? 'Setting up...' : 'Continue'}
      </Button>
      </div>
    </div>
  );
};
