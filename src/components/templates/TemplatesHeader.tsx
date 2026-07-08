import { FileText } from 'lucide-react';

export const TemplatesHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <FileText className="h-7 w-7 text-foreground" />
        <h1 className="font-sans text-[32px] font-semibold text-foreground tracking-tight">
          My Templates
        </h1>
      </div>
      <p className="text-sm text-muted-foreground ml-10">Library</p>
    </div>
  );
};