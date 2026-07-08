import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/user';
import { specialtyOptions } from '@/data/hubTemplates';
import { PhoneInput } from '@/components/ui/phone-input';

interface ProfileFormState {
  title: string;
  firstName: string;
  lastName: string;
  specialty: string;
  primaryLocation: string;
  role: UserRole;
  phoneCountryCode: string;
  phoneNumber: string;
  useInfoForSignature: boolean;
  displayLanguage: string;
}

export const ProfileSettings = () => {
  const { user, updateProfile, isSaving } = useSettings();
  const { toast } = useToast();

  const clinicName = user.clinicName || user.clinic || '';

  const getInitialState = (): ProfileFormState => ({
    title: user.title || 'Dr.',
    firstName: user.firstName,
    lastName: user.lastName,
    specialty: user.specialty || 'Fertility Specialist',
    primaryLocation: '',
    role: user.role as UserRole,
    phoneCountryCode: 'CA',
    phoneNumber: '',
    useInfoForSignature: false,
    displayLanguage: 'English',
  });

  const [formData, setFormData] = useState<ProfileFormState>(getInitialState);
  const [initialData, setInitialData] = useState<ProfileFormState>(getInitialState);
  const [imagePreview, setImagePreview] = useState<string | undefined>(user.profileImage);
  const [localSaving, setLocalSaving] = useState(false);

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload an image under 5MB',
          variant: 'destructive',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLocalSaving(true);
    try {
      await updateProfile(formData);
      setInitialData(formData);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLocalSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-1">Profile</h3>
        <p className="text-sm text-muted-foreground">Manage your personal information and preferences</p>
      </div>

      <div className="space-y-8">
        {/* About You Section */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <h4 className="text-sm font-semibold text-foreground mb-6">About you</h4>

          {/* Profile Image */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">Profile image</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <label htmlFor="image-upload" className="relative cursor-pointer group inline-block">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={imagePreview} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {getInitials(formData.firstName, formData.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm ring-2 ring-card group-hover:bg-primary/90 transition-colors">
                    <Camera className="h-3.5 w-3.5" />
                  </span>
                </label>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                Upload a profile image (JPG, PNG, GIF, or WebP, max 5 MB)
              </TooltipContent>
            </Tooltip>
            <input id="image-upload" type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleImageUpload} className="hidden" />

            {/* Read-only email under avatar */}
            <div className="mt-5 flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Email</span>
              <span className="text-base text-muted-foreground">{user.email}</span>
            </div>
          </div>

          {/* Row 1: Title, First name, Last name */}
          <div className="grid grid-cols-[120px_1fr_1fr] gap-4 mb-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium mb-2 block">Title</Label>
              <Select value={formData.title} onValueChange={value => setFormData({ ...formData, title: value })}>
                <SelectTrigger id="title">
                  <SelectValue />
                </SelectTrigger>
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
              <Label htmlFor="firstName" className="text-sm font-medium mb-2 block">First name</Label>
              <Input id="firstName" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium mb-2 block">Last name</Label>
              <Input id="lastName" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} required />
            </div>
          </div>

          {/* Row 2: Phone number, Specialty, Your role */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Phone number</Label>
              <PhoneInput
                countryCode={formData.phoneCountryCode}
                onCountryCodeChange={(code) => setFormData({ ...formData, phoneCountryCode: code })}
                value={formData.phoneNumber}
                onChange={(val) => setFormData({ ...formData, phoneNumber: val })}
              />
            </div>
            <div>
              <Label htmlFor="specialty" className="text-sm font-medium mb-2 block">Specialty</Label>
              <Select value={formData.specialty} onValueChange={value => setFormData({ ...formData, specialty: value })}>
                <SelectTrigger id="specialty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {specialtyOptions.filter(s => s !== 'All').map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="role" className="text-sm font-medium mb-2 block">Your role</Label>
              <Select value={formData.role} onValueChange={value => setFormData({ ...formData, role: value as UserRole })}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual clinician">Individual clinician</SelectItem>
                  <SelectItem value="Physician">Physician</SelectItem>
                  <SelectItem value="Nurse">Nurse</SelectItem>
                  <SelectItem value="Specialist">Specialist</SelectItem>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: Clinic name (read-only), Primary location, Display language */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="clinicName" className="text-sm font-medium mb-2 block">Clinic name</Label>
              <Input id="clinicName" value={clinicName} disabled readOnly />
            </div>
            <div>
              <Label htmlFor="primaryLocation" className="text-sm font-medium mb-2 block">Primary location</Label>
              <Select value={formData.primaryLocation} onValueChange={(value) => setFormData({ ...formData, primaryLocation: value })}>
                <SelectTrigger id="primaryLocation">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Victoria">Victoria</SelectItem>
                  <SelectItem value="Vancouver">Vancouver</SelectItem>
                  <SelectItem value="Kelowna">Kelowna</SelectItem>
                  <SelectItem value="Surrey">Surrey</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="displayLanguage" className="text-sm font-medium mb-2 block">Display language</Label>
              <Select value={formData.displayLanguage} onValueChange={(value) => setFormData({ ...formData, displayLanguage: value })}>
                <SelectTrigger id="displayLanguage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Save / Cancel Buttons */}
        <div className="flex items-center gap-3 pt-6">
          <Button onClick={handleSave} disabled={!hasChanges || localSaving || isSaving}>
            {localSaving || isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button variant="outline" onClick={handleCancel} disabled={!hasChanges || localSaving || isSaving}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
