import { create } from "zustand";
import type { ChatAttachment, ChatMessageType, ToastItem } from "./chatTypes";

interface ChatStore {
  messages: ChatMessageType[];
  draftAttachments: File[];
  replyToId: string | null;
  editingMessageId: string | null;
  searchQuery: string;
  isPinnedPanelOpen: boolean;
  forwardDialogMessageId: string | null;
  toastItems: ToastItem[];
  highlightedMessageId: string | null;
  selectedMessageIds: string[];
  searchMatches: string[];
  searchIndex: number;
  sendMessage: (text: string, attachments?: File[], replyToId?: string | null) => void;
  replyToMessage: (messageId: string) => void;
  cancelReply: () => void;
  editMessage: (messageId: string | null) => void;
  saveEdit: (messageId: string, text: string) => void;
  deleteMessage: (messageId: string) => void;
  toggleMessageSelection: (messageId: string) => void;
  clearSelectedMessages: () => void;
  deleteSelectedMessages: () => void;
  nextSearchMatch: () => void;
  prevSearchMatch: () => void;
  pinMessage: (messageId: string) => void;
  unpinMessage: (messageId: string) => void;
  toggleReaction: (messageId: string, emoji: string) => void;
  copyMessage: (messageId: string) => void;
  togglePinnedPanel: () => void;
  searchMessages: (query: string) => void;
  openForwardDialog: (messageId: string) => void;
  closeForwardDialog: () => void;
  forwardMessage: (_messageId: string, roomId: string) => void;
  addToast: (message: string) => void;
  removeToast: (toastId: string) => void;
  highlightMessage: (messageId: string) => void;
  clearHighlightedMessage: () => void;
  addDraftAttachments: (files: File[]) => void;
  removeDraftAttachment: (index: number) => void;
  clearDraftAttachments: () => void;
}

let highlightTimeout: number | null = null;

const buildAttachments = (files: File[] = []): ChatAttachment[] =>
  files.map((file) => ({
    id: crypto.randomUUID(),
    name: file.name,
    size: file.size,
    type: file.type,
    url: URL.createObjectURL(file),
    isImage: file.type.startsWith("image/"),
  }));

const revokeAttachmentUrls = (messages: ChatMessageType[]) => {
  messages.forEach((message) => {
    message.attachments?.forEach((attachment) => {
      URL.revokeObjectURL(attachment.url);
    });
  });
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [
    {
      id: crypto.randomUUID(),
      sender: "Alice",
      message: "Welcome to ShareRoom 👋",
      time: "10:30 AM",
      createdAt: new Date().toISOString(),
      isOwn: false,
      status: "read",
    },
    {
      id: crypto.randomUUID(),
      sender: "You",
      message: "Looks awesome!",
      time: "10:31 AM",
      createdAt: new Date().toISOString(),
      isOwn: true,
      status: "read",
    },
  ],

  replyToId: null,
  editingMessageId: null,
  searchQuery: "",
  isPinnedPanelOpen: false,
  forwardDialogMessageId: null,
  toastItems: [],
  highlightedMessageId: null,
  selectedMessageIds: [],
  searchMatches: [],
  searchIndex: 0,
  draftAttachments: [],

  sendMessage: (text, attachments = [], replyToId) => {
    const now = new Date();
    const hasAttachments = attachments.length > 0;
    const nextMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      sender: "You",
      message: text,
      time: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: now.toISOString(),
      isOwn: true,
      status: hasAttachments ? "uploading" : "sending",
      attachments: hasAttachments ? buildAttachments(attachments) : undefined,
      replyTo: replyToId ?? undefined,
      reactions: {},
      uploadProgress: hasAttachments ? 0 : undefined,
      isUploading: hasAttachments ? true : undefined,
    };

    set((state) => ({
      messages: [...state.messages, nextMessage],
      replyToId: null,
      editingMessageId: null,
      draftAttachments: [],
    }));

    if (hasAttachments) {
      let progress = 0;
      const interval = window.setInterval(() => {
        progress = Math.min(100, progress + Math.floor(Math.random() * 20) + 10);
        set((state) => ({
          messages: state.messages.map((message) =>
            message.id === nextMessage.id
              ? {
                  ...message,
                  uploadProgress: progress,
                  status: progress < 100 ? "uploading" : "sent",
                  isUploading: progress < 100,
                }
              : message
          ),
        }));

        if (progress >= 100) {
          window.clearInterval(interval);
        }
      }, 180);
    } else {
      window.setTimeout(() => {
        set((state) => ({
          messages: state.messages.map((message) =>
            message.id === nextMessage.id
              ? { ...message, status: "sent" }
              : message
          ),
        }));
      }, 300);
    }
  },

  replyToMessage: (messageId) =>
    set(() => ({
      replyToId: messageId,
      editingMessageId: null,
    })),

  cancelReply: () =>
    set(() => ({
      replyToId: null,
    })),

  editMessage: (messageId) =>
    set(() => ({
      editingMessageId: messageId,
      replyToId: null,
      draftAttachments: [],
    })),

  saveEdit: (messageId, text) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === messageId
          ? {
              ...message,
              message: text,
              edited: true,
              editedAt: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : message
      ),
      editingMessageId: null,
    })),

  deleteMessage: (messageId) =>
    set((state) => {
      const removedMessages = state.messages.filter((message) => message.id === messageId);
      revokeAttachmentUrls(removedMessages);

      return {
        messages: state.messages.filter((message) => message.id !== messageId),
        replyToId: state.replyToId === messageId ? null : state.replyToId,
        editingMessageId:
          state.editingMessageId === messageId ? null : state.editingMessageId,
      };
    }),

  addDraftAttachments: (files) =>
    set((state) => ({
      draftAttachments: [...state.draftAttachments, ...files].slice(0, 5),
    })),

  removeDraftAttachment: (index) =>
    set((state) => ({
      draftAttachments: state.draftAttachments.filter((_, idx) => idx !== index),
    })),

  clearDraftAttachments: () =>
    set(() => ({
      draftAttachments: [],
    })),

  pinMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === messageId ? { ...message, pinned: true } : message
      ),
    })),

  unpinMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === messageId ? { ...message, pinned: false } : message
      ),
    })),

  togglePinnedPanel: () =>
    set((state) => ({
      isPinnedPanelOpen: !state.isPinnedPanelOpen,
    })),

  toggleReaction: (messageId, emoji) =>
    set((state) => ({
      messages: state.messages.map((message) => {
        if (message.id !== messageId) return message;

        const existing = message.reactions?.[emoji] ?? [];
        const hasReacted = existing.includes("You");
        const nextUsers = hasReacted
          ? existing.filter((user) => user !== "You")
          : [...existing, "You"];

        return {
          ...message,
          reactions: {
            ...message.reactions,
            [emoji]: nextUsers,
          },
        };
      }),
    })),

  copyMessage: (messageId) =>
    set((state) => {
      const message = state.messages.find((item) => item.id === messageId);
      if (!message) return {};

      navigator.clipboard.writeText(message.message).catch(() => {
        /* ignore clipboard failures */
      });

      return {
        toastItems: [
          ...state.toastItems,
          {
            id: crypto.randomUUID(),
            message: "Copied!",
          },
        ],
      };
    }),

  toggleMessageSelection: (messageId) =>
    set((state) => ({
      selectedMessageIds: state.selectedMessageIds.includes(messageId)
        ? state.selectedMessageIds.filter((id) => id !== messageId)
        : [...state.selectedMessageIds, messageId],
    })),

  clearSelectedMessages: () =>
    set(() => ({
      selectedMessageIds: [],
    })),

  deleteSelectedMessages: () =>
    set((state) => {
      const selectedIds = new Set(state.selectedMessageIds);
      const removedMessages = state.messages.filter((message) => selectedIds.has(message.id));
      revokeAttachmentUrls(removedMessages);

      return {
        messages: state.messages.filter((message) => !selectedIds.has(message.id)),
        selectedMessageIds: [],
        highlightedMessageId: null,
        replyToId: state.replyToId && selectedIds.has(state.replyToId) ? null : state.replyToId,
        editingMessageId:
          state.editingMessageId && selectedIds.has(state.editingMessageId)
            ? null
            : state.editingMessageId,
      };
    }),

  searchMessages: (query) =>
    set((state) => {
      const normalizedQuery = query.trim().toLowerCase();
      const matches = normalizedQuery
        ? state.messages
            .filter(
              (message) =>
                message.message.toLowerCase().includes(normalizedQuery) ||
                message.sender.toLowerCase().includes(normalizedQuery)
            )
            .map((message) => message.id)
        : [];

      return {
        searchQuery: query,
        searchMatches: matches,
        searchIndex: 0,
        highlightedMessageId: matches[0] ?? null,
      };
    }),

  nextSearchMatch: () =>
    set((state) => {
      if (!state.searchMatches.length) {
        return { highlightedMessageId: null, searchIndex: 0 };
      }

      const nextIndex =
        state.searchIndex + 1 >= state.searchMatches.length
          ? 0
          : state.searchIndex + 1;

      return {
        searchIndex: nextIndex,
        highlightedMessageId: state.searchMatches[nextIndex],
      };
    }),

  prevSearchMatch: () =>
    set((state) => {
      if (!state.searchMatches.length) {
        return { highlightedMessageId: null, searchIndex: 0 };
      }

      const prevIndex =
        state.searchIndex - 1 < 0
          ? state.searchMatches.length - 1
          : state.searchIndex - 1;

      return {
        searchIndex: prevIndex,
        highlightedMessageId: state.searchMatches[prevIndex],
      };
    }),

  openForwardDialog: (messageId) =>
    set(() => ({
      forwardDialogMessageId: messageId,
    })),

  closeForwardDialog: () =>
    set(() => ({
      forwardDialogMessageId: null,
    })),

  forwardMessage: (_messageId, roomId) =>
    set((state) => ({
      forwardDialogMessageId: null,
      toastItems: [
        ...state.toastItems,
        {
          id: crypto.randomUUID(),
          message: `Message forwarded to ${roomId}`,
        },
      ],
    })),

  addToast: (message) =>
    set((state) => ({
      toastItems: [
        ...state.toastItems,
        {
          id: crypto.randomUUID(),
          message,
        },
      ],
    })),

  removeToast: (toastId) =>
    set((state) => ({
      toastItems: state.toastItems.filter((toast) => toast.id !== toastId),
    })),

  highlightMessage: (messageId) => {
    if (highlightTimeout) {
      window.clearTimeout(highlightTimeout);
      highlightTimeout = null;
    }

    set({ highlightedMessageId: messageId });

    highlightTimeout = window.setTimeout(() => {
      set({ highlightedMessageId: null });
      highlightTimeout = null;
    }, 1200);
  },

  clearHighlightedMessage: () => {
    if (highlightTimeout) {
      window.clearTimeout(highlightTimeout);
      highlightTimeout = null;
    }
    set({ highlightedMessageId: null });
  },
}));
