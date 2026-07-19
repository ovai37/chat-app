import { motion, AnimatePresence } from "framer-motion";
import type { ChatReactionState } from "../chatTypes";

type ReactionBarProps = {
  reactions?: ChatReactionState;
  onToggle: (emoji: string) => void;
};

export default function ReactionBar({ reactions, onToggle }: ReactionBarProps) {
  const entries = Object.entries(reactions ?? {});
  if (entries.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        className="mt-3 flex flex-wrap items-center gap-2"
      >
        {entries.map(([emoji, users]) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onToggle(emoji)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-100 transition hover:border-blue-500"
          >
            <span>{emoji}</span>
            <span>{users.length}</span>
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
