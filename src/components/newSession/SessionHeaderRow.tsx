import { useState, useEffect } from 'react';
import { ChevronDown, Plus, Pencil, Search, X, Loader2, CalendarIcon } from 'lucide-react';
import { Patient, ReferringPhysician } from '@/types/session';
import { PatientSelector } from './PatientSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { usePhysicianSearch } from '@/hooks/usePhysicianSearch';

interface SessionHeaderRowProps {
  selectedPatient: Patient | null;
  patients: Patient[];
  onSelectPatient: (patient: Patient | null) => void;
  onCreatePatient: (patient: Patient) => void;
  onUpdatePatient: (patient: Patient) => void;
  onDeletePatient: (patientId: string) => void;
  isPatientHighlighted?: boolean;
  // Partner state
  selectedPartner: string | null;
  onPartnerChange: (partner: string | null) => void;
  // Referring physician state
  selectedPhysician: string | null;
  onPhysicianChange: (physician: string | null) => void;
}

interface PartnerDetails {
  firstName: string;
  lastName: string;
  emrId: string;
  dateOfBirth: Date | undefined;
}

export const SessionHeaderRow = ({
  selectedPatient,
  patients,
  onSelectPatient,
  onCreatePatient,
  onUpdatePatient,
  onDeletePatient,
  isPatientHighlighted = false,
  selectedPartner,
  onPartnerChange,
  selectedPhysician,
  onPhysicianChange,
}: SessionHeaderRowProps) => {
  // Partner modal state
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [isEditingPartner, setIsEditingPartner] = useState(false);
  const [partnerForm, setPartnerForm] = useState<PartnerDetails>({
    firstName: '',
    lastName: '',
    emrId: '',
    dateOfBirth: undefined,
  });

  // Physician search state
  const [physicianSearchQuery, setPhysicianSearchQuery] = useState('');
  const [showPhysicianDropdown, setShowPhysicianDropdown] = useState(false);
  const { results: physicianResults, isLoading: physicianLoading, error: physicianError, search: searchPhysicians, clearResults } = usePhysicianSearch();

  // Check if patient has partner info
  const hasPartner = selectedPatient?.partnerFirstName && selectedPatient?.partnerLastName;
  const partnerDisplay = hasPartner 
    ? `${selectedPatient.partnerFirstName} ${selectedPatient.partnerLastName}` 
    : '—';
  
  // Display values
  const physicianDisplay = selectedPhysician ? `Dr. ${selectedPhysician}` : '—';

  // Auto-fill partner and physician when patient is selected
  useEffect(() => {
    if (selectedPatient) {
      // Auto-fill partner
      if (selectedPatient.partnerFirstName && selectedPatient.partnerLastName) {
        onPartnerChange(`${selectedPatient.partnerFirstName} ${selectedPatient.partnerLastName}`);
      } else {
        onPartnerChange(null);
      }
      
      // Auto-fill physician
      if (selectedPatient.referringPhysicianName) {
        onPhysicianChange(selectedPatient.referringPhysicianName);
      } else {
        onPhysicianChange(null);
      }
    }
  }, [selectedPatient, onPartnerChange, onPhysicianChange]);

  // Handle physician search
  useEffect(() => {
    if (physicianSearchQuery.length >= 2 && showPhysicianDropdown) {
      searchPhysicians(physicianSearchQuery);
    }
  }, [physicianSearchQuery, showPhysicianDropdown, searchPhysicians]);

  const openPartnerModal = (editing: boolean) => {
    setIsEditingPartner(editing);
    if (editing && selectedPatient) {
      setPartnerForm({
        firstName: selectedPatient.partnerFirstName || '',
        lastName: selectedPatient.partnerLastName || '',
        emrId: selectedPatient.partnerEmrId || '',
        dateOfBirth: selectedPatient.partnerDateOfBirth ? new Date(selectedPatient.partnerDateOfBirth) : undefined,
      });
    } else {
      setPartnerForm({
        firstName: '',
        lastName: '',
        emrId: '',
        dateOfBirth: undefined,
      });
    }
    setPartnerModalOpen(true);
  };

  const handleSavePartner = () => {
    if (selectedPatient && partnerForm.firstName.trim() && partnerForm.lastName.trim()) {
      const updatedPatient: Patient = {
        ...selectedPatient,
        partnerFirstName: partnerForm.firstName.trim(),
        partnerLastName: partnerForm.lastName.trim(),
        partnerEmrId: partnerForm.emrId.trim() || undefined,
        partnerDateOfBirth: partnerForm.dateOfBirth,
      };
      onUpdatePatient(updatedPatient);
      onPartnerChange(`${partnerForm.firstName.trim()} ${partnerForm.lastName.trim()}`);
      setPartnerModalOpen(false);
    }
  };

  const handleSelectPhysician = (physician: ReferringPhysician) => {
    const physicianName = `${physician.first_name} ${physician.last_name}`;
    onPhysicianChange(physicianName);
    setPhysicianSearchQuery('');
    setShowPhysicianDropdown(false);
    clearResults();
    
    // Update patient with new physician
    if (selectedPatient) {
      const updatedPatient: Patient = {
        ...selectedPatient,
        referringPhysicianId: physician.id,
        referringPhysicianName: physicianName,
        referringPhysicianClinic: physician.clinic_name || undefined,
      };
      onUpdatePatient(updatedPatient);
    }
  };

  const isPartnerFormValid = partnerForm.firstName.trim() && partnerForm.lastName.trim();

  const DatePickerField = ({
    value,
    onChange,
    placeholder = "Select date"
  }: {
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
    placeholder?: string;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-background border-border",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "MMM d, yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-popover" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={(date) => date > new Date()}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );

  return (
    <>
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <PatientSelector
          selectedPatient={selectedPatient}
          patients={patients}
          onSelectPatient={onSelectPatient}
          onCreatePatient={onCreatePatient}
          onUpdatePatient={onUpdatePatient}
          onDeletePatient={onDeletePatient}
          isHighlighted={isPatientHighlighted}
        />

        {/* Partner dropdown pill */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] bg-background hover:bg-muted/50 transition-colors cursor-pointer border border-border">
              <span className="text-muted-foreground">Partner:</span>
              <span className="text-foreground">{partnerDisplay}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-popover z-50 min-w-[180px]">
            {hasPartner ? (
              <>
                <DropdownMenuItem 
                  onClick={() => openPartnerModal(true)}
                  className="text-foreground"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Partner Details
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem 
                  onClick={() => openPartnerModal(false)}
                  className="text-foreground"
                  disabled={!selectedPatient}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Partner Details
                </DropdownMenuItem>
                {!selectedPatient && (
                  <p className="px-2 py-1 text-xs text-muted-foreground">Select a patient first</p>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Referring Physician dropdown pill with search */}
        <DropdownMenu open={showPhysicianDropdown} onOpenChange={setShowPhysicianDropdown}>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] bg-background hover:bg-muted/50 transition-colors cursor-pointer border border-border">
              <span className="text-muted-foreground">Referring physician:</span>
              <span className="text-foreground">{physicianDisplay}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-popover z-50 w-72">
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search physicians..."
                  value={physicianSearchQuery}
                  onChange={(e) => setPhysicianSearchQuery(e.target.value)}
                  className="pl-8 bg-background border-border"
                />
                {physicianLoading && (
                  <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin" />
                )}
              </div>
            </div>
            
            {selectedPhysician && (
              <>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  onClick={() => {
                    onPhysicianChange(null);
                    if (selectedPatient) {
                      onUpdatePatient({
                        ...selectedPatient,
                        referringPhysicianId: undefined,
                        referringPhysicianName: undefined,
                        referringPhysicianClinic: undefined,
                      });
                    }
                  }}
                  className="text-muted-foreground"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear physician
                </DropdownMenuItem>
              </>
            )}
            
            {physicianSearchQuery.length >= 2 && (
              <>
                <DropdownMenuSeparator className="bg-border" />
                {physicianLoading ? (
                  <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                    Searching...
                  </div>
                ) : physicianError ? (
                  <div className="px-3 py-4 text-center text-sm text-destructive">
                    {physicianError}
                  </div>
                ) : physicianResults.length === 0 ? (
                  <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                    No results found
                  </div>
                ) : (
                  physicianResults.map((physician) => (
                    <DropdownMenuItem
                      key={physician.id}
                      onClick={() => handleSelectPhysician(physician)}
                      className="flex flex-col items-start"
                    >
                      <span className="text-sm font-medium text-foreground">
                        Dr. {physician.first_name} {physician.last_name}
                      </span>
                      {(physician.clinic_name || physician.city) && (
                        <span className="text-xs text-muted-foreground">
                          {[physician.clinic_name, physician.city, physician.province].filter(Boolean).join(' • ')}
                        </span>
                      )}
                    </DropdownMenuItem>
                  ))
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Partner Modal */}
      <Dialog open={partnerModalOpen} onOpenChange={setPartnerModalOpen}>
        <DialogContent className="sm:max-w-md bg-background">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {isEditingPartner ? 'Edit Partner Details' : 'Add Partner Details'}
            </DialogTitle>
            <DialogDescription>
              {isEditingPartner ? 'Update partner information' : 'Add partner information for this patient'}
            </DialogDescription>
          </DialogHeader>
          
          <DialogBody className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-foreground">First name *</Label>
                <Input 
                  value={partnerForm.firstName} 
                  onChange={(e) => setPartnerForm(prev => ({ ...prev, firstName: e.target.value }))}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Last name *</Label>
                <Input 
                  value={partnerForm.lastName} 
                  onChange={(e) => setPartnerForm(prev => ({ ...prev, lastName: e.target.value }))}
                  className="bg-background border-border"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-foreground">EMR ID</Label>
                <Input 
                  value={partnerForm.emrId} 
                  onChange={(e) => setPartnerForm(prev => ({ ...prev, emrId: e.target.value }))}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Date of birth</Label>
                <DatePickerField 
                  value={partnerForm.dateOfBirth} 
                  onChange={(date) => setPartnerForm(prev => ({ ...prev, dateOfBirth: date }))} 
                />
              </div>
            </div>
          </DialogBody>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPartnerModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSavePartner} 
              disabled={!isPartnerFormValid}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isEditingPartner ? 'Save changes' : 'Add partner'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
