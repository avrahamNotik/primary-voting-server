import { upload } from "./uploadMiddleware";

export const candidateUpload = upload.fields([
  {
    name: "candidateImage",
    maxCount: 1,
  },
  {
    name: "candidatePlatform",
    maxCount: 1,
  },
]);
