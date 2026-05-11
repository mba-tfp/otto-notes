import { useState, useEffect } from 'react';
import { ChevronDown, Plus, User, Search, X, Loader2, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Patient, ReferringPhysician } from '@/types/session';
import { usePhysicianSearch } from '@/hooks/usePhysicianSearch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PatientSelectorProps {
  selectedPatient: Patient | null;
  patients: Patient[];
  onSelectPatient: (patient: Patient | null) => void;
  onCreatePatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdatePatient: (patient: Patient) => void;
  onDeletePatient: (patientId: string) => void;
  isHighlighted?: boolean;
}

export const PatientSelector = ({
  selectedPatient,
  patients,
  onSelectPatient,
  onCreatePatient,
  onUpdatePatient,
  onDeletePatient,
  isHighlighted = false,
}: PatientSelectorProps) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [emrId, setEmrId] = useState('');
  const [cnpId, setCnpId] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [partnerFirstName, setPartnerFirstName] = useState('');
  const [partnerLastName, setPartnerLastName] = useState('');
  const [partnerEmrId, setPartnerEmrId] = useState('');
  const [partnerDateOfBirth, setPartnerDateOfBirth] = useState<Date | undefined>(undefined);
  const [selectedPhysician, setSelectedPhysician] = useState<ReferringPhysician | null>(null);
  const [physicianSearchQuery, setPhysicianSearchQuery] = useState('');
  
  // Edit form state
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editEmrId, setEditEmrId] = useState('');
  const [editCnpId, setEditCnpId] = useState('');
  const [editDateOfBirth, setEditDateOfBirth] = useState<Date | undefined>(undefined);
  const [editPartnerFirstName, setEditPartnerFirstName] = useState('');
  const [editPartnerLastName, setEditPartnerLastName] = useState('');
  const [editPartnerEmrId, setEditPartnerEmrId] = useState('');
  const [editPartnerDateOfBirth, setEditPartnerDateOfBirth] = useState<Date | undefined>(undefined);
  const [editSelectedPhysician, setEditSelectedPhysician] = useState<ReferringPhysician | null>(null);
  const [editPhysicianSearchQuery, setEditPhysicianSearchQuery] = useState('');
  const [editIdentifier, setEditIdentifier] = useState('');
  const [editAdditionalContext, setEditAdditionalContext] = useState('');
  
  // Physician search
  const { results: physicianResults, isLoading: physicianLoading, error: physicianError, search: searchPhysicians, clearResults } = usePhysicianSearch();
  const [showPhysicianDropdown, setShowPhysicianDropdown] = useState(false);
  const [showEditPhysicianDropdown, setShowEditPhysicianDropdown] = useState(false);

  // Dynamic search - only show results when user types
  const filteredPatients = searchQuery.trim().length > 0 
    ? patients.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  // Validation
  const isCreateValid = firstName.trim() && lastName.trim() && 
    ((partnerFirstName.trim() && partnerLastName.trim()) || (!partnerFirstName.trim() && !partnerLastName.trim()));
  
  const isEditValid = editFirstName.trim() && editLastName.trim() && 
    ((editPartnerFirstName.trim() && editPartnerLastName.trim()) || (!editPartnerFirstName.trim() && !editPartnerLastName.trim()));

  const partnerValidationError = (partnerFirstName.trim() && !partnerLastName.trim()) || (!partnerFirstName.trim() && partnerLastName.trim());
  const editPartnerValidationError = (editPartnerFirstName.trim() && !editPartnerLastName.trim()) || (!editPartnerFirstName.trim() && editPartnerLastName.trim());

  // Handle physician search
  useEffect(() => {
    if (physicianSearchQuery.length >= 2 && showPhysicianDropdown) {
      searchPhysicians(physicianSearchQuery);
    } else if (physicianSearchQuery.length >= 2 && showEditPhysicianDropdown) {
      searchPhysicians(physicianSearchQuery);
    }
  }, [physicianSearchQuery, showPhysicianDropdown, searchPhysicians]);

  useEffect(() => {
    if (editPhysicianSearchQuery.length >= 2 && showEditPhysicianDropdown) {
      searchPhysicians(editPhysicianSearchQuery);
    }
  }, [editPhysicianSearchQuery, showEditPhysicianDropdown, searchPhysicians]);

  const handleCreatePatient = () => {
    if (isCreateValid) {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      onCreatePatient({
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim() || undefined,
        emrId: emrId.trim() || undefined,
        cnpId: cnpId.trim() || undefined,
        dateOfBirth: dateOfBirth,
        partnerFirstName: partnerFirstName.trim() || undefined,
        partnerLastName: partnerLastName.trim() || undefined,
        partnerEmrId: partnerEmrId.trim() || undefined,
        partnerDateOfBirth: partnerDateOfBirth,
        referringPhysicianId: selectedPhysician?.id,
        referringPhysicianName: selectedPhysician ? `${selectedPhysician.first_name} ${selectedPhysician.last_name}` : undefined,
        referringPhysicianClinic: selectedPhysician?.clinic_name || undefined,
      });
      resetCreateForm();
      setCreateModalOpen(false);
    }
  };

  const resetCreateForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setEmrId('');
    setCnpId('');
    setDateOfBirth(undefined);
    setPartnerFirstName('');
    setPartnerLastName('');
    setPartnerEmrId('');
    setPartnerDateOfBirth(undefined);
    setSelectedPhysician(null);
    setPhysicianSearchQuery('');
    clearResults();
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setEditFirstName(patient.firstName || patient.name.split(' ')[0] || '');
    setEditLastName(patient.lastName || patient.name.split(' ').slice(1).join(' ') || '');
    setEditEmail(patient.email || '');
    setEditEmrId(patient.emrId || '');
    setEditCnpId(patient.cnpId || '');
    setEditDateOfBirth(patient.dateOfBirth ? new Date(patient.dateOfBirth) : undefined);
    setEditPartnerFirstName(patient.partnerFirstName || '');
    setEditPartnerLastName(patient.partnerLastName || '');
    setEditPartnerEmrId(patient.partnerEmrId || '');
    setEditPartnerDateOfBirth(patient.partnerDateOfBirth ? new Date(patient.partnerDateOfBirth) : undefined);
    setEditIdentifier(patient.identifier || '');
    setEditAdditionalContext(patient.additionalContext || '');
    if (patient.referringPhysicianId && patient.referringPhysicianName) {
      const nameParts = patient.referringPhysicianName.split(' ');
      setEditSelectedPhysician({
        id: patient.referringPhysicianId,
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
        clinic_name: patient.referringPhysicianClinic,
      });
    } else {
      setEditSelectedPhysician(null);
    }
    setEditPhysicianSearchQuery('');
    setEditModalOpen(true);
  };

  const handleSavePatient = () => {
    if (editingPatient && isEditValid) {
      const fullName = `${editFirstName.trim()} ${editLastName.trim()}`;
      onUpdatePatient({
        ...editingPatient,
        name: fullName,
        firstName: editFirstName.trim(),
        lastName: editLastName.trim(),
        email: editEmail.trim() || undefined,
        emrId: editEmrId.trim() || undefined,
        cnpId: editCnpId.trim() || undefined,
        dateOfBirth: editDateOfBirth,
        partnerFirstName: editPartnerFirstName.trim() || undefined,
        partnerLastName: editPartnerLastName.trim() || undefined,
        partnerEmrId: editPartnerEmrId.trim() || undefined,
        partnerDateOfBirth: editPartnerDateOfBirth,
        referringPhysicianId: editSelectedPhysician?.id,
        referringPhysicianName: editSelectedPhysician ? `${editSelectedPhysician.first_name} ${editSelectedPhysician.last_name}` : undefined,
        referringPhysicianClinic: editSelectedPhysician?.clinic_name || undefined,
        identifier: editIdentifier.trim() || undefined,
        additionalContext: editAdditionalContext.trim() || undefined,
      });
      setEditModalOpen(false);
      setEditingPatient(null);
    }
  };

  const handleDeletePatient = () => {
    if (editingPatient) {
      onDeletePatient(editingPatient.id);
      setEditModalOpen(false);
      setEditingPatient(null);
      if (selectedPatient?.id === editingPatient.id) {
        onSelectPatient(null);
      }
    }
  };

  const handleSelectPhysician = (physician: ReferringPhysician) => {
    setSelectedPhysician(physician);
    setPhysicianSearchQuery('');
    setShowPhysicianDropdown(false);
    clearResults();
  };

  const handleSelectEditPhysician = (physician: ReferringPhysician) => {
    setEditSelectedPhysician(physician);
    setEditPhysicianSearchQuery('');
    setShowEditPhysicianDropdown(false);
    clearResults();
  };

  const PhysicianSearchField = ({ 
    value, 
    onChange, 
    selected, 
    onClear, 
    results, 
    isLoading, 
    error, 
    onSelect, 
    showDropdown, 
    setShowDropdown 
  }: {
    value: string;
    onChange: (v: string) => void;
    selected: ReferringPhysician | null;
    onClear: () => void;
    results: ReferringPhysician[];
    isLoading: boolean;
    error: string | null;
    onSelect: (p: ReferringPhysician) => void;
    showDropdown: boolean;
    setShowDropdown: (v: boolean) => void;
  }) => (
    <div className="relative">
      {selected ? (
        <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md border border-border">
          <span className="flex-1 text-sm text-foreground">
            Dr. {selected.first_name} {selected.last_name}
            {selected.clinic_name && <span className="text-muted-foreground"> — {selected.clinic_name}</span>}
          </span>
          <button 
            type="button"
            onClick={onClear} 
            className="p-0.5 hover:bg-background rounded"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search physicians..."
            className="pl-9 bg-background border-border"
          />
          {isLoading && (
            <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin" />
          )}
        </div>
      )}
      
      {showDropdown && !selected && value.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-auto">
          {isLoading ? (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
              Searching...
            </div>
          ) : error ? (
            <div className="px-3 py-4 text-center text-sm text-destructive">
              {error}
            </div>
          ) : results.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
              No results found
            </div>
          ) : (
            results.map((physician) => (
              <button
                key={physician.id}
                type="button"
                onClick={() => onSelect(physician)}
                className="w-full px-3 py-2 text-left hover:bg-muted transition-colors"
              >
                <div className="text-sm font-medium text-foreground">
                  Dr. {physician.first_name} {physician.last_name}
                </div>
                {(physician.clinic_name || physician.city) && (
                  <div className="text-xs text-muted-foreground">
                    {[physician.clinic_name, physician.city, physician.province].filter(Boolean).join(' • ')}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={`inline-flex items-center gap-2 px-4 py-2 bg-background border rounded-xl text-sm transition-colors ${
            isHighlighted 
              ? 'border-destructive ring-2 ring-destructive/20 animate-pulse' 
              : 'border-border hover:border-primary/30'
          }`}>
            {selectedPatient ? (
              <>
                <User className="h-4 w-4 text-foreground stroke-[1.5]" />
                <span className="font-medium text-foreground">{selectedPatient.name}</span>
              </>
            ) : (
              <span className={isHighlighted ? "text-destructive font-medium" : "text-foreground/80"}>+ Add patient details</span>
            )}
            <ChevronDown className={`h-4 w-4 stroke-[1.5] ${isHighlighted ? 'text-destructive' : 'text-foreground'}`} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72 bg-popover border border-border">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground stroke-[1.5]" />
              <Input
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 bg-background border-border"
              />
            </div>
          </div>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem 
            onClick={() => setCreateModalOpen(true)}
            className="text-foreground hover:bg-muted"
          >
            <Plus className="mr-2 h-4 w-4 stroke-[1.5]" />
            Create new patient
          </DropdownMenuItem>
          
          {/* Dynamic search results - only show when user types */}
          {filteredPatients.length > 0 && (
            <>
              <DropdownMenuSeparator className="bg-border" />
              {filteredPatients.map(patient => (
                <DropdownMenuItem
                  key={patient.id}
                  className="flex items-center gap-3 py-3 px-3 text-foreground hover:bg-muted cursor-pointer"
                  onClick={() => {
                    onSelectPatient(patient);
                    setSearchQuery('');
                  }}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#2D3A5C] flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {patient.firstName?.charAt(0) || patient.name.charAt(0)}
                    </span>
                  </div>
                  
                  {/* Name and Email */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">{patient.name}</div>
                    {patient.email && (
                      <div className="text-sm text-muted-foreground truncate">{patient.email}</div>
                    )}
                  </div>
                  
                  {/* EMR ID and CNP ID */}
                  <div className="flex-shrink-0 w-[110px] text-right text-[11px] leading-tight text-muted-foreground">
                    {patient.emrId && <div className="truncate">EMR: {patient.emrId}</div>}
                    {patient.cnpId && <div className="truncate">CNP: {patient.cnpId}</div>}
                  </div>
                  
                  {/* Edit Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0 h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-background"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditPatient(patient);
                    }}
                  >
                    Edit
                  </Button>
                </DropdownMenuItem>
              ))}
            </>
          )}
          
          {/* No results message */}
          {searchQuery.trim().length > 0 && filteredPatients.length === 0 && (
            <>
              <DropdownMenuSeparator className="bg-border" />
              <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                No patients found
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Patient Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg bg-background">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create new patient</DialogTitle>
            <DialogDescription>
              Add patient and optional partner details
            </DialogDescription>
          </DialogHeader>
          
          <DialogBody className="space-y-6">
            {/* Primary Patient */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-foreground">Primary patient</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-foreground">First name *</Label>
                  <Input 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Last name *</Label>
                  <Input 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Email</Label>
                <Input 
                  type="email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@email.com"
                  className="bg-background border-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-foreground">EMR ID</Label>
                  <Input 
                    value={emrId} 
                    onChange={(e) => setEmrId(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">CNP ID</Label>
                  <Input 
                    value={cnpId} 
                    onChange={(e) => setCnpId(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Date of birth</Label>
                <DatePickerField value={dateOfBirth} onChange={setDateOfBirth} />
              </div>
            </div>

            {/* Partner */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-foreground">Partner (optional)</h4>
              {partnerValidationError && (
                <p className="text-xs text-destructive">Both first and last name are required for partner</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-foreground">First name</Label>
                  <Input 
                    value={partnerFirstName} 
                    onChange={(e) => setPartnerFirstName(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Last name</Label>
                  <Input 
                    value={partnerLastName} 
                    onChange={(e) => setPartnerLastName(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-foreground">EMR ID</Label>
                  <Input 
                    value={partnerEmrId} 
                    onChange={(e) => setPartnerEmrId(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Date of birth</Label>
                  <DatePickerField value={partnerDateOfBirth} onChange={setPartnerDateOfBirth} />
                </div>
              </div>
            </div>

            {/* Referring Physician */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-foreground">Referring physician (optional)</h4>
              <PhysicianSearchField
                value={physicianSearchQuery}
                onChange={setPhysicianSearchQuery}
                selected={selectedPhysician}
                onClear={() => setSelectedPhysician(null)}
                results={physicianResults}
                isLoading={physicianLoading}
                error={physicianError}
                onSelect={handleSelectPhysician}
                showDropdown={showPhysicianDropdown}
                setShowDropdown={setShowPhysicianDropdown}
              />
            </div>
          </DialogBody>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePatient} 
              disabled={!isCreateValid}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Create patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Patient Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-lg bg-background">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit patient</DialogTitle>
            <DialogDescription>
              Update patient and partner details
            </DialogDescription>
          </DialogHeader>
          
          <DialogBody className="space-y-6">
            {/* Primary Patient */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-foreground">Primary patient</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-foreground">First name *</Label>
                  <Input 
                    value={editFirstName} 
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Last name *</Label>
                  <Input 
                    value={editLastName} 
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Email</Label>
                <Input 
                  type="email"
                  value={editEmail} 
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="patient@email.com"
                  className="bg-background border-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-foreground">EMR ID</Label>
                  <Input 
                    value={editEmrId} 
                    onChange={(e) => setEditEmrId(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">CNP ID</Label>
                  <Input 
                    value={editCnpId} 
                    onChange={(e) => setEditCnpId(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Date of birth</Label>
                <DatePickerField value={editDateOfBirth} onChange={setEditDateOfBirth} />
              </div>
            </div>

            {/* Partner */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-foreground">Partner (optional)</h4>
              {editPartnerValidationError && (
                <p className="text-xs text-destructive">Both first and last name are required for partner</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-foreground">First name</Label>
                  <Input 
                    value={editPartnerFirstName} 
                    onChange={(e) => setEditPartnerFirstName(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Last name</Label>
                  <Input 
                    value={editPartnerLastName} 
                    onChange={(e) => setEditPartnerLastName(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-foreground">EMR ID</Label>
                  <Input 
                    value={editPartnerEmrId} 
                    onChange={(e) => setEditPartnerEmrId(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Date of birth</Label>
                  <DatePickerField value={editPartnerDateOfBirth} onChange={setEditPartnerDateOfBirth} />
                </div>
              </div>
            </div>

            {/* Referring Physician */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-foreground">Referring physician (optional)</h4>
              <PhysicianSearchField
                value={editPhysicianSearchQuery}
                onChange={setEditPhysicianSearchQuery}
                selected={editSelectedPhysician}
                onClear={() => setEditSelectedPhysician(null)}
                results={physicianResults}
                isLoading={physicianLoading}
                error={physicianError}
                onSelect={handleSelectEditPhysician}
                showDropdown={showEditPhysicianDropdown}
                setShowDropdown={setShowEditPhysicianDropdown}
              />
            </div>

            {/* Identifier & Context */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-foreground">Additional info</h4>
              <div className="space-y-2">
                <Label className="text-foreground">Identifier</Label>
                <Input 
                  value={editIdentifier} 
                  onChange={(e) => setEditIdentifier(e.target.value)}
                  placeholder="e.g., MRN, chart number"
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Additional context</Label>
                <Textarea 
                  value={editAdditionalContext} 
                  onChange={(e) => setEditAdditionalContext(e.target.value)}
                  placeholder="Notes about this patient..."
                  className="bg-background border-border"
                />
              </div>
            </div>
          </DialogBody>

          <DialogFooter className="flex justify-between">
            <Button variant="destructive" onClick={handleDeletePatient}>
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSavePatient} 
                disabled={!isEditValid}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Save changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
