import { useEffect, useRef } from "react";
import { Search, X, ArrowUp, ArrowDown } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onPrev: () => void;
  onNext: () => void;
  matchIndex: number;
  matchCount: number;
};

export default function SearchBar({ value, onChange, onClear, onPrev, onNext, matchCount, matchIndex }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClear();
        inputRef.current?.blur();
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        onNext();
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        onPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClear, onNext, onPrev]);

  return (
    <div className="sticky top-0 z-20 mb-3 rounded-2xl border border-slate-700 bg-slate-900/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <Search size={18} className="text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              onNext();
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              onPrev();
            }
          }}
          placeholder="Search messages, senders..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          aria-label="Search messages"
        />
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous result"
          className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <ArrowUp size={16} />
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next result"
          className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <ArrowDown size={16} />
        </button>
        <div className="text-xs text-slate-400">
          {matchCount > 0 ? `${matchIndex + 1}/${matchCount}` : "0/0"}
        </div>
        {value && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
