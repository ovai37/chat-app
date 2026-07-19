import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNotificationStore } from "../../../stores/notificationStore";

export default function WorkspaceHome() {
  const location = useLocation();
  const clear = useNotificationStore((state) => state.clear);

  useEffect(() => {
    const page = location.pathname.split("/").pop();

    if (page) {
      clear(page);
    }
  }, [location.pathname, clear]);

  return (
    <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-700">
      <div className="text-center">
        <h2 className="text-4xl font-bold">Workspace</h2>

        <p className="mt-4 text-slate-400">
          Chat, Notes, Files, Editor and Video will appear here.
        </p>
      </div>
    </div>
  );
}
