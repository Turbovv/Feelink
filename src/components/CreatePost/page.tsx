"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export default function CreatePost() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [gifQuery, setGifQuery] = useState("");
  const router = useRouter();

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

  const { data: gifResults = [], refetch } = api.gif.search.useQuery(
    { query: gifQuery },
    {
      enabled: false,
    }
  );

//   if (!session) {
//     return <p>Please log in to create posts.</p>;
//   }

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
        <Label htmlFor="gifSearch">Search GIF</Label>
        <Input
          id="gifSearch"
          type="text"
          placeholder="Search for a GIF (e.g., 'Batman')"
          value={gifQuery}
          onChange={(e) => setGifQuery(e.target.value)}
          onBlur={() => refetch()}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {gifResults.map((gif: any) => (
            <img
              key={gif.id}
              src={gif.url}
              alt="GIF"
              className={`h-24 w-24 cursor-pointer rounded border ${
                gifUrl === gif.url ? "border-blue-500" : "border-gray-300"
              }`}
              onClick={() => setGifUrl(gif.url)}
            />
          ))}
        </div>
        {gifUrl && (
          <p className="mt-2 text-sm text-blue-500">Selected GIF:
          <img src={gifUrl}></img>
          </p>
        )}
      </div>

      <Button type="submit" className="" disabled={createPost.isPending}>
        {createPost.isPending ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
