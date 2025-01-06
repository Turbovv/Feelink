import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger, DialogContent} from "../ui/dialog";
import { Ellipsis } from "lucide-react";
import EditPost from "../PostId/EditPost/EditPost";
import { DeletePost } from "../deletePost";

export default function PostOwnerActions({ post, session, refetch }: any) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (session?.user.id !== post.createdBy.id) {
    return null;
  }

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsDialogOpen(true)} variant="outline">
            <Ellipsis />
          </Button>
        </DialogTrigger>
        <DialogContent className="flex">
          <div>
          <DeletePost  postId={post.id} refetch={refetch} />
          </div>
          <div>
          <EditPost
            postId={post.id}
            initialTitle={post.title}
            initialGifUrl={post.gifUrl}
            initialImageUrls={post.imageUrls}
            initialVideoUrls={post.videoUrls}
            refetch={refetch}
          />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
