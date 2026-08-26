import { upload } from "./uploadMiddleware";

export const partyUpload = upload.fields([
  {
    name: "partyImage",
    maxCount: 1,
  },
  {
    name: "partyPlatform",
    maxCount: 1,
  },
]);
