import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./app/layouts/MainLayout";
import DashboardLayout from "./components/layout/DashboardLayout";

import HomePage from "./features/rooms/pages/HomePage";
import CreateRoomPage from "./features/rooms/pages/CreateRoomPage";
import JoinRoomPage from "./features/rooms/pages/JoinRoomPage";

import WorkspaceHome from "./features/rooms/pages/WorkspaceHome";
import ChatPage from "./features/chat/ChatPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateRoomPage />} />
          <Route path="/join" element={<JoinRoomPage />} />
        </Route>

        {/* Workspace */}
        <Route path="/room/:roomId" element={<DashboardLayout />}>
          <Route index element={<Navigate to="chat" replace />} />

          <Route path="chat" element={<ChatPage />} />
          <Route path="notes" element={<WorkspaceHome />} />
          <Route path="files" element={<WorkspaceHome />} />
          <Route path="editor" element={<WorkspaceHome />} />
          <Route path="board" element={<WorkspaceHome />} />
          <Route path="video" element={<WorkspaceHome />} />
          <Route path="members" element={<WorkspaceHome />} />
          <Route path="settings" element={<WorkspaceHome />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
