import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { useLayout } from "../../context/LayoutContext";

export default function RightPanel() {
  const { rightPanelCollapsed, toggleRightPanel } = useLayout();

  return (
    <aside
      className={`hidden xl:flex flex-col border-l border-slate-800 bg-slate-900 transition-all duration-300 ${
        rightPanelCollapsed ? "w-16" : "w-80"
      }`}
    >
      {/* Header */}
      <div className="border-b border-slate-800">
        <div
          className={`flex items-center ${
            rightPanelCollapsed ? "justify-center p-4" : "justify-between p-4"
          }`}
        >
          {!rightPanelCollapsed && (
            <h2 className="text-lg font-semibold text-white">Room</h2>
          )}

          <button
            onClick={toggleRightPanel}
            className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            {rightPanelCollapsed ? (
              <PanelRightOpen size={20} />
            ) : (
              <PanelRightClose size={20} />
            )}
          </button>
        </div>
      </div>

      {!rightPanelCollapsed && (
        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          {/* Members */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Members
            </h3>

            <div className="space-y-2">
              <div className="rounded-lg bg-slate-800 p-3">⭐ You (Owner)</div>

              <div className="rounded-lg bg-slate-800 p-3">🟢 Alice</div>

              <div className="rounded-lg bg-slate-800 p-3">🟢 Bob</div>
            </div>
          </div>

          {/* Room Info */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Room Info
            </h3>

            <div className="space-y-2 text-sm">
              <p>Room ID: demo</p>
              <p>Status: 🔒 Encrypted</p>
              <p>Online: 3 Members</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
