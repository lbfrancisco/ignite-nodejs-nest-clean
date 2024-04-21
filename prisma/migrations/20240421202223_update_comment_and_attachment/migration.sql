/*
  Warnings:

  - You are about to drop the column `title` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `comments` table. All the data in the column will be lost.
  - Added the required column `content` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comments" DROP COLUMN "title",
DROP COLUMN "url",
ADD COLUMN     "content" TEXT NOT NULL;
