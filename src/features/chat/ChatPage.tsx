import { useEffect, useMemo, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import SearchBar from "./components/SearchBar";
import PinnedPanel from "./components/PinnedPanel";
import ForwardDialog from "./components/ForwardDialog";

import { useNotificationStore } from "../../stores/notificationStore";
import { useChatStore } from "./chatStore";
import type { ChatMessageType } from "./chatTypes";

export default function ChatPage() {
  const clear = useNotificationStore((state) => state.clear);
  const messages = useChatStore((state) => state.messages);
  const searchQuery = useChatStore((state) => state.searchQuery);
  const searchMatches = useChatStore((state) => state.searchMatches);
  const searchIndex = useChatStore((state) => state.searchIndex);
  const isPinnedPanelOpen = useChatStore((state) => state.isPinnedPanelOpen);
  const forwardDialogMessageId = useChatStore((state) => state.forwardDialogMessageId);
  const selectedMessageIds = useChatStore((state) => state.selectedMessageIds);

  const togglePinnedPanel = useChatStore((state) => state.togglePinnedPanel);
  const searchMessages = useChatStore((state) => state.searchMessages);
  const nextSearchMatch = useChatStore((state) => state.nextSearchMatch);
  const prevSearchMatch = useChatStore((state) => state.prevSearchMatch);
  const openForwardDialog = useChatStore((state) => state.openForwardDialog);
  const closeForwardDialog = useChatStore((state) => state.closeForwardDialog);
  const forwardMessage = useChatStore((state) => state.forwardMessage);
  const highlightMessage = useChatStore((state) => state.highlightMessage);
  const replyToMessage = useChatStore((state) => state.replyToMessage);
  const editMessage = useChatStore((state) => state.editMessage);
  const copyMessage = useChatStore((state) => state.copyMessage);
  const pinMessage = useChatStore((state) => state.pinMessage);
  const unpinMessage = useChatStore((state) => state.unpinMessage);
  const deleteMessage = useChatStore((state) => state.deleteMessage);
  const toggleMessageSelection = useChatStore((state) => state.toggleMessageSelection);
  const clearSelectedMessages = useChatStore((state) => state.clearSelectedMessages);
  const deleteSelectedMessages = useChatStore((state) => state.deleteSelectedMessages);
  const highlightedMessageId = useChatStore((state) => state.highlightedMessageId);

  const [showSearch, setShowSearch] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  const groupedMessages = useMemo(() => {
    const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups: { dateKey: string; label: string; messages: ChatMessageType[] }[] = [];

    messages.forEach((message) => {
      const createdAt = new Date(message.createdAt);
      const dateKey = createdAt.toISOString().slice(0, 10);
      const existingGroup = groups.find((group) => group.dateKey === dateKey);
      const label = isSameDay(createdAt, today)
        ? "Today"
        : isSameDay(createdAt, yesterday)
        ? "Yesterday"
        : createdAt.toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year: createdAt.getFullYear() === today.getFullYear() ? undefined : "numeric",
          });

      if (existingGroup) {
        existingGroup.messages.push(message);
      } else {
        groups.push({ dateKey, label, messages: [message] });
      }
    });

    return groups;
  }, [messages]);

  useEffect(() => {
    clear("chat");
  }, [clear]);

  useEffect(() => {
    const lastMessageId = messages[messages.length - 1]?.id ?? null;
    if (lastMessageId !== lastMessageIdRef.current) {
      lastMessageIdRef.current = lastMessageId;
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  const clearHighlightedMessage = useChatStore((state) => state.clearHighlightedMessage);

  useEffect(() => {
    if (!highlightedMessageId) return;
    const element = document.getElementById(`message-${highlightedMessageId}`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });

    const timer = window.setTimeout(() => {
      clearHighlightedMessage();
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [highlightedMessageId, clearHighlightedMessage]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-slate-900">
      <ChatHeader
        onSearchToggle={() => setShowSearch((prev) => !prev)}
        onToggleSelectionMode={() => {
          setSelectionMode((prev) => {
            if (prev) {
              clearSelectedMessages();
            }
            return !prev;
          });
        }}
        onDeleteSelected={() => {
          deleteSelectedMessages();
          setSelectionMode(false);
        }}
        onClearSearch={() => {
          searchMessages("");
          setShowSearch(false);
        }}
        selectedCount={selectedMessageIds.length}
        searchActive={Boolean(searchQuery)}
      />

      {(showSearch || searchQuery) && (
        <SearchBar
          value={searchQuery}
          onChange={(value) => {
            searchMessages(value);
            setShowSearch(true);
          }}
          onClear={() => {
            searchMessages("");
            setShowSearch(false);
          }}
          onPrev={prevSearchMatch}
          onNext={nextSearchMatch}
          matchIndex={searchIndex}
          matchCount={searchMatches.length}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6">
          <PinnedPanel
            messages={messages.filter((message) => message.pinned)}
            isOpen={isPinnedPanelOpen}
            onToggle={togglePinnedPanel}
            onSelect={(messageId) => highlightMessage(messageId)}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {groupedMessages.map((group) => (
            <div key={group.dateKey}>
              <div className="mb-4 flex justify-center">
                <span className="rounded-full bg-slate-800 px-4 py-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                  {group.label}
                </span>
              </div>
              <div className="space-y-4">
                {group.messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    id={msg.id}
                    sender={msg.sender}
                    message={msg.message}
                    time={msg.time}
                    isOwn={msg.isOwn}
                    status={msg.status}
                    attachments={msg.attachments}
                    replyTo={
                      msg.replyTo ? messages.find((m) => m.id === msg.replyTo) : undefined
                    }
                    pinned={msg.pinned}
                    edited={msg.edited}
                    highlighted={msg.id === highlightedMessageId}
                    isUploading={msg.isUploading}
                    uploadProgress={msg.uploadProgress}
                    searchQuery={searchQuery}
                    selectionMode={selectionMode}
                    selected={selectedMessageIds.includes(msg.id)}
                    onToggleSelect={() => toggleMessageSelection(msg.id)}
                    onReply={() => replyToMessage(msg.id)}
                    onEdit={() => editMessage(msg.id)}
                    onCopy={() => copyMessage(msg.id)}
                    onPinToggle={() =>
                      msg.pinned ? unpinMessage(msg.id) : pinMessage(msg.id)
                    }
                    onForward={() => openForwardDialog(msg.id)}
                    onDelete={() => deleteMessage(msg.id)}
                  />
                ))}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>
      </div>

      <ForwardDialog
        open={Boolean(forwardDialogMessageId)}
        messageId={forwardDialogMessageId}
        onClose={closeForwardDialog}
        onForward={forwardMessage}
      />

      <ChatInput />
    </div>
  );
}
