import fs from "fs/promises";
import path from "path";

export const deleteFile = async (fileUrl?: string | null) => {
  if (!fileUrl) {
    return;
  }

  // רק קבצים מקומיים
  if (!fileUrl.startsWith("/uploads/")) {
    return;
  }

  const relativePath = fileUrl.replace(/^\/uploads\//, "");

  const filePath = path.join(process.cwd(), "uploads", relativePath);

  try {
    await fs.unlink(filePath);

    console.log(`Deleted file: ${filePath}`);
  } catch (error: any) {
    // אם הקובץ כבר לא קיים - לא נחשב שגיאה
    if (error.code === "ENOENT") {
      return;
    }

    throw error;
  }
};
