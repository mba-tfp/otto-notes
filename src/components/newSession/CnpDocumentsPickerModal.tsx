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
import { DemoCnpDocument } from '@/data/demoCnpDocuments';
import { cn } from '@/lib/utils';

interface CnpDocumentsPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName: string;
  partnerName?: string;
  documents: DemoCnpDocument[];
  importedFilenames: Set<string>;
  onImport: (docs: DemoCnpDocument[]) => void;
  onSkip: () => void;
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

  useEffect(() => {
    if (open) setSelected(new Set());
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

  const sectionAvailableIds = (docs: DemoCnpDocument[]) =>
    docs.filter(d => !isImported(d)).map(d => d.id);

  const isSectionAllSelected = (docs: DemoCnpDocument[]) => {
    const ids = sectionAvailableIds(docs);
    return ids.length > 0 && ids.every(id => selected.has(id));
  };

  const toggleSectionAll = (docs: DemoCnpDocument[]) => {
    const ids = sectionAvailableIds(docs);
    setSelected(prev => {
      const next = new Set(prev);
      const allSelected = ids.every(id => next.has(id));
      if (allSelected) ids.forEach(id => next.delete(id));
      else ids.forEach(id => next.add(id));
      return next;
    });
  };

  const handleImport = () => {
    const picked = documents.filter(d => selected.has(d.id));
    if (picked.length === 0) return;
    onImport(picked);
  };

  const renderSection = (label: string, docs: DemoCnpDocument[]) => {
    if (docs.length === 0) return null;
    const allSelected = isSectionAllSelected(docs);
    const hasAvailable = sectionAvailableIds(docs).length > 0;
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-end gap-3 pb-1">
          <label className={cn("flex items-center gap-2 text-xs text-muted-foreground", !hasAvailable && "opacity-50")}>
            <Checkbox
              checked={allSelected}
              onCheckedChange={() => toggleSectionAll(docs)}
              disabled={!hasAvailable}
            />
            Select all
          </label>
          <span className="text-sm font-bold text-secondary">{label}</span>
        </div>
        <div className="space-y-1">
          {docs.map(d => {
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
          <p className="text-sm text-muted-foreground">From Otto Onboarding</p>
        </DialogHeader>
        <DialogBody className="space-y-5">
          {renderSection(patientName, patientDocs)}
          {renderSection(partnerName || 'Partner', partnerDocs)}
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
