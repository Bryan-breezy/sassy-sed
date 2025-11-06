/*
  Warnings:

  - Made the column `featured` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "featured" SET NOT NULL;
