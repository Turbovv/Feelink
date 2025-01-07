-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "gifUrl" TEXT,
ADD COLUMN     "imageUrls" TEXT[],
ADD COLUMN     "videoUrls" TEXT[];

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "videoUrls" TEXT[];
