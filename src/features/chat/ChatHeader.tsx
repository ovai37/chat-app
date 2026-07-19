import { useMemo, useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, MoreVertical, Users, Trash2, CheckSquare } from "lucide-react";
import { useRoomStore } from "../rooms/roomStore";

type ChatHeaderProps = {
  onSearchToggle: () => void;
  onToggleSelectionMode: () => void;
  onDeleteSelected: () => void;
  onClearSearch: () => void;
  selectedCount: number;
  searchActive: boolean;
};

export default function ChatHeader({
  onSearchToggle,
  onToggleSelectionMode,
  onDeleteSelected,
  onClearSearch,
  selectedCount,
  searchActive,
}: ChatHeaderProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { roomId } = useParams();
  const room = useRoomStore(
    useMemo(
      () => (state) => (roomId ? state.findRoom(roomId) : undefined),
      [roomId]
    )
  );

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

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-900">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {room ? `# ${room.name}` : roomId ? `# ${roomId}` : "# General"}
        </h2>
        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Users size={14} />
          <span>{room ? `${room.owner}’s room` : "Join or create a room"}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSearchToggle}
          className="rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle search"
        >
          <Search size={20} />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Open conversation menu"
          >
            <MoreVertical size={20} />
          </button>

          <AnimatePresence>
            {open ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-slate-700 bg-slate-900 p-2 shadow-2xl"
              >
                <button
                  type="button"
                  onClick={() => {
                    onToggleSelectionMode();
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-slate-800"
                >
                  <CheckSquare size={16} />
                  {selectedCount > 0 ? "Cancel selection" : "Select messages"}
                </button>

                <button
                  type="button"
                  disabled={selectedCount === 0}
                  onClick={() => {
                    if (selectedCount > 0) {
                      onDeleteSelected();
                    }
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:text-slate-500"
                >
                  <Trash2 size={16} />
                  Delete selected
                </button>

                {searchActive ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClearSearch();
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-slate-800"
                  >
                    <Search size={16} />
                    Clear search
                  </button>
                ) : null}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
