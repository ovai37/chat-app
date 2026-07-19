import { motion } from "framer-motion";
import { Smile } from "lucide-react";

type ReactionPickerProps = {
  open: boolean;
  onSelect: (emoji: string) => void;
  onClose: () => void;
};

const REACTIONS = ["👍", "❤️", "😂", "🎉", "🚀", "🤝", "😮", "🙏"];

export default function ReactionPicker({ open, onSelect, onClose }: ReactionPickerProps) {
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-slate-700 bg-slate-900 p-3 shadow-2xl"
      role="menu"
      aria-label="React to message"
    >
      <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
        <Smile size={16} />
        React with emoji
      </div>
      <div className="grid grid-cols-4 gap-2">
        {REACTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
            className="rounded-2xl border border-slate-700 bg-slate-950 px-2 py-3 text-lg transition hover:border-blue-500"
            aria-label={`React with ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
