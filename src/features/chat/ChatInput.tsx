import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { Paperclip, SendHorizontal, Smile, X } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useChatStore } from "./chatStore";
import ReplyPreview from "./components/ReplyPreview";
import { ACCEPTED_TYPES, MAX_ATTACHMENT_FILES, MAX_FILE_SIZE } from "./chatConstants";

export default function ChatInput() {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [dropError, setDropError] = useState<string | null>(null);

  const pickerRef = useRef<HTMLDivElement>(null);

  const sendMessage = useChatStore((state) => state.sendMessage);
  const replyToId = useChatStore((state) => state.replyToId);
  const cancelReply = useChatStore((state) => state.cancelReply);
  const editingMessageId = useChatStore((state) => state.editingMessageId);
  const editMessage = useChatStore((state) => state.editMessage);
  const saveEdit = useChatStore((state) => state.saveEdit);
  const draftAttachments = useChatStore((state) => state.draftAttachments);
  const addDraftAttachments = useChatStore((state) => state.addDraftAttachments);
  const removeDraftAttachment = useChatStore((state) => state.removeDraftAttachment);
  const clearDraftAttachments = useChatStore((state) => state.clearDraftAttachments);
  const highlightMessage = useChatStore((state) => state.highlightMessage);
  const messages = useChatStore((state) => state.messages);

  const replyMessage = useMemo(
    () => (replyToId ? messages.find((item) => item.id === replyToId) ?? null : null),
    [messages, replyToId]
  );

  const jumpToReply = useCallback(() => {
    if (!replyToId) return;

    const element = document.getElementById(`message-${replyToId}`);
    if (!element) return;

    element.scrollIntoView({ behavior: "smooth", block: "center" });
    element.animate(
      [
        { boxShadow: "0 0 0 0 rgba(56,189,248,0.75)" },
        { boxShadow: "0 0 0 12px rgba(56,189,248,0)" },
      ],
      {
        duration: 900,
        easing: "ease-out",
      }
    );
  }, [replyToId]);

  const currentEditMessage = useMemo(
    () =>
      editingMessageId
        ? messages.find((item) => item.id === editingMessageId) ?? null
        : null,
    [messages, editingMessageId]
  );

  useEffect(() => {
    if (currentEditMessage) {
      setText(currentEditMessage.message);
    }
  }, [currentEditMessage]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (editingMessageId) {
        setDropError("Finish editing before attaching files.");
        return;
      }

      if (rejectedFiles.length > 0) {
        const rejected = rejectedFiles[0];
        if (rejected.errors.some((error: any) => error.code === "file-too-large")) {
          setDropError("Each file must be 10MB or smaller.");
          return;
        }

        if (rejected.errors.some((error: any) => error.code === "file-invalid-type")) {
          setDropError("Only images, PDF, DOC/DOCX, or ZIP files are allowed.");
          return;
        }

        setDropError("One or more files could not be accepted.");
        return;
      }

      setDropError(null);
      addDraftAttachments(acceptedFiles);
    },
    [addDraftAttachments, editingMessageId]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
    maxFiles: MAX_ATTACHMENT_FILES,
    noClick: true,
    noKeyboard: true,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSend = () => {
    const message = text.trim();

    if (!message && draftAttachments.length === 0) return;

    if (editingMessageId) {
      if (!message) return;
      saveEdit(editingMessageId, message);
      clearDraftAttachments();
      setText("");
      setDropError(null);
      return;
    }

    sendMessage(message, draftAttachments, replyToId);
    setText("");
    setShowEmojiPicker(false);
    setDropError(null);
  };

  const removeFile = (index: number) => {
    removeDraftAttachment(index);
  };

  return (
    <div className="border-t border-slate-800 bg-slate-900 p-4">
      {replyMessage && (
        <ReplyPreview
          original={replyMessage}
          onCancel={cancelReply}
          onJump={() => {
            jumpToReply();
            if (replyToId) {
              highlightMessage(replyToId);
            }
          }}
        />
      )}

      {currentEditMessage && (
        <div className="mb-3 flex items-start justify-between gap-3 rounded-2xl border-l-4 border-amber-400 bg-slate-950 px-4 py-3 text-sm text-slate-200 shadow-sm">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Editing message
            </p>
            <p className="mt-1 truncate text-sm text-white">
              {currentEditMessage.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              editMessage(null);
              setText("");
              setDropError(null);
            }}
            aria-label="Cancel edit"
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`mb-3 relative rounded-3xl bg-slate-900 transition ${
          isDragActive ? "ring-2 ring-blue-500" : ""
        }`}
      >
        <input {...getInputProps()} className="hidden" />
        {isDragActive ? (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-slate-900/90 text-sm text-slate-100">
            Drop files to attach
          </div>
        ) : null}

        {draftAttachments.length > 0 && (
          <div className="mb-3 overflow-x-auto overflow-y-hidden rounded-2xl border border-slate-700 bg-slate-950 px-3 py-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-600/40">
            <div className="flex gap-3 min-w-max">
              {draftAttachments.map((file, index) => (
                <div
                  key={`${file.name}-${file.size}-${index}`}
                  className="flex min-w-[240px] flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-white">{file.name}</p>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || "unknown"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {dropError && <p className="mb-3 text-sm text-red-400">{dropError}</p>}

        <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">
          <div className="relative" ref={pickerRef}>
            <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="text-slate-400 transition hover:text-white"
              aria-label="Toggle emoji picker"
            >
              <Smile size={22} />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-14 left-0 z-50 overflow-hidden rounded-xl border border-slate-700 shadow-2xl">
                <EmojiPicker
                  width={320}
                  height={400}
                  theme={Theme.DARK}
                  lazyLoadEmojis
                  skinTonesDisabled
                  previewConfig={{ showPreview: false }}
                  searchDisabled={false}
                  onEmojiClick={(emojiData) => {
                    setText((prev) => prev + emojiData.emoji);
                    setShowEmojiPicker(false);
                  }}
                />
              </div>
            )}
          </div>

          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
              if (e.key === "Escape") {
                if (editingMessageId) {
                  setText("");
                  editMessage(null);
                  setDropError(null);
                  return;
                }

                cancelReply();
              }
            }}
            placeholder={editingMessageId ? "Edit message..." : "Type a message or attach files..."}
            className="flex-1 bg-transparent text-white outline-none placeholder:text-slate-500"
            aria-label="Chat input"
          />

          <button
            type="button"
            className="text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:text-slate-600"
            onClick={open}
            disabled={Boolean(editingMessageId)}
            aria-label="Add attachment"
          >
            <Paperclip size={22} />
          </button>

          <button
            type="button"
            onClick={handleSend}
            className="rounded-lg bg-blue-600 p-2 transition hover:bg-blue-700"
            aria-label={editingMessageId ? "Save edited message" : "Send message"}
          >
            <SendHorizontal size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
