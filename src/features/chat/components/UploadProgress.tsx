import { motion } from "framer-motion";

type UploadProgressProps = {
  progress: number;
};

export default function UploadProgress({ progress }: UploadProgressProps) {
  return (
    <div className="mt-3 rounded-2xl border border-slate-700 bg-slate-950 p-2">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
        <span>Uploading</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <motion.div
          className="h-full rounded-full bg-blue-500"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut", duration: 0.3 }}
        />
      </div>
    </div>
  );
}
