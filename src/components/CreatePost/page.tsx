"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import GifModal from "./GifModal/GifModal";

export default function CreatePost() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/sign-in");
    }
  }, [status, router]);

  const utils = api.useContext();
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setTitle("");
      setGifUrl("");
      router.push("/");
    },
  });

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <form
      className="space-y-6 container mx-auto max-w-xl"
      onSubmit={(e) => {
        e.preventDefault();
        if (title.trim() || gifUrl.trim()) {
          createPost.mutate({ title, gifUrl });
        }
      }}
    >
      <div className="relative border border-gray-300 rounded-lg p-4">
        <div className="flex flex-col gap-4">
          <textarea
            ref={textareaRef}
            className="resize-none w-full bg-transparent focus:outline-none"
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
                className="absolute top-2 right-2 dark:bg-white bg-black rounded-full dark:text-black text-white "
                onClick={() => setGifUrl("")}
              >
                X
              </Button>
            </div>
          )}
        </div>
        <div className="flex mt-5 justify-between">
          <GifModal onGifSelect={setGifUrl} />
          <Button
            className="rounded-3xl px-5 py-2"
            type="submit"
            disabled={!title.trim() && !gifUrl.trim() || createPost.isPending}
          >
            {createPost.isPending ? "Submitting..." : "Post"}
          </Button>
        </div>
      </div>
    </form>
  );
}
