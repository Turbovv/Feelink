"use client";

import { UploadButton } from "~/utils/uploadthing";

interface UploadThingProps {
  onUploadComplete: (files: { url: string }[]) => void;
  onUploadError: (error: Error) => void;
}

const UploadThing: React.FC<UploadThingProps> = ({ onUploadComplete, onUploadError }) => {
  return (
    <div>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={onUploadComplete}
        onUploadError={onUploadError}
      />
    </div>
  );
};

export default UploadThing;
