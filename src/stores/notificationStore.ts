import { create } from "zustand";

type NotificationState = {
  unread: Record<string, number>;

  increment: (feature: string) => void;
  clear: (feature: string) => void;
  setUnread: (feature: string, count: number) => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  unread: {
    chat: 5,
    notes: 0,
    files: 0,
    editor: 0,
    board: 0,
    video: 0,
    members: 0,
    settings: 0,
  },

  increment: (feature) =>
    set((state) => ({
      unread: {
        ...state.unread,
        [feature]: state.unread[feature] + 1,
      },
    })),

  clear: (feature) =>
    set((state) => ({
      unread: {
        ...state.unread,
        [feature]: 0,
      },
    })),

  setUnread: (feature, count) =>
    set((state) => ({
      unread: {
        ...state.unread,
        [feature]: count,
      },
    })),
}));
