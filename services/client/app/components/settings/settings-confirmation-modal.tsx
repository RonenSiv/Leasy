import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SettingsConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  changes: { [key: string]: { old: any; new: any } };
}

export function SettingsConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  changes,
}: SettingsConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Settings Changes</DialogTitle>
          <DialogDescription>
            Are you sure you want to apply the following changes?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ul className="space-y-2">
            {Object.entries(changes).map(([key, value]) => (
              <li key={key} className="flex items-center justify-between">
                <span className="font-medium">{key}:</span>
                <span>
                  <span className="text-muted-foreground line-through mr-2">
                    {value.old}
                  </span>
                  <span className="text-primary">{value.new}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
