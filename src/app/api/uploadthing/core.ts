import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

export const ourFileRouter = {
  mediaUploader: f({
    image: {
      maxFileSize: "32MB",
      maxFileCount: 1,
    },
    video: {
      maxFileSize: "256MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(`Upload complete for userId: ${metadata.userId}`);
      console.log(`File URL: ${file.url}`);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
