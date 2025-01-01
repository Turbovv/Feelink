"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Ellipsis } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export function DeletePost({ postId, refetch }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { mutateAsync: deletePost, isLoading }: any = api.post.deletePost.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      refetch()
      router.push("/");
    },
    onError: (error) => {
      console.error("Error deleting post:", error.message);
    },
  });

  const handleDelete = async () => {
    try {
      await deletePost({ postId, refetch });
      refetch()
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="text-red-500" title="Delete Post">
          <Ellipsis />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogHeader>
          <h2 className="text-lg font-semibold">Confirm Deletion</h2>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
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
