import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, SlidersHorizontal, ArrowUpDown, ArrowUp, ArrowDown, RefreshCw, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLetters } from '@/contexts/LettersContext';
import { LetterCard } from './LetterCard';

export const LettersList = () => {
  const { letters, selectedLetterId, setSelectedLetterId } = useLetters();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const toBeSentLetters = letters.filter(l => l.status === 'to_be_sent');
  const sentLetters = letters.filter(l => l.status === 'sent');

  const filterLetters = (lettersList: typeof letters) => {
    if (!searchQuery) return lettersList;
    return lettersList.filter(letter =>
      letter.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.templateType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.originatingDoctor.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const formatGroupDate = (date: Date) => {
    return format(date, 'EEEE, MMM d');
  };

  const groupByDate = (lettersList: typeof letters) => {
    const grouped: Record<string, typeof letters> = {};
    lettersList.forEach(letter => {
      const dateKey = format(new Date(letter.sessionDate), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(letter);
    });
    return grouped;
  };

  const handleRefresh = () => {
    // Mock refresh - in real app this would re-fetch data
    setSearchQuery('');
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-border w-80 relative">
      {/* Controls - matching View Sessions */}
      <div className="p-4 space-y-3">
        <TooltipProvider delayDuration={300}>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={`h-6 w-6 text-foreground/70 hover:text-foreground hover:bg-sidebar ${showSearch ? 'bg-sidebar text-foreground' : ''}`}
                  onClick={() => setShowSearch(!showSearch)}
                >
                  <Search className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">Search</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={`h-6 w-6 text-foreground/70 hover:text-foreground hover:bg-sidebar ${showFilters ? 'bg-sidebar text-foreground' : ''}`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">Filter</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={`h-6 w-6 text-foreground/70 hover:text-foreground hover:bg-sidebar ${showSort ? 'bg-sidebar text-foreground' : ''}`}
                  onClick={() => setShowSort(!showSort)}
                >
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">Sort</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-6 w-6 text-foreground/70 hover:text-foreground hover:bg-sidebar"
                  onClick={handleRefresh}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">Refresh</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-foreground/60" />
            <Input 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              placeholder="Search letters..." 
              className="pl-9 bg-white border-[hsl(216_20%_90%)] focus:border-primary" 
              autoFocus
            />
          </div>
        )}

        {/* Filter panel stub */}
        {showFilters && (
          <div className="p-3 bg-sidebar rounded-lg border border-border">
            <p className="text-xs text-foreground/60">Filter options coming soon...</p>
          </div>
        )}

        {/* Sort panel */}
        {showSort && (
          <div className="flex gap-1.5">
            <Button
              variant={sortOrder === 'asc' ? 'default' : 'outline'}
              size="sm"
              className="h-7 text-xs px-3 rounded-full gap-1.5"
              onClick={() => setSortOrder('asc')}
            >
              <ArrowUp className="h-3 w-3" />
              Ascending
            </Button>
            <Button
              variant={sortOrder === 'desc' ? 'default' : 'outline'}
              size="sm"
              className="h-7 text-xs px-3 rounded-full gap-1.5"
              onClick={() => setSortOrder('desc')}
            >
              <ArrowDown className="h-3 w-3" />
              Descending
            </Button>
          </div>
        )}
      </div>

      {/* Tabs - Pill style matching View Sessions */}
      <Tabs defaultValue="to-be-sent" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="w-full justify-start bg-transparent px-4 h-auto py-2 rounded-none gap-0.5">
          <TabsTrigger 
            value="to-be-sent" 
            className="rounded-full border border-transparent bg-muted text-muted-foreground text-xs px-3 py-1 data-[state=active]:bg-[hsl(5_85%_92%)] data-[state=active]:text-foreground data-[state=active]:border-brand/30 hover:text-foreground"
          >
            To be sent
            {toBeSentLetters.length > 0 && (
              <span className="ml-1.5 text-xs">
                ({toBeSentLetters.length})
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="sent" 
            className="rounded-full border border-transparent bg-muted text-muted-foreground text-xs px-3 py-1 data-[state=active]:bg-[hsl(5_85%_92%)] data-[state=active]:text-foreground data-[state=active]:border-brand/30 hover:text-foreground"
          >
            Sent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="to-be-sent" className="flex-1 overflow-y-auto m-0 p-4 space-y-1">
          {filterLetters(toBeSentLetters).length === 0 ? (
            <div className="text-center text-foreground/60 py-8">
              No letters pending
            </div>
          ) : (
            Object.entries(groupByDate(filterLetters(toBeSentLetters))).sort(([a], [b]) => sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a)).map(([date, dateLetters]) => (
              <div key={date} className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-foreground/50 px-2 font-medium">
                  <Calendar className="h-3 w-3" />
                  <span>{formatGroupDate(new Date(date))}</span>
                </div>
                <div className="space-y-1">
                  {dateLetters.map(letter => (
                    <LetterCard
                      key={letter.id}
                      letter={letter}
                      isActive={selectedLetterId === letter.id}
                      onClick={() => setSelectedLetterId(letter.id)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="sent" className="flex-1 overflow-y-auto m-0 p-4 space-y-1">
          {filterLetters(sentLetters).length === 0 ? (
            <div className="text-center text-foreground/60 py-8">
              No sent letters
            </div>
          ) : (
            Object.entries(groupByDate(filterLetters(sentLetters))).sort(([a], [b]) => sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a)).map(([date, dateLetters]) => (
              <div key={date} className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-foreground/50 px-2 font-medium">
                  <Calendar className="h-3 w-3" />
                  <span>{formatGroupDate(new Date(date))}</span>
                </div>
                <div className="space-y-1">
                  {dateLetters.map(letter => (
                    <LetterCard
                      key={letter.id}
                      letter={letter}
                      isActive={selectedLetterId === letter.id}
                      onClick={() => setSelectedLetterId(letter.id)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
