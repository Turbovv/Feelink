import { api } from "~/trpc/react";
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { useState } from "react";
 
  

interface DeleteCommentProps {
  commentId: string;
  refetch: () => void;
}

export function DeleteComment({ commentId, refetch }: DeleteCommentProps) {
    const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteComment, isLoading }: any = api.comment.deleteComment.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = async () => {
      await deleteComment({ commentId });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger asChild>
      <Button variant="ghost" onClick={() => setIsOpen(true)} className="text-red-600">
        Delete
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <p className="text-sm text-gray-500">Are you sure you want to delete this comment? This action cannot be undone.</p>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  );
}