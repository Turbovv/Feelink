"use client";

import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import GifModal from "./GifModal/GifModal";
import UploadThing from "./UploadThing/UploadThing";

export default function CreatePost() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  const utils = api.useContext();
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setTitle("");
      setGifUrl("");
      setImageUrls([]);
      setVideoUrls([]);
      router.push("/");
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
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (title.trim() || gifUrl.trim() || imageUrls.length > 0 || videoUrls.length > 0) {
          createPost.mutate({ title, gifUrl, imageUrls, videoUrls });
        }
      }}
    >
      <div className="relative rounded-lg border border-gray-300 p-4">
        <div className="flex flex-col gap-4">
          <textarea
            ref={textareaRef}
            className="w-full resize-none bg-transparent focus:outline-none"
            placeholder="What is Happening?!"
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
                    key={index}
                    src={url}
                    className=" w-full rounded-lg"
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

        <div className=" flex items-center justify-end">
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
            disabled={(!title.trim() && !gifUrl.trim() && imageUrls.length === 0 && videoUrls.length === 0) || createPost.isPending}
          >
            {createPost.isPending ? "Submitting..." : "Post"}
          </Button>
        </div>
      </div>
    </form>
  );
}
