import { ChevronDown, ChevronRight, Pin } from "lucide-react";
import type { ChatMessageType } from "../chatTypes";

type PinnedPanelProps = {
  messages: ChatMessageType[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (id: string) => void;
};

export default function PinnedPanel({ messages, isOpen, onToggle, onSelect }: PinnedPanelProps) {
  if (messages.length === 0) return null;

  return (
    <div className="mb-3 rounded-2xl border border-slate-700 bg-slate-950 shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-slate-100 transition hover:bg-slate-900"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <Pin size={16} />
          <span className="font-medium">Pinned messages</span>
        </span>
        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>

      {isOpen && (
        <div className="space-y-2 border-t border-slate-800 px-4 py-3">
          {messages.map((message) => (
            <button
              key={message.id}
              type="button"
              onClick={() => onSelect(message.id)}
              className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-left text-sm text-slate-200 transition hover:border-blue-500 hover:bg-slate-800"
            >
              <p className="truncate font-medium">{message.sender}</p>
              <p className="truncate text-xs text-slate-400">{message.message}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
