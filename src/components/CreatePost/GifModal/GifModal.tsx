"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { FilmIcon } from "lucide-react";

interface GifPickerProps {
  onGifSelect: (gifUrl: string) => void;
}

export default function GifModal({ onGifSelect }: GifPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [gifQuery, setGifQuery] = useState("");
  const { data: gifResults = [], refetch } = api.gif.search.useQuery(
    { query: gifQuery },
    { enabled: false }
  );

  useEffect(() => {
    if (gifQuery.trim() !== "") {
      refetch();
    }
  }, [gifQuery, refetch]);

  const handleGifSelect = (url: string) => {
    onGifSelect(url);
    setIsOpen(false); 
  };

  return (
    <>
      <Button variant="ghost" onClick={() => setIsOpen(true)}>
      <FilmIcon className="border-2 border-blue-500" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pick a GIF</DialogTitle>
          </DialogHeader>
          <div>
            <Input
              type="text"
              placeholder="Search for a GIF (e.g., 'Batman')"
              value={gifQuery}
              onChange={(e) => setGifQuery(e.target.value)}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {gifResults.map((gif: any) => (
                <div key={gif.id} className="relative">

                  <img
                    src={gif.url}
                    alt="GIF"
                    className="h-24 w-24 cursor-pointer rounded border border-gray-300 hover:border-blue-500"
                    onClick={() => handleGifSelect(gif.url)}
                  />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
