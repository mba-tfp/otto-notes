import { useMemo, useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DemoCnpDocument, DEMO_CNP_CATEGORIES, DemoCnpCategory } from '@/data/demoCnpDocuments';
import { cn } from '@/lib/utils';

type CategoryFilter = DemoCnpCategory | 'All';

interface CnpDocumentsPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName: string;
  partnerName?: string;
  documents: DemoCnpDocument[];
  importedFilenames: Set<string>;
  onImport: (docs: DemoCnpDocument[]) => void;
}

export const CnpDocumentsPickerModal = ({
  open,
  onOpenChange,
  patientName,
  partnerName,
  documents,
  importedFilenames,
  onImport,
  onSkip,
}: CnpDocumentsPickerModalProps) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [patientCategory, setPatientCategory] = useState<CategoryFilter>('All');
  const [partnerCategory, setPartnerCategory] = useState<CategoryFilter>('All');

  useEffect(() => {
    if (open) {
      setSelected(new Set());
      setPatientCategory('All');
      setPartnerCategory('All');
    }
  }, [open]);

  const patientDocs = useMemo(() => documents.filter(d => d.owner === 'patient'), [documents]);
  const partnerDocs = useMemo(() => documents.filter(d => d.owner === 'partner'), [documents]);

  const isImported = (d: DemoCnpDocument) => importedFilenames.has(d.filename);

  const toggleDoc = (d: DemoCnpDocument) => {
    if (isImported(d)) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(d.id)) next.delete(d.id);
      else next.add(d.id);
      return next;
    });
  };

  const handleImport = () => {
    const picked = documents.filter(d => selected.has(d.id));
    if (picked.length === 0) return;
    onImport(picked);
  };

  const renderSection = (
    label: string,
    allDocs: DemoCnpDocument[],
    category: CategoryFilter,
    onCategoryChange: (v: CategoryFilter) => void,
  ) => {
    if (allDocs.length === 0) return null;
    const visibleDocs = category === 'All' ? allDocs : allDocs.filter(d => d.category === category);
    const availableIds = visibleDocs.filter(d => !isImported(d)).map(d => d.id);
    const allSelected = availableIds.length > 0 && availableIds.every(id => selected.has(id));
    const hasAvailable = availableIds.length > 0;

    const toggleAll = () => {
      setSelected(prev => {
        const next = new Set(prev);
        const all = availableIds.every(id => next.has(id));
        if (all) availableIds.forEach(id => next.delete(id));
        else availableIds.forEach(id => next.add(id));
        return next;
      });
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3 pb-1">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-sm font-bold text-foreground truncate">{label}</span>
            <Select value={category} onValueChange={(v) => onCategoryChange(v as CategoryFilter)}>
              <SelectTrigger className="h-8 w-[200px] text-xs rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All categories</SelectItem>
                {DEMO_CNP_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <label className={cn("flex items-center gap-2 text-xs text-muted-foreground shrink-0", !hasAvailable && "opacity-50")}>
            <Checkbox
              checked={allSelected}
              onCheckedChange={toggleAll}
              disabled={!hasAvailable}
            />
            Select all
          </label>
        </div>
        {visibleDocs.length === 0 ? (
          <div className="py-4 text-center text-xs text-muted-foreground">
            No documents in this category.
          </div>
        ) : (
          <div className="space-y-1">
            {visibleDocs.map(d => {
              const imported = isImported(d);
              const checked = selected.has(d.id);
              return (
                <div
                  key={d.id}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md border border-border bg-background",
                    imported ? "opacity-60" : "hover:bg-muted/40 cursor-pointer"
                  )}
                  onClick={() => toggleDoc(d)}
                >
                  <Checkbox
                    checked={checked}
                    disabled={imported}
                    onCheckedChange={() => toggleDoc(d)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground truncate flex-1">{d.filename}</span>
                  <Badge variant="secondary" className="rounded-full font-normal text-[11px]">{d.category}</Badge>
                  <span className="text-xs text-muted-foreground w-32 text-right shrink-0">
                    {imported ? 'Already in context' : d.date}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const title = partnerName
    ? `Documents for ${patientName} & ${partnerName}`
    : `Documents for ${patientName}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-background">
        <DialogHeader>
          <DialogTitle className="text-foreground">{title}</DialogTitle>
          <p className="text-sm text-muted-foreground">From Otto Onboard</p>
        </DialogHeader>
        <DialogBody className="space-y-5">
          {renderSection(patientName, patientDocs, patientCategory, setPatientCategory)}
          {renderSection(partnerName || 'Partner', partnerDocs, partnerCategory, setPartnerCategory)}
        </DialogBody>
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button variant="ghost" onClick={onSkip} className="text-muted-foreground">
            Skip
          </Button>
          <Button
            onClick={handleImport}
            disabled={selected.size === 0}
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Import selected ({selected.size})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
