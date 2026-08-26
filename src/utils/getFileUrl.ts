import type { Express } from "express";

export const getFileUrl = (file: Express.Multer.File | undefined) => {
  if (!file) {
    return undefined;
  }

  const relativePath = file.path
    .replace(/\\/g, "/")
    .replace(/^.*\/uploads\//, "");

  return `/uploads/${relativePath}`;
};
