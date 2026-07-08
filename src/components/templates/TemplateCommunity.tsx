import { useState, useMemo } from 'react';
import { Search, Globe } from 'lucide-react';
import { hubTemplates } from '@/data/hubTemplates';
import { TemplateCard } from './hub/TemplateCard';
import { TemplateFilters } from './hub/TemplateFilters';
import { Input } from '@/components/ui/input';
import { PaginationFooter } from '@/components/ui/pagination-footer';

export const TemplateCommunity = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Most Popular');
  const [location, setLocation] = useState('All');
  const [specialty, setSpecialty] = useState('All');
  const [category, setCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredAndSortedTemplates = useMemo(() => {
    let filtered = hubTemplates.filter((template) => {
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLocation = location === 'All' || template.author.country === location;
      
      const matchesSpecialty = specialty === 'All' || 
        template.author.specialty.toLowerCase().includes(specialty.toLowerCase());
      
      const matchesCategory = category === 'All' || template.type === category;

      return matchesSearch && matchesLocation && matchesSpecialty && matchesCategory;
    });

    // Sort
    switch (sortBy) {
      case 'Most Popular':
      case 'Most Used':
        filtered.sort((a, b) => b.usageCount - a.usageCount);
        break;
      case 'Newest':
        filtered.sort((a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());
        break;
      case 'A-Z':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }, [searchQuery, sortBy, location, specialty, category]);

  // Reset page on filter change
  const handleFilterChange = <T,>(setter: (v: T) => void) => (value: T) => {
    setter(value);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSortBy('Most Popular');
    setLocation('All');
    setSpecialty('All');
    setCategory('All');
    setCurrentPage(1);
  };

  const paginatedTemplates = filteredAndSortedTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto px-10 lg:px-14 py-10 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="h-7 w-7 text-foreground" />
            <h1 className="font-sans text-[32px] font-semibold text-foreground tracking-tight">
              Template Hub
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-10">Community</p>
        </div>

        {/* Search and Filters Row */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
            <Input
              type="text"
              placeholder="Search for a template..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-11 pr-4 py-2.5 h-11 rounded-xl"
            />
          </div>
          <TemplateFilters
            sortBy={sortBy}
            location={location}
            specialty={specialty}
            category={category}
            onSortChange={handleFilterChange(setSortBy)}
            onLocationChange={handleFilterChange(setLocation)}
            onSpecialtyChange={handleFilterChange(setSpecialty)}
            onCategoryChange={handleFilterChange(setCategory)}
            onClearAll={clearAllFilters}
          />
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {paginatedTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

        {filteredAndSortedTemplates.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No templates found matching your criteria.</p>
          </div>
        )}

        {filteredAndSortedTemplates.length > 0 && (
          <PaginationFooter
            totalItems={filteredAndSortedTemplates.length}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(limit) => { setItemsPerPage(limit); setCurrentPage(1); }}
            itemLabel="templates"
          />
        )}
      </div>
    </div>
  );
};
