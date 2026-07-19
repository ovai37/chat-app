import { Menu, ShieldCheck } from "lucide-react";

type TopBarProps = {
  onMenuClick?: () => void;
};

export default function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-4">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-slate-800 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold sm:text-lg">
            ShareRoom
          </h1>

          <p className="hidden text-xs text-slate-400 sm:block">
            Secure Collaboration Workspace
          </p>
        </div>
      </div>

      <div className="flex items-center">
        <div className="rounded-lg bg-green-500/10 px-2 py-1 text-xs text-green-400 sm:px-3 sm:py-2 sm:text-sm">
          <ShieldCheck className="inline h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">End-to-End Encrypted</span>
        </div>
      </div>
    </header>
  );
}
