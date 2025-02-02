"use client";

import { useState, useRef } from "react";
import { api } from "~/trpc/react";
import { Button } from "../../ui/button";
import GifModal from "../../CreatePost/GifModal/GifModal";
import UploadThing from "../../CreatePost/UploadThing/UploadThing";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';

export default function EditPost({ postId, initialTitle, initialGifUrl, initialImageUrls, initialVideoUrls }: any) {
  const [title, setTitle] = useState(initialTitle || "");
  const [gifUrl, setGifUrl] = useState(initialGifUrl || "");
  const [imageUrls, setImageUrls] = useState<string[]>(initialImageUrls || []);
  const [videoUrls, setVideoUrls] = useState<string[]>(initialVideoUrls || []);
  const [isOpen, setIsOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const utils = api.useContext();
  const editPost = api.post.editPost.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setIsOpen(false);
    },
  });

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };
  const removeVideo = (index: number) => {
    setVideoUrls((prev) => prev.filter((_, i) => i !== index));
  };
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() || gifUrl.trim() || imageUrls.length > 0 || videoUrls.length > 0) {
      editPost.mutate({ postId, title, gifUrl, imageUrls, videoUrls });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Edit Post
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Your Post</DialogTitle>
          <DialogDescription>Make changes to your post below.</DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleEditSubmit}>
          <div className="relative rounded-lg border border-gray-300 p-4">
            <div className="flex flex-col gap-4">
              <textarea
                ref={textareaRef}
                className="w-full resize-none bg-transparent focus:outline-none"
                placeholder="Edit your post..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onInput={handleInput}
              />

              {gifUrl && (
                <div className="relative">
                  <img
                    src={gifUrl}
                    alt="Selected GIF"
                    className="w-full rounded-md border border-gray-300"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 rounded-full bg-black text-white dark:bg-white dark:text-black"
                    onClick={() => setGifUrl("")}
                  >
                    X
                  </Button>
                </div>
              )}

              {imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Uploaded image ${index + 1}`}
                        className="w-full rounded-lg"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 rounded-full bg-black text-white dark:bg-white dark:text-black"
                        onClick={() => removeImage(index)}
                      >
                        X
                      </Button>
                    </div>
                  ))}
                </div>
              )}


              {videoUrls.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {videoUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <video
                        key={index}
                        src={url}
                        className="w-full rounded-lg"
                        controls
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 rounded-full bg-black text-white dark:bg-white dark:text-black"
                        onClick={() => removeVideo(index)}
                      >
                        X
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-between">
              <GifModal onGifSelect={setGifUrl} />

              <UploadThing
                onUploadComplete={(files) => {
                  if (files.some((file: any) => file.type.startsWith("image/"))) {
                    setImageUrls((prev) => [...prev, ...files.filter((file: any) => file.type.startsWith("image/")).map((file) => file.url)]);
                  } else {
                    setVideoUrls((prev) => [...prev, ...files.filter((file: any) => file.type.startsWith("video/")).map((file) => file.url)]);
                  }
                }}
                onUploadError={(error) => alert(error.message)}
              />

              <Button
                className="rounded-3xl px-5 py-2"
                type="submit"
                disabled={(!title.trim() && !gifUrl.trim() && imageUrls.length === 0) || editPost.isPending}
              >
                {editPost.isPending ? "Updating..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
