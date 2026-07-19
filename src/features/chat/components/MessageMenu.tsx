import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Copy, Edit3, MoreHorizontal, Pin, Repeat, Reply, Trash2 } from "lucide-react";

type MessageMenuProps = {
  isOwn: boolean;
  isPinned?: boolean;
  onReply?: () => void;
  onEdit?: () => void;
  onCopy?: () => void;
  onPinToggle?: () => void;
  onForward?: () => void;
  onDelete?: () => void;
};

export default function MessageMenu({
  isOwn,
  isPinned,
  onReply,
  onEdit,
  onCopy,
  onPinToggle,
  onForward,
  onDelete,
}: MessageMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const touchTimer = useRef<number | null>(null);

  const handleToggle = () => setOpen((value) => !value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (event.target instanceof Node && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTouchStart = () => {
    touchTimer.current = window.setTimeout(() => setOpen(true), 500);
  };

  const handleTouchEnd = () => {
    if (touchTimer.current) {
      window.clearTimeout(touchTimer.current);
      touchTimer.current = null;
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-label="Open message menu"
        onClick={handleToggle}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
      >
        <MoreHorizontal size={18} />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-slate-700 bg-slate-900 p-2 shadow-2xl"
            role="menu"
          >
            <button
              type="button"
              onClick={() => {
                onReply?.();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-slate-800"
            >
              <Reply size={16} />
              Reply
            </button>
            {isOwn && (
              <button
                type="button"
                onClick={() => {
                  onEdit?.();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-slate-800"
              >
                <Edit3 size={16} />
                Edit
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onCopy?.();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-slate-800"
            >
              <Copy size={16} />
              Copy
            </button>
            <button
              type="button"
              onClick={() => {
                onPinToggle?.();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-slate-800"
            >
              <Pin size={16} />
              {isPinned ? "Unpin" : "Pin"}
            </button>
            <button
              type="button"
              onClick={() => {
                onForward?.();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-slate-800"
            >
              <Repeat size={16} />
              Forward
            </button>
            {isOwn && (
              <button
                type="button"
                onClick={() => {
                  onDelete?.();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-rose-300 transition hover:bg-slate-800"
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
