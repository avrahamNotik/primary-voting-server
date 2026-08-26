import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDirectory = path.join(process.cwd(), "uploads");

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    let folder = "";

    if (file.fieldname === "partyImage") {
      folder = "parties/images";
    } else if (file.fieldname === "partyPlatform") {
      folder = "parties/platforms";
    } else if (file.fieldname === "candidateImage") {
      folder = "candidates/images";
    } else if (file.fieldname === "candidatePlatform") {
      folder = "candidates/platforms";
    } else {
      cb(new Error("Invalid file field"), "");
      return;
    }

    const destination = path.join(uploadDirectory, folder);

    fs.mkdirSync(destination, { recursive: true });

    cb(null, destination);
  },

  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);

    const filename = `${Date.now()}-${Math.round(
      Math.random() * 1_000_000_000,
    )}${extension}`;

    cb(null, filename);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const imageFields = ["partyImage", "candidateImage"];

  const pdfFields = ["partyPlatform", "candidatePlatform"];

  if (imageFields.includes(file.fieldname)) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only JPG, PNG and WEBP images are allowed"));

      return;
    }

    cb(null, true);

    return;
  }

  if (pdfFields.includes(file.fieldname)) {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Only PDF files are allowed"));

      return;
    }

    cb(null, true);

    return;
  }

  cb(new Error("Invalid file field"));
};

export const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
