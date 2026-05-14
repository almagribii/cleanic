"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, Plus, Trash2, MessageCircle, Menu, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface ConversationData extends Conversation {
  messages: Message[];
}

const DEFAULT_CONVERSATION_TITLE = "New Conversation";

const Chatbot: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<ConversationData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationToDelete, setConversationToDelete] =
    useState<Conversation | null>(null);
  const [conversationToEdit, setConversationToEdit] =
    useState<Conversation | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [savingTitle, setSavingTitle] = useState(false);
  const [deletingConversation, setDeletingConversation] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  const getToken = () => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("auth_token") || localStorage.getItem("token")
      );
    }
    return null;
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const deriveConversationTitle = (message: string) => {
    const trimmedMessage = message.trim();
    return trimmedMessage.length > 50
      ? `${trimmedMessage.slice(0, 50)}...`
      : trimmedMessage;
  };

  const updateConversationInState = (
    conversationId: string,
    updates: Partial<Conversation>,
  ) => {
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, ...updates }
          : conversation,
      ),
    );

    setCurrentConversation((prev) =>
      prev && prev.id === conversationId ? { ...prev, ...updates } : prev,
    );
  };

  // Define loadConversation BEFORE using it in useEffect
  const loadConversation = async (conversation: Conversation) => {
    try {
      const token = getToken();
      const response = await axios.get(
        `${API_URL}/chatbot/conversations/${conversation.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCurrentConversation(response.data.data);
      setMessages(response.data.data.messages || []);
      setMobileSidebarOpen(false);
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const createNewConversation = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.warn("No auth token found for chatbot");
        return;
      }

      const response = await axios.post(
        `${API_URL}/chatbot/conversations`,
        { title: DEFAULT_CONVERSATION_TITLE },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const newConversation = response.data.data;
      setConversations([newConversation, ...conversations]);
      await loadConversation(newConversation);
      setMobileSidebarOpen(false);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.warn("No auth token found for chatbot");
          return;
        }

        const response = await axios.get(`${API_URL}/chatbot/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const loadedConversations = response.data.data || [];
        setConversations(loadedConversations);

        if (loadedConversations.length > 0) {
          if (!currentConversation) {
            await loadConversation(loadedConversations[0]);
          }
        } else {
          await createNewConversation();
        }
      } catch (error) {
        console.error("Error loading conversations:", error);
      }
    };
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !currentConversation) return;

    const userMessage = inputValue;
    setInputValue("");
    setLoading(true);

    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "USER",
      content: userMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const token = getToken();
      const response = await axios.post(
        `${API_URL}/chatbot/send-message`,
        {
          conversationId: currentConversation.id,
          message: userMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        const assistantMessage: Message = {
          id: `temp-${Date.now()}-assistant`,
          role: "ASSISTANT",
          content: response.data.data.assistantMessage.content,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        if (
          !currentConversation?.title ||
          currentConversation.title === DEFAULT_CONVERSATION_TITLE
        ) {
          const derivedTitle = deriveConversationTitle(userMessage);
          if (derivedTitle) {
            updateConversationInState(currentConversation.id, {
              title: derivedTitle,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !loading &&
      inputValue.trim() &&
      currentConversation
    ) {
      e.preventDefault();
      sendMessage(e as unknown as React.FormEvent);
    }
  };

  const openDeleteModal = (conversation: Conversation) => {
    setConversationToDelete(conversation);
  };

  const openEditModal = (conversation: Conversation) => {
    setConversationToEdit(conversation);
    setEditTitle(conversation.title || "");
  };

  const saveConversationTitle = async () => {
    if (!conversationToEdit) return;

    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) return;

    try {
      setSavingTitle(true);
      const token = getToken();
      if (!token) return;

      const response = await axios.post(
        `${API_URL}/chatbot/conversations/${conversationToEdit.id}/title`,
        { title: trimmedTitle },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const updatedConversation = response.data.data as Conversation;
      updateConversationInState(conversationToEdit.id, updatedConversation);
      setConversationToEdit(null);
      setEditTitle("");
    } catch (error) {
      console.error("Error updating conversation title:", error);
    } finally {
      setSavingTitle(false);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      setDeletingConversation(true);
      const token = getToken();
      if (!token) return;

      await axios.delete(`${API_URL}/chatbot/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(conversations.filter((c) => c.id !== conversationId));
      if (currentConversation?.id === conversationId) {
        if (conversations.length > 1) {
          loadConversation(conversations[0]);
        } else {
          createNewConversation();
        }
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    } finally {
      setDeletingConversation(false);
      setConversationToDelete(null);
    }
  };

  return (
    <div className="relative flex h-full min-h-0 overflow-hidden rounded-2xl bg-[#fafafa]">
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close conversation list"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
        />
      )}

      {/* Sidebar - Conversations */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-80 max-w-[85vw] -translate-x-full flex-col overflow-hidden border-r border-slate-200 bg-white shadow-2xl transition-transform duration-200 lg:relative lg:z-auto lg:w-72 lg:max-w-none lg:translate-x-0 lg:rounded-l-2xl lg:shadow-none ${
          mobileSidebarOpen ? "translate-x-0" : ""
        }`}
      >
        {/* Header */}
        <div className="border-b border-slate-100 bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-3 lg:block">
            <h2 className="text-sm font-semibold text-slate-900">
              Conversations
            </h2>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 lg:hidden"
              aria-label="Close conversation list"
            >
              <X size={18} />
            </button>
          </div>
          <button
            onClick={createNewConversation}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#10b981] to-[#059669] px-3 py-2 text-sm font-medium text-white transition-all hover:shadow-md"
          >
            <Plus size={16} />
            New Chat
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 space-y-2 overflow-y-auto p-3 pb-24 lg:pb-3">
          {conversations.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-500">
              No conversations yet
            </p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group flex cursor-pointer items-center justify-between rounded-lg p-3 transition-all ${
                  currentConversation?.id === conv.id
                    ? "border border-[#10b981]/30 bg-[#10b981]/10"
                    : "border border-transparent hover:bg-slate-50"
                }`}
                onClick={() => loadConversation(conv)}
              >
                <span
                  className={`truncate pr-2 text-sm ${
                    currentConversation?.id === conv.id
                      ? "font-medium text-[#10b981]"
                      : "text-slate-700"
                  }`}
                >
                  {conv.title}
                </span>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(conv);
                    }}
                    className="rounded p-1 transition-colors hover:bg-slate-100 lg:opacity-0 lg:group-hover:opacity-100"
                    aria-label="Edit conversation title"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-500"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(conv);
                    }}
                    className="rounded p-1 transition-colors hover:bg-red-100 lg:opacity-0 lg:group-hover:opacity-100"
                    aria-label="Delete conversation"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white lg:ml-4">
        {/* Chat Header */}
        <div className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-50 lg:hidden"
                aria-label="Open conversation list"
              >
                <Menu size={18} />
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-sm font-semibold text-slate-900 md:text-base">
                  {currentConversation?.title || "Chatbot"}
                </h1>
                <p className="mt-0.5 truncate text-[11px] text-slate-500 md:text-xs">
                  Powered by Gemini 2.5 Pro
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={createNewConversation}
              className="hidden items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 lg:inline-flex"
            >
              <Plus size={14} />
              New Chat
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
          {messages.length === 0 && (
            <div className="flex min-h-[calc(100vh-20rem)] flex-col items-center justify-center text-center">
              <MessageCircle size={48} className="mb-4 text-slate-300" />
              <h3 className="mb-2 text-lg font-semibold text-slate-600">
                Start a Conversation
              </h3>
              <p className="max-w-xs text-sm text-slate-500">
                Saya hanya menjawab edukasi lingkungan: sampah, daur ulang, 3R,
                hemat air, hemat energi, dan kebersihan lingkungan.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2 px-2">
                {[
                  "Cara memilah sampah rumah",
                  "Apa itu kompos?",
                  "Tips hemat air",
                  "Contoh 3R",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setInputValue(suggestion)}
                    className="rounded-full border border-[#10b981]/20 bg-[#10b981]/5 px-3 py-1.5 text-xs font-medium text-[#0f766e] transition-colors hover:bg-[#10b981]/10"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 sm:max-w-md ${
                  msg.role === "USER"
                    ? "rounded-br-none bg-[#10b981] text-white"
                    : "rounded-bl-none border border-slate-200 bg-slate-100 text-slate-900"
                }`}
              >
                <div className="text-sm leading-relaxed wrap-break-word">
                  {msg.role === "ASSISTANT" ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-1">{children}</p>,
                        ul: ({ children }) => (
                          <ul className="mb-2 ml-2 list-inside list-disc">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="mb-2 ml-2 list-inside list-decimal">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="mb-0.5">{children}</li>
                        ),
                        code: ({ children, ...props }) => {
                          const propsClassName = String(
                            (props as Record<string, unknown>)?.className || "",
                          );
                          const isBlock = propsClassName.includes("language-");
                          return isBlock ? (
                            <pre className="my-1 overflow-x-auto rounded bg-slate-800 p-2 text-xs text-slate-100">
                              <code>{children}</code>
                            </pre>
                          ) : (
                            <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-slate-100">
                              {children}
                            </code>
                          );
                        },
                        strong: ({ children }) => (
                          <strong className="font-bold">{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic">{children}</em>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-xl rounded-bl-none border border-slate-200 bg-slate-100 px-4 py-3">
                <div className="flex gap-1.5">
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-[#10b981]"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-[#10b981]"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-[#10b981]"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={sendMessage}
          className="border-t border-slate-100 bg-white p-3 md:p-4"
        >
          <div className="flex items-end gap-2 md:gap-3">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading || !currentConversation}
              placeholder={
                currentConversation
                  ? "Type your message..."
                  : "Create or select a conversation first"
              }
              rows={1}
              className="min-h-12 flex-1 resize-none rounded-lg border border-slate-200 px-3 py-3 text-sm focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/50 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500 md:px-4"
              style={{ maxHeight: "120px" }}
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim() || !currentConversation}
              className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-r from-[#10b981] to-[#059669] p-0 text-sm font-medium text-white transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 md:w-auto md:px-4"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>

      {conversationToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">
              Edit conversation title
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Rename this chat so it matches the topic you discussed.
            </p>
            <input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="mt-4 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 focus:outline-none"
              placeholder="Conversation title"
            />
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setConversationToEdit(null);
                  setEditTitle("");
                }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveConversationTitle}
                disabled={savingTitle || !editTitle.trim()}
                className="rounded-lg bg-linear-to-r from-[#10b981] to-[#059669] px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingTitle ? "Saving..." : "Save title"}
              </button>
            </div>
          </div>
        </div>
      )}

      {conversationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">
              Delete conversation?
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              This will remove &quot;{conversationToDelete.title}&quot; and all
              of its messages.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConversationToDelete(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteConversation(conversationToDelete.id)}
                disabled={deletingConversation}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingConversation ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
