import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { navigation } from "../../config/navigation";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MobileSidebar({ open, onClose }: Props) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <h2 className="text-lg font-semibold">Workspace</h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-800"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="p-4">
          {navigation.map((section) => (
            <div key={section.title} className="mb-6">
              <h3 className="mb-2 text-xs uppercase tracking-wider text-slate-500">
                {section.title}
              </h3>

              <div className="space-y-1">
                {section.items.map(({ name, path, icon: Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-4 py-3 ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "hover:bg-slate-800"
                      }`
                    }
                  >
                    <Icon size={20} />
                    {name}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
