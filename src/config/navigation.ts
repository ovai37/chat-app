import {
  MessageSquare,
  FileText,
  Folder,
  Code2,
  PenSquare,
  Video,
  Settings,
  Users,
} from "lucide-react";

export const navigation = [
  {
    title: "Workspace",
    items: [
      {
        name: "Chat",
        key: "chat",
        path: "/room/demo/chat",
        icon: MessageSquare,
      },
      {
        name: "Notes",
        key: "notes",
        path: "/room/demo/notes",
        icon: FileText,
      },
      {
        name: "Files",
        key: "files",
        path: "/room/demo/files",
        icon: Folder,
      },
      {
        name: "Editor",
        key: "editor",
        path: "/room/demo/editor",
        icon: Code2,
      },
      {
        name: "Whiteboard",
        key: "board",
        path: "/room/demo/board",
        icon: PenSquare,
      },
      {
        name: "Video",
        key: "video",
        path: "/room/demo/video",
        icon: Video,
      },
    ],
  },

  {
    title: "Room",
    items: [
      {
        name: "Members",
        key: "members",
        path: "/room/demo/members",
        icon: Users,
      },
      {
        name: "Settings",
        key: "settings",
        path: "/room/demo/settings",
        icon: Settings,
      },
    ],
  },
];
