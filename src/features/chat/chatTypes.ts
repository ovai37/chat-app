export type MessageStatus = "sending" | "uploading" | "sent" | "delivered" | "read";

export type ChatReactionState = Record<string, string[]>;

export type ChatAttachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  isImage: boolean;
};

export interface ChatMessageType {
  id: string;
  sender: string;
  message: string;
  time: string;
  createdAt: string;
  isOwn: boolean;
  status: MessageStatus;
  attachments?: ChatAttachment[];
  replyTo?: string;
  edited?: boolean;
  editedAt?: string;
  pinned?: boolean;
  reactions?: ChatReactionState;
  deleted?: boolean;
  uploadProgress?: number;
  isUploading?: boolean;
  forwardedFromRoom?: string;
  forwardedToRoom?: string;
}

export type ToastItem = {
  id: string;
  message: string;
};
