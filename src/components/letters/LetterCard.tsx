import { useState } from 'react';
import { Letter } from '@/types/letter';
import { format } from 'date-fns';
import { MoreHorizontal, Trash2, MessageSquare, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useLetters, canUnsend } from '@/contexts/LettersContext';
import { useToast } from '@/hooks/use-toast';

interface LetterCardProps {
  letter: Letter;
  isActive: boolean;
  onClick: () => void;
}

export const LetterCard = ({ letter, isActive, onClick }: LetterCardProps) => {
  const { deleteLetter, unsendLetter } = useLetters();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUnsendDialog, setShowUnsendDialog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const canUndoSend = canUnsend(letter);
  const showMenu = letter.status === 'to_be_sent' || canUndoSend;

  const formatTime = (date: Date) => {
    return format(new Date(date), 'h:mma').toLowerCase();
  };

  const handleDelete = () => {
    // TODO: In production, gate behind has_role() check for doctor/admin roles
    deleteLetter(letter.id);
    setShowDeleteDialog(false);
    toast({
      title: 'Letter deleted',
      description: `Letter for ${letter.patientName} has been deleted.`,
    });
  };

  const handleUnsend = () => {
    unsendLetter(letter.id);
    setShowUnsendDialog(false);
    toast({
      title: "Letter moved back to 'To be sent'",
      description: `Letter for ${letter.patientName} is editable again.`,
    });
  };

  return (
    <>
      <div
        onClick={onClick}
        className={`
          group relative p-3 px-4 rounded-xl border cursor-pointer transition-all duration-200
          ${isActive
            ? 'bg-[hsl(5_85%_92%)] border-brand/30 shadow-sm'
            : 'bg-transparent border-transparent hover:bg-white hover:border-[hsl(216_20%_90%)] hover:shadow-md'
          }
        `}
      >
        <div className="flex items-center gap-1">
          <h4 className="text-sm font-medium text-foreground truncate flex-1">{letter.patientName}</h4>
          {letter.doctorNote && (
            <MessageSquare className="h-3.5 w-3.5 text-[hsl(45_93%_47%)] shrink-0" />
          )}
          <span className="text-xs text-foreground/50 shrink-0">{formatTime(letter.sessionDate)}</span>
          {/* Three-dot menu — to_be_sent: Delete; sent within 24h: Unsend */}
          {showMenu && (
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-6 w-6 p-0 transition-opacity shrink-0 ${menuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                {letter.status === 'to_be_sent' ? (
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Delete
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => setShowUnsendDialog(true)}>
                    <Undo2 className="h-3.5 w-3.5 mr-2" />
                    Unsend
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <p className="text-xs text-foreground/60 mt-0.5">{letter.originatingDoctor}</p>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this letter?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The letter for {letter.patientName} will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
