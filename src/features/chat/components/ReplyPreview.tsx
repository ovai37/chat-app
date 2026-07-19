import { X } from "lucide-react";
import type { ChatMessageType } from "../chatTypes";

type ReplyPreviewProps = {
  original: ChatMessageType;
  onCancel: () => void;
  onJump: () => void;
};

export default function ReplyPreview({ original, onCancel, onJump }: ReplyPreviewProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onJump}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onJump();
        }
      }}
      className="mb-3 w-full cursor-pointer rounded-2xl border-l-4 border-blue-500 bg-slate-950 px-4 py-3 text-left text-sm text-slate-200 shadow-sm transition hover:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Replying to {original.sender}
          </p>
          <p className="mt-1 truncate text-sm text-white">
            {original.message || "Attachment"}
          </p>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onCancel();
          }}
          aria-label="Cancel reply"
          className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-500">Click to jump to the replied message</p>
    </div>
  );
}

