import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import type { ToastItem } from "../chatTypes";

type ToastContainerProps = {
  items: ToastItem[];
  onRemove: (id: string) => void;
};

export default function ToastContainer({ items, onRemove }: ToastContainerProps) {
  useEffect(() => {
    const timers = items.map((toast) => {
      return window.setTimeout(() => onRemove(toast.id), 2200);
    });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [items, onRemove]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {items.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="max-w-xs rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 shadow-2xl"
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
