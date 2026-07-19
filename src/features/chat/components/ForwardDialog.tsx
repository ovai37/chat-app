import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { useRoomStore } from "../../rooms/roomStore";
import type { RoomData } from "../../rooms/roomStore";

type ForwardDialogProps = {
  open: boolean;
  messageId: string | null;
  onClose: () => void;
  onForward: (messageId: string, roomId: string) => void;
};

export default function ForwardDialog({ open, messageId, onClose, onForward }: ForwardDialogProps) {
  const rooms = useRoomStore((state) => state.rooms);
  const [selectedRoom, setSelectedRoom] = useState<string>(rooms[0]?.id ?? "");

  const roomOptions = useMemo(() => rooms.slice(0, 5), [rooms]);

  if (!open || !messageId) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Forward message</h3>
              <p className="mt-1 text-sm text-slate-400">
                Choose a room to forward the selected message.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close forward dialog"
              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-300">Select room</label>
            <div className="space-y-2">
              {roomOptions.length > 0 ? (
                roomOptions.map((room: RoomData) => (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => setSelectedRoom(room.id)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                      selectedRoom === room.id
                        ? "border-blue-500 bg-slate-800 text-white"
                        : "border-slate-700 bg-slate-950 text-slate-200"
                    }`}
                  >
                    <span>{room.name}</span>
                    <span className="text-xs text-slate-400">{room.owner}</span>
                  </button>
                ))
              ) : (
                <p className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-400">
                  No rooms available yet.
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedRoom}
              onClick={() => onForward(messageId, selectedRoom)}
              className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              Forward
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
