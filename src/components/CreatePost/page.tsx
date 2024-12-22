"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import GifModal from "./GifModal/GifModal";

export default function CreatePost() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const router = useRouter();

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
      setDescription("");
      setGifUrl("");
      router.push("/");
    },
  });

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
        if (title.trim() && description.trim() && gifUrl.trim()) {
          createPost.mutate({ title, description, gifUrl });
        }
      }}
    >
      <div>
        <Label htmlFor="title">Post Title</Label>
        <Input
          id="title"
          type="text"
          placeholder="Enter post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter post description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <GifModal onGifSelect={setGifUrl} />
        {gifUrl && (
          <div className="relative mt-4 inline-block">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 bg-red-500 text-white hover:bg-red-600"
              onClick={() => setGifUrl("")}
            >
              X
            </Button>
            <img
              src={gifUrl}
              alt="Selected GIF"
              className="h-32 w-32 rounded-md border border-gray-300"
            />
          </div>
        )}
      </div>

      <Button type="submit" disabled={createPost.isPending}>
        {createPost.isPending ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
