import fs from "fs";
import path from "path";
import logger from "./logger";

/**
 * Deletes a file from the `public/uploads` directory if it exists.
 * @param filePath Public-facing path, e.g., `/uploads/template_123.png`
 */
export function deleteUploadFile(filePath: string): void {
  // Normalize and ensure path is inside /public/uploads
  const baseUploadPath = path.join(process.cwd(), "public", "uploads");
  const fileName = path.basename(filePath); // just filename
  const fullPath = path.join(baseUploadPath, fileName);

  // Extra safety check
  if (!fullPath.startsWith(baseUploadPath)) {
    logger.warn("Refused to delete: file outside uploads directory.");
    return;
  }

  // Delete file if it exists
  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) {
      logger.warn("File not found:", fullPath);
      return;
    }

    fs.unlink(fullPath, (err) => {
      if (err) {
        logger.error("Failed to delete file:", err);
      } else {
        logger.log("Deleted file:", fullPath);
      }
    });
  });
}
