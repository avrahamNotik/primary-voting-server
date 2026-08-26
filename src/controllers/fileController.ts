import type { Request, Response } from "express";

export const uploadFileController = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No file uploaded",
      });

      return;
    }

    const relativePath = req.file.path
      .replace(/\\/g, "/")
      .replace(/^.*\/uploads\//, "");

    const fileUrl = `/uploads/${relativePath}`;

    res.status(201).json({
      success: true,
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
      },
    });
  } catch (error) {
    console.error("Upload file error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
