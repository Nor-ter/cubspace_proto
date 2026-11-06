import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/ui/AlertDialog';

export function ResetDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="reset-dialog">
        <AlertDialogTitle>
          Would you like to reset your learning history?
        </AlertDialogTitle>
        <AlertDialogDescription>
          Quiz answers and completion markers for all sessions will be reset.
          Use this when you want to restart the course.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel className="secondary">Cancel</AlertDialogCancel>
          <AlertDialogAction className="primary" onClick={onConfirm}>
            Full reset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
