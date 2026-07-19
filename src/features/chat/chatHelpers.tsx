import { File, FileAudio, FileArchive, FileImage, FileText, FileVideo } from "lucide-react";
import type { ReactNode } from "react";

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export const getAttachmentIcon = (mimeType: string) => {
  const type = mimeType.toLowerCase();

  if (type.includes("image")) return FileImage;
  if (type.includes("audio")) return FileAudio;
  if (type.includes("video")) return FileVideo;
  if (type.includes("zip") || type.includes("rar") || type.includes("compressed")) return FileArchive;
  if (type.includes("pdf") || type.includes("word") || type.includes("excel") || type.includes("powerpoint")) return FileText;
  if (type.includes("text") || type.includes("csv")) return FileText;

  return File;
};

export const getFirstLine = (text: string) => text.split("\n")[0] ?? text;

export const highlightText = (content: string, query: string): ReactNode => {
  if (!query.trim()) return content;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = content.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="rounded-sm bg-yellow-300/40 text-slate-900">
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    )
  );
};
