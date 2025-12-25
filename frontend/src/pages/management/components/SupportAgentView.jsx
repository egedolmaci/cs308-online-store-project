import { useState, useEffect, useRef, useCallback } from "react";
import { supportAPI } from "../../../api";

const SupportAgentView = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoadingQueue, setIsLoadingQueue] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [showContextPanel, setShowContextPanel] = useState(true);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const wsRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const shouldAutoScroll = useRef(true);

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Check if user is near bottom (within 100px)
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    shouldAutoScroll.current = isNearBottom;
  }, []);

  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const loadQueue = async () => {
    setIsLoadingQueue(true);
    try {
      const data = await supportAPI.fetchQueue();
      setConversations(data.conversations || []);
      setError(null);
    } catch (err) {
      console.error("Error loading queue:", err);
      setError("Failed to load conversations");
    } finally {
      setIsLoadingQueue(false);
    }
  };

  const connectWebSocket = useCallback((conversationId) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const wsUrl = supportAPI.getWebSocketUrl(conversationId);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsLoadingMessages(false);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "history") {
        setMessages(data.messages || []);
        // Update conversation with context_snapshot if provided
        if (data.context_snapshot) {
          setActiveConversation((prev) => ({
            ...prev,
            context_snapshot: data.context_snapshot,
          }));
        }
      } else if (data.type === "message") {
        setMessages((prev) => [...prev, data.payload]);
        setIsTyping(false);
      } else if (data.type === "typing" && data.from === "customer") {
        setIsTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
      } else if (data.type === "conversation_closed") {
        // Handle conversation close event
        setActiveConversation((prev) => ({
          ...prev,
          status: "closed",
          closed_at: data.closed_at,
          resolution_notes: data.resolution_notes,
        }));
        // Add system message to chat
        const systemMessage = {
          id: `system-${Date.now()}`,
          body: `This conversation has been closed by ${data.closed_by === "agent" ? "an agent" : "the customer"}.`,
          sender_role: "system",
          created_at: data.closed_at,
        };
        setMessages((prev) => [...prev, systemMessage]);
      }
    };

    ws.onerror = () => setIsLoadingMessages(false);
    wsRef.current = ws;
  }, []);

  const handleSelectConversation = async (conv) => {
    setActiveConversation(conv);
    setMessages([]);
    setIsLoadingMessages(true);

    try {
      if (!conv.assigned_agent_id) {
        const claimed = await supportAPI.claimConversation(conv.id);
        setActiveConversation(claimed);
        loadQueue();
      }
      connectWebSocket(conv.id);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to open conversation");
      setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !wsRef.current) return;

    setIsSending(true);
    wsRef.current.send(JSON.stringify({ action: "send_message", body: messageInput.trim() }));
    setMessageInput("");
    setIsSending(false);
  };

  const handleTyping = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: "typing" }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeConversation) return;
    try {
      await supportAPI.uploadAttachment(activeConversation.id, file);
    } catch {
      setError("Failed to upload file");
    }
    e.target.value = "";
  };

  const handleCloseConversation = async () => {
    if (!activeConversation) return;
    try {
      await supportAPI.closeConversation(activeConversation.id, resolutionNotes);
      setShowCloseModal(false);
      setResolutionNotes("");
      setActiveConversation(null);
      setMessages([]);
      wsRef.current?.close();
      loadQueue();
    } catch {
      setError("Failed to close conversation");
    }
  };

  const formatTime = (ts) => new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const formatDate = (ts) => {
    const d = new Date(ts);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getCustomerName = (conv) => conv.guest_name || (conv.customer_id ? "Customer" : "Guest");

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col gap-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-sand to-sage rounded-2xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Support Center</h1>
            <p className="text-sm text-gray-500">
              {conversations.length} active conversation{conversations.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <button
          onClick={loadQueue}
          disabled={isLoadingQueue}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors flex items-center gap-2"
        >
          <svg className={`w-4 h-4 ${isLoadingQueue ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between">
          <span className="text-sm">{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Sidebar - Conversations */}
        <div className="w-72 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-sand/50 focus:bg-white transition-all"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoadingQueue && conversations.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-sand rounded-full animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-sm">No conversations</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {conversations.map((conv) => {
                  const isActive = activeConversation?.id === conv.id;
                  const isNew = !conv.assigned_agent_id;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      className={`w-full p-3 rounded-xl text-left transition-all ${isActive
                        ? "bg-gradient-to-r from-sand/20 to-sage/20 border-l-4 border-sand"
                        : isNew
                          ? "bg-amber-50 hover:bg-amber-100 border-l-4 border-amber-400"
                          : "hover:bg-gray-50 border-l-4 border-transparent"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900 text-sm truncate">
                          {getCustomerName(conv)}
                        </span>
                        {isNew && (
                          <span className="px-2 py-0.5 bg-amber-400 text-white text-xs font-bold rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 truncate max-w-[140px]">
                          {conv.guest_email || `#${conv.id.slice(0, 8)}`}
                        </span>
                        {conv.last_message_at && (
                          <span className="text-xs text-gray-400">{formatDate(conv.last_message_at)}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-w-0">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{getCustomerName(activeConversation)}</h3>
                    <p className="text-xs text-gray-500">
                      {activeConversation.guest_email || (activeConversation.customer_id ? "Registered User" : "Guest")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowContextPanel(!showContextPanel)}
                    className={`p-2 rounded-lg transition-colors ${showContextPanel ? "bg-sand/20 text-sand" : "hover:bg-gray-100 text-gray-500"}`}
                    title="Toggle customer info"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  {activeConversation.status !== "closed" && (
                    <button
                      onClick={() => setShowCloseModal(true)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors"
                    >
                      Close Chat
                    </button>
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 flex min-h-0">
                {/* Messages */}
                <div
                  ref={messagesContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto p-6 space-y-4 bg-linear-to-b from-gray-50/50 to-white"
                >
                  {isLoadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-8 h-8 border-2 border-gray-200 border-t-sand rounded-full animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="text-sm font-medium">No messages yet</p>
                      <p className="text-xs">Start the conversation!</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg) => {
                        const isAgent = msg.sender_role === "agent";
                        const isSystem = msg.sender_role === "system";

                        // System messages (centered, gray)
                        if (isSystem) {
                          return (
                            <div key={msg.id} className="flex justify-center my-3">
                              <div className="bg-gray-100 text-gray-600 rounded-full px-4 py-1.5 text-xs">
                                {msg.body}
                              </div>
                            </div>
                          );
                        }

                        // Regular agent/customer messages
                        return (
                          <div key={msg.id} className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-[65%] px-4 py-3 rounded-2xl ${isAgent
                                ? "bg-linear-to-r from-sand to-sage text-white rounded-br-md"
                                : "bg-white border border-gray-200 text-gray-900 rounded-bl-md shadow-sm"
                                }`}
                            >
                              {msg.body && <p className="text-sm whitespace-pre-wrap">{msg.body}</p>}
                              {msg.attachment && (
                                <p className={`text-xs mt-1 ${isAgent ? "text-white/70" : "text-gray-500"}`}>
                                  📎 {msg.attachment.filename}
                                </p>
                              )}
                              <p className={`text-xs mt-2 ${isAgent ? "text-white/60" : "text-gray-400"}`}>
                                {formatTime(msg.created_at)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Context Panel */}
                {showContextPanel && (
                  <div className="w-64 border-l border-gray-100 p-4 overflow-y-auto bg-gray-50/50">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Customer Info
                    </h4>

                    {activeConversation.context_snapshot ? (
                      <div className="space-y-4">
                        {/* Cart */}
                        {activeConversation.context_snapshot.cart_items?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Cart</p>
                            {activeConversation.context_snapshot.cart_items.map((item, i) => (
                              <div key={i} className="bg-white rounded-lg p-2 mb-1 border border-gray-100">
                                <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity} · ${item.price}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Orders */}
                        {activeConversation.context_snapshot.orders_summary?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Recent Orders</p>
                            {activeConversation.context_snapshot.orders_summary.map((order, i) => (
                              <div key={i} className="bg-white rounded-lg p-2 mb-1 border border-gray-100">
                                <div className="flex justify-between items-center">
                                  <p className="text-xs font-medium text-gray-900 truncate">Order #{order.id}</p>
                                  <span className={`text-xs px-1.5 py-0.5 rounded ${order.status === "delivered" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                                    {order.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Wishlist */}
                        {activeConversation.context_snapshot.wish_list_items?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Wishlist</p>
                            {activeConversation.context_snapshot.wish_list_items.map((item, i) => (
                              <div key={i} className="bg-white rounded-lg p-2 mb-1 border border-gray-100">
                                <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
                                <p className="text-xs text-gray-500">${item.price}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {!activeConversation.context_snapshot.cart_items?.length &&
                          !activeConversation.context_snapshot.orders_summary?.length &&
                          !activeConversation.context_snapshot.wish_list_items?.length && (
                            <p className="text-xs text-gray-400 text-center py-4">No context data</p>
                          )}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">
                          {activeConversation.customer_id ? "Registered User" : "Guest User"}
                        </p>
                        {activeConversation.guest_email && (
                          <p className="text-xs text-gray-400 mt-1">{activeConversation.guest_email}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Input Area */}
              {activeConversation.status !== "closed" ? (
                <div className="px-6 py-4 border-t border-gray-100">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <label className="p-2.5 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors text-gray-500 hover:text-gray-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*,video/*,application/pdf" />
                    </label>
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => {
                        setMessageInput(e.target.value);
                        handleTyping();
                      }}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-sand/50 focus:bg-white transition-all"
                    />
                    <button
                      type="submit"
                      disabled={isSending || !messageInput.trim()}
                      className="p-2.5 bg-gradient-to-r from-sand to-sage text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </form>
                </div>
              ) : (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-3 text-gray-600">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">This conversation has been closed</span>
                  </div>
                  {activeConversation.resolution_notes && (
                    <p className="text-xs text-gray-500 mt-2 ml-8">
                      Resolution: {activeConversation.resolution_notes}
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Select a conversation</h3>
                <p className="text-sm text-gray-500">Choose from the sidebar to start helping customers</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Close Conversation</h3>
            <p className="text-sm text-gray-500 mb-4">Add resolution notes for this conversation.</p>
            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="How was this issue resolved?"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sand/50 focus:border-sand resize-none"
              rows={3}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => { setShowCloseModal(false); setResolutionNotes(""); }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCloseConversation}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
              >
                Close Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportAgentView;
