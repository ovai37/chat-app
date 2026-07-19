import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import RightPanel from "./RightPanel";
import TopBar from "./TopBar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex flex-1 overflow-hidden">
          <section className="flex-1 overflow-y-auto p-4 pb-20 lg:p-6">
            <Outlet />
          </section>

          <RightPanel />
        </main>
      </div>
    </div>
  );
}
