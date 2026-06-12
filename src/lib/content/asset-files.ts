/** Admin CMS uploads: documents, images, and common office formats. */
export const CONTENT_ASSET_MAX_BYTES = 5 * 1024 * 1024;

const EXTENSION_MIME: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  txt: "text/plain",
  csv: "text/csv",
  rtf: "application/rtf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  bmp: "image/bmp",
  heic: "image/heic",
  heif: "image/heif",
  tiff: "image/tiff",
  tif: "image/tiff",
  ico: "image/x-icon",
};

const BLOCKED_EXTENSIONS = new Set([
  "exe", "msi", "bat", "cmd", "com", "scr", "ps1", "sh", "bash", "zsh",
  "js", "mjs", "cjs", "ts", "jsx", "tsx", "html", "htm", "php", "asp", "aspx",
  "jar", "dll", "so", "dylib", "app", "deb", "rpm", "dmg", "pkg", "apk",
  "vbs", "wsf", "reg", "inf",
]);

export const CONTENT_ASSET_ACCEPT =
  ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf," +
  ".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp,.heic,.heif,.tiff,.tif,.ico," +
  "application/pdf,application/msword," +
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document," +
  "image/*";

export function getFileExtension(fileName: string): string {
  const parts = fileName.toLowerCase().split(".");
  return parts.length > 1 ? (parts.pop() ?? "") : "";
}

export function resolveContentAssetMimeType(fileName: string, reportedType?: string): string {
  const ext = getFileExtension(fileName);
  if (reportedType && reportedType !== "application/octet-stream") {
    return reportedType;
  }
  return EXTENSION_MIME[ext] ?? "application/octet-stream";
}

export function validateContentAssetFile(fileName: string, size: number): string | null {
  if (!fileName.trim()) return "File name is required.";

  const ext = getFileExtension(fileName);
  if (!ext) return "File must have an extension (e.g. .pdf, .docx, .png).";

  if (BLOCKED_EXTENSIONS.has(ext)) {
    return `File type .${ext} is not allowed for security reasons.`;
  }

  if (!EXTENSION_MIME[ext]) {
    return `Unsupported file type .${ext}. Use PDF, Word (.doc/.docx), images, or other office documents.`;
  }

  if (size <= 0) return "File is empty.";
  if (size > CONTENT_ASSET_MAX_BYTES) {
    return `File too large (max ${CONTENT_ASSET_MAX_BYTES / (1024 * 1024)}MB).`;
  }

  return null;
}

export function formatAssetTypeLabel(mimeType: string, fileName: string): string {
  if (mimeType.startsWith("image/")) return "Image";
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType.includes("wordprocessingml") || mimeType === "application/msword") return "Word";
  if (mimeType.includes("spreadsheetml") || mimeType === "application/vnd.ms-excel") return "Excel";
  if (mimeType.includes("presentationml") || mimeType === "application/vnd.ms-powerpoint") return "PowerPoint";
  const ext = getFileExtension(fileName);
  return ext ? ext.toUpperCase() : "File";
}
