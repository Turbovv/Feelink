import { UploadButton } from "~/utils/uploadthing";
import { File } from "lucide-react";

interface UploadThingProps {
  onUploadComplete: (files: { url: string }[]) => void;
  onUploadError: (error: Error) => void;
}

const UploadThing: React.FC<UploadThingProps> = ({ onUploadComplete, onUploadError }) => {
  return (
    <div className="relative inline-flex items-center">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <File size={20} className="text-gray-700" />
      </div>

      <UploadButton
        endpoint="mediaUploader"
        onClientUploadComplete={onUploadComplete}
        onUploadError={onUploadError}
        className="h-10 w-full opacity-0"
      />
    </div>
  );
};

export default UploadThing;
