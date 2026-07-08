import { ArrowUpDown, MapPin, Stethoscope, FolderOpen, ChevronDown, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { sortOptions, locationOptions, specialtyOptions, categoryOptions } from '@/data/hubTemplates';
import { cn } from '@/lib/utils';

interface TemplateFiltersProps {
  sortBy: string;
  location: string;
  specialty: string;
  category: string;
  onSortChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSpecialtyChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClearAll?: () => void;
}

interface FilterPillProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  defaultValue: string;
  options: readonly string[];
  onChange: (value: string) => void;
  isActive?: boolean;
  dropdownClassName?: string;
  hideLabel?: boolean;
}

const FilterPill = ({ icon, label, value, defaultValue, options, onChange, isActive, dropdownClassName, hideLabel }: FilterPillProps) => {
  const isDefault = value === defaultValue;
  const showLabel = !hideLabel && isDefault;
  const showValue = hideLabel || !isDefault;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all",
            "border",
            isDefault
              ? "bg-white text-foreground border-border hover:bg-muted"
              : "bg-brand/10 text-brand border-brand/30 hover:bg-brand/15"
          )}
        >
          {icon}
          {showLabel && <span>{label}</span>}
          {showValue && <span className="text-xs max-w-[80px] truncate inline-block">{value}</span>}
          {!isDefault && (
            <span
              role="button"
              className="ml-0.5 rounded-full hover:bg-brand/20 p-0.5 transition-colors"
              onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); onChange(defaultValue); }}
            >
              <X className="h-3 w-3" />
            </span>
          )}
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className={cn("min-w-[160px] max-h-[252px] overflow-y-auto bg-white border border-border shadow-lg rounded-xl p-1.5 z-50", dropdownClassName)}
      >
        {options.map((option) => (
          <DropdownMenuItem 
            key={option} 
            onClick={() => onChange(option)}
            className={cn(
              "px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors",
              value === option 
                ? "bg-brand/10 text-brand font-medium" 
                : "text-foreground hover:bg-muted"
            )}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const TemplateFilters = ({
  sortBy,
  location,
  specialty,
  category,
  onSortChange,
  onLocationChange,
  onSpecialtyChange,
  onCategoryChange,
  onClearAll,
}: TemplateFiltersProps) => {
  const activeCount = [
    sortBy !== 'Most Popular',
    location !== 'All',
    specialty !== 'All',
    category !== 'All',
  ].filter(Boolean).length;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <FilterPill
        icon={<ArrowUpDown className="h-4 w-4" />}
        label="Sort"
        value={sortBy}
        defaultValue="Most Popular"
        options={sortOptions}
        onChange={onSortChange}
      />
      <FilterPill
        icon={<MapPin className="h-4 w-4" />}
        label="Clinic"
        value={location}
        defaultValue="All"
        options={locationOptions}
        onChange={onLocationChange}
        dropdownClassName="min-w-[340px]"
      />
      <FilterPill
        icon={<Stethoscope className="h-4 w-4" />}
        label="Specialty"
        value={specialty}
        defaultValue="All"
        options={specialtyOptions}
        onChange={onSpecialtyChange}
        dropdownClassName="min-w-[340px]"
      />
      <FilterPill
        icon={<FolderOpen className="h-4 w-4" />}
        label="Category"
        value={category}
        defaultValue="All"
        options={categoryOptions}
        onChange={onCategoryChange}
      />
      {activeCount >= 2 && onClearAll && (
        <button
          onClick={onClearAll}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
        >
          Clear all
        </button>
      )}
    </div>
  );
};
