import type { ChatMessageType } from "../chatTypes";
import { getFirstLine } from "../chatHelpers";

type ReplyBubbleProps = {
  original: ChatMessageType;
  onClick: () => void;
};

export default function ReplyBubble({ original, onClick }: ReplyBubbleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-3 w-full rounded-2xl border-l-4 border-blue-500 bg-slate-950 px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-900"
      aria-label={`Jump to replied message from ${original.sender}`}
    >
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
        Replying to {original.sender}
      </p>
      <p className="mt-1 truncate text-sm text-white">{getFirstLine(original.message)}</p>
    </button>
  );
}
