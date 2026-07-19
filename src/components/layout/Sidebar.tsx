import { NavLink } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { navigation } from "../../config/navigation";
import { useLayout } from "../../context/LayoutContext";
import { useNotificationStore } from "../../stores/notificationStore";

type SidebarProps = {
  mobile?: boolean;
};

export default function Sidebar({ mobile = false }: SidebarProps) {
  const { sidebarCollapsed, toggleSidebar } = useLayout();
  const unread = useNotificationStore((state) => state.unread);
  // const clear = useNotificationStore((state) => state.clear);
  // const unread = {
  //   chat: 5,
  //   notes: 2,
  //   files: 1,
  //   editor: 0,
  //   board: 5,
  //   video: 0,
  //   members: 0,
  //   settings: 0,
  // };
  console.log("Unread:", unread);

  return (
    <aside
      className={`${
        mobile ? "flex w-64" : "hidden lg:flex"
      } flex-col border-r border-slate-800 bg-slate-900 transition-all duration-300 ${
        mobile ? "" : sidebarCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="border-b border-slate-800">
        <div
          className={`flex items-center ${
            mobile
              ? "justify-between p-4"
              : sidebarCollapsed
              ? "justify-center p-4"
              : "justify-between p-4"
          }`}
        >
          {(!sidebarCollapsed || mobile) && (
            <h2 className="text-lg font-semibold text-white">Workspace</h2>
          )}

          {!mobile && (
            <button
              onClick={toggleSidebar}
              className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen size={20} />
              ) : (
                <PanelLeftClose size={20} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navigation.map((section) => (
          <div key={section.title} className="mb-6">
            {(!sidebarCollapsed || mobile) && (
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {section.title}
              </h3>
            )}

            <div className="space-y-1 px-2">
              {section.items.map(({ name, key, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `relative flex items-center rounded-lg transition-all duration-200 ${
                      mobile
                        ? "gap-3 px-4 py-3"
                        : sidebarCollapsed
                        ? "justify-center py-3"
                        : "gap-3 px-4 py-3"
                    } ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                  title={sidebarCollapsed && !mobile ? name : ""}
                >
                  <Icon size={20} className="shrink-0" />

                  {(!sidebarCollapsed || mobile) && (
                    <span className="flex-1 truncate">{name}</span>
                  )}

                  {unread[key] > 0 && (
                    <span
                      className={`absolute flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ${
                        sidebarCollapsed && !mobile
                          ? "top-1 right-1"
                          : "right-3 top-1/2 -translate-y-1/2"
                      }`}
                    >
                      {unread[key] > 99 ? "99+" : unread[key]}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
