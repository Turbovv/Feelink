"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { useRouter } from "next/navigation";

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, onClose }) => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/auth/sign-in");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Authentication Required</DialogTitle>
          <DialogDescription>
            You need to sign in to access this feature. Click the button below to proceed to the sign-in page.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleRedirect} variant="default">
            Go to Sign-In
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
