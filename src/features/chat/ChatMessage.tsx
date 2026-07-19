import { Check, CheckCheck, Clock3, Download, FileText } from "lucide-react";
import type { ChatAttachment, ChatMessageType, MessageStatus } from "./chatTypes";
import MessageMenu from "./components/MessageMenu";

type ChatMessageProps = {
  id: string;
  sender: string;
  message: string;
  time: string;
  isOwn?: boolean;
  status?: MessageStatus;
  attachments?: ChatAttachment[];
  replyTo?: ChatMessageType;
  pinned?: boolean;
  edited?: boolean;
  highlighted?: boolean;
  isUploading?: boolean;
  uploadProgress?: number;
  searchQuery?: string;
  selectionMode?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
  onReply: () => void;
  onEdit: () => void;
  onCopy: () => void;
  onPinToggle: () => void;
  onForward: () => void;
  onDelete: () => void;
};

function MessageStatusIcon({ status }: { status?: MessageStatus }) {
  switch (status) {
    case "sending":
    case "uploading":
      return <Clock3 size={14} className="text-slate-300" />;

    case "sent":
      return <Check size={14} className="text-slate-300" />;

    case "delivered":
      return <CheckCheck size={14} className="text-slate-300" />;

    case "read":
      return (
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400">
          <CheckCheck size={11} className="text-slate-900" />
        </span>
      );

    default:
      return null;
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightSearchTerm(text: string, query?: string) {
  if (!query) return <>{text}</>;
  const escapedQuery = escapeRegExp(query.trim());
  if (!escapedQuery) return <>{text}</>;

  const regex = new RegExp(`(${escapedQuery})`, "gi");
  return (
    <>
      {text.split(regex).map((part, index) =>
        regex.test(part) ? (
          <span key={index} className="rounded-md bg-yellow-300/30 px-0.5 text-slate-900">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

export default function ChatMessage({
  id,
  sender,
  message,
  time,
  isOwn = false,
  status,
  attachments,
  replyTo,
  pinned,
  edited,
  highlighted,
  isUploading,
  uploadProgress,
  searchQuery,
  selectionMode = false,
  selected = false,
  onToggleSelect,
  onReply,
  onEdit,
  onCopy,
  onPinToggle,
  onForward,
  onDelete,
}: ChatMessageProps) {
  return (
    <div className={`relative flex ${isOwn ? "justify-end" : "justify-start"}`} id={`message-${id}`}>
      {selectionMode ? (
        <button
          type="button"
          aria-pressed={selected}
          onClick={onToggleSelect}
          className={`absolute left-0 top-0 m-2 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs transition ${
            selected
              ? "border-blue-400 bg-blue-500 text-white"
              : "border-slate-600 bg-slate-900 text-slate-400 hover:border-blue-400 hover:text-white"
          }`}
        >
          {selected ? "✔" : ""}
        </button>
      ) : null}

      <div
        className={`relative max-w-[82%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[70%] ${
          isOwn ? "bg-blue-600 text-white" : "bg-slate-800 text-white"
        } ${highlighted ? "ring-2 ring-blue-400 animate-[pulse_0.9s_2]" : ""}`}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {!isOwn && (
              <p className="mb-1 truncate text-sm font-semibold text-blue-400">
                {sender}
              </p>
            )}

            {replyTo && (
              <div className="mb-3 rounded-2xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Replying to {replyTo.sender}
                </p>
                <p className="mt-1 truncate text-sm text-white">
                  {replyTo.message || "Attachment"}
                </p>
              </div>
            )}

            {message ? (
              <p className="break-words">
                {highlightSearchTerm(message, searchQuery)}
              </p>
            ) : null}
          </div>

          <MessageMenu
            isOwn={isOwn}
            isPinned={Boolean(pinned)}
            onReply={onReply}
            onEdit={onEdit}
            onCopy={onCopy}
            onPinToggle={onPinToggle}
            onForward={onForward}
            onDelete={onDelete}
          />
        </div>

        {attachments?.length ? (
          <div className="mb-3 space-y-3">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="rounded-2xl border border-slate-700 bg-slate-950 p-3"
              >
                {attachment.isImage ? (
                  <div className="space-y-3">
                    <img
                      src={attachment.url}
                      alt={attachment.name}
                      className="max-h-56 w-full rounded-lg bg-slate-900 object-contain"
                    />
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {attachment.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {formatFileSize(attachment.size)}
                        </p>
                      </div>
                      <a
                        href={attachment.url}
                        download={attachment.name}
                        title="Download attachment"
                        aria-label={`Download ${attachment.name}`}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-blue-400 hover:text-white"
                      >
                        <Download size={16} />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300">
                        <FileText size={18} />
                      </span>
                      <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatFileSize(attachment.size)}
                      </p>
                      </div>
                    </div>
                    <a
                      href={attachment.url}
                      download={attachment.name}
                      title="Download attachment"
                      aria-label={`Download ${attachment.name}`}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-blue-400 hover:text-white"
                    >
                      <Download size={16} />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null}

        {isUploading && uploadProgress !== undefined ? (
          <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            {pinned ? (
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-900">
                Pinned
              </span>
            ) : null}
            {edited ? (
              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Edited
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <span>{time}</span>
            {isOwn && <MessageStatusIcon status={status} />}
          </div>
        </div>
      </div>
    </div>
  );
}
