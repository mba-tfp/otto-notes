import { Search, Globe, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface TemplatesFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateTemplate: () => void;
}

export const TemplatesFilters = ({ searchQuery, onSearchChange, onCreateTemplate }: TemplatesFiltersProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
      <div className="relative w-full sm:flex-1 sm:max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
        <Input
          type="text"
          placeholder="Search for a template..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-11 pr-4 py-2.5 h-11 rounded-xl"
        />
      </div>

      <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
        <Button
          variant="outline"
          className="gap-2 flex-1 sm:flex-none justify-center whitespace-nowrap"
          onClick={() => navigate('/template-hub')}
        >
          <Globe className="h-4 w-4" />
          Template Hub
        </Button>
        <Button
          onClick={onCreateTemplate}
          className="gap-2 flex-1 sm:flex-none justify-center whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          Create template
        </Button>
      </div>
    </div>
  );
};
