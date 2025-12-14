import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { supportAPI } from "../../api";

const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [conversationToken, setConversationToken] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // Guest form state
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [showGuestForm, setShowGuestForm] = useState(true);

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const cartItems = useSelector((state) => state.cart.items);

  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Mark messages as read when chat is open
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setHasUnread(false);
    }
  }, [isOpen, isMinimized]);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Load saved conversation from localStorage
  useEffect(() => {
    const savedConversationId = localStorage.getItem("support_conversation_id");
    const savedToken = localStorage.getItem("support_conversation_token");

    if (savedConversationId) {
      loadExistingConversation(savedConversationId, savedToken);
    }
  }, []);

  const loadExistingConversation = async (conversationId, token) => {
    try {
      const data = await supportAPI.getConversation(conversationId, token);
      if (data && data.status !== "closed") {
        setConversation(data);
        setConversationToken(token);
        setShowGuestForm(false);
        connectWebSocket(conversationId, token);
      } else {
        // Clear saved conversation if closed
        localStorage.removeItem("support_conversation_id");
        localStorage.removeItem("support_conversation_token");
      }
    } catch (err) {
      console.error("Error loading existing conversation:", err);
      localStorage.removeItem("support_conversation_id");
      localStorage.removeItem("support_conversation_token");
    }
  };

  const connectWebSocket = useCallback((conversationId, token) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const wsUrl = supportAPI.getWebSocketUrl(conversationId, token);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Customer WebSocket connected");
      setIsConnecting(false);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "history") {
        setMessages(data.messages || []);
      } else if (data.type === "message") {
        setMessages((prev) => [...prev, data.payload]);
        setIsTyping(false);
        // Show unread indicator if minimized or closed
        if (isMinimized || !isOpen) {
          setHasUnread(true);
        }
      } else if (data.type === "typing" && data.from === "agent") {
        setIsTyping(true);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setIsConnecting(false);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    wsRef.current = ws;
  }, [isMinimized, isOpen]);

  const startConversation = async (e) => {
    e.preventDefault();
    setIsConnecting(true);

    try {
      // Prepare cart items for context
      const cartContext = cartItems.map((item) => ({
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        category: item.category,
      }));

      const response = await supportAPI.startConversation({
        guest_name: isAuthenticated ? null : guestName,
        guest_email: isAuthenticated ? null : guestEmail,
        initial_message: initialMessage,
        cart_items: cartContext,
      });

      setConversation(response);
      setConversationToken(response.conversation_token);
      setShowGuestForm(false);

      // Save to localStorage for persistence
      localStorage.setItem("support_conversation_id", response.id);
      if (response.conversation_token) {
        localStorage.setItem("support_conversation_token", response.conversation_token);
      }

      // Connect WebSocket
      connectWebSocket(response.id, response.conversation_token);
    } catch (err) {
      console.error("Error starting conversation:", err);
      setIsConnecting(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !wsRef.current) return;

    const message = messageInput.trim();
    setMessageInput("");

    wsRef.current.send(
      JSON.stringify({
        action: "send_message",
        body: message,
      })
    );
  };

  const handleTyping = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: "typing" }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !conversation) return;

    try {
      await supportAPI.uploadAttachment(conversation.id, file, conversationToken);
    } catch (err) {
      console.error("Error uploading file:", err);
    }

    e.target.value = "";
  };

  const endChat = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setConversation(null);
    setConversationToken(null);
    setMessages([]);
    setShowGuestForm(true);
    setInitialMessage("");
    localStorage.removeItem("support_conversation_id");
    localStorage.removeItem("support_conversation_token");
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    } else {
      setIsMinimized(!isMinimized);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div
          className={`bg-white rounded-3xl shadow-2xl border border-sand/30 overflow-y-scroll no-scrollbar transition-all duration-300 ${isMinimized
            ? "w-72 h-14"
            : "w-96 h-[32rem]"
            }`}
          style={{
            animation: "scale-in 0.3s ease-out",
          }}
        >
          {/* Header */}
          <div
            onClick={() => isMinimized && setIsMinimized(false)}
            className={`bg-gradient-to-r from-sand to-sage px-5 py-4 flex items-center justify-between ${isMinimized ? "cursor-pointer hover:opacity-90" : ""
              }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Live Support</h3>
                <p className="text-white/80 text-xs">
                  {conversation ? "We're here to help" : "Start a conversation"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeChat();
                }}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          {!isMinimized && (
            <div className="flex flex-col h-[calc(100%-4rem)]">
              {showGuestForm && !conversation ? (
                /* Guest Form / Start Chat */
                <form onSubmit={startConversation} className="flex-1 p-5 flex flex-col">
                  <div className="text-center mb-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-sand/20 to-sage/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-sand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">How can we help?</h4>
                    <p className="text-gray-500 text-sm mt-1">Start a conversation with our support team</p>
                  </div>

                  <div className="space-y-3 flex-1">
                    {!isAuthenticated && (
                      <>
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Your name"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-sand focus:outline-none transition-colors text-sm"
                          required
                        />
                        <input
                          type="email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="Email address"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-sand focus:outline-none transition-colors text-sm"
                          required
                        />
                      </>
                    )}
                    <textarea
                      value={initialMessage}
                      onChange={(e) => setInitialMessage(e.target.value)}
                      placeholder="How can we help you today?"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-sand focus:outline-none transition-colors text-sm resize-none flex-1 min-h-[100px]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isConnecting}
                    className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-sand to-sage text-white font-bold text-sm hover:shadow-lg transition-all duration-300 active:scale-98 disabled:opacity-50"
                  >
                    {isConnecting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Connecting...
                      </span>
                    ) : (
                      "Start Chat"
                    )}
                  </button>
                </form>
              ) : (
                /* Chat Messages */
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-sm">Waiting for support...</p>
                        <p className="text-xs mt-1">We'll respond shortly</p>
                      </div>
                    ) : (
                      <>
                        {messages.map((message) => {
                          const isCustomer = message.sender_role === "customer";
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${isCustomer
                                  ? "bg-gradient-to-r from-sand to-sage text-white"
                                  : "bg-white text-gray-900 shadow-sm border border-gray-100"
                                  }`}
                              >
                                {message.body && (
                                  <p className="text-sm whitespace-pre-wrap">{message.body}</p>
                                )}
                                {message.attachment && (
                                  <div className={`text-xs mt-1 ${isCustomer ? "text-white/80" : "text-gray-500"}`}>
                                    📎 {message.attachment.filename}
                                  </div>
                                )}
                                <p className={`text-xs mt-1.5 ${isCustomer ? "text-white/70" : "text-gray-400"}`}>
                                  {formatTime(message.created_at)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="bg-white rounded-2xl px-4 py-2.5 shadow-sm border border-gray-100">
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t border-gray-100 bg-white">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                      <label className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="hidden"
                          accept="image/*,video/*,application/pdf"
                        />
                      </label>

                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => {
                          setMessageInput(e.target.value);
                          handleTyping();
                        }}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-gray-100 focus:border-sand focus:outline-none transition-colors text-sm"
                      />

                      <button
                        type="submit"
                        disabled={!messageInput.trim()}
                        className="p-2.5 rounded-xl bg-gradient-to-r from-sand to-sage text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </form>

                    {/* End Chat Button */}
                    <button
                      onClick={endChat}
                      className="w-full mt-3 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      End conversation
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Chat Trigger Button */}
      {!isOpen &&
        <button
          onClick={toggleChat}
          className="relative w-16 h-16 bg-gradient-to-br from-sand to-sage rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center group"
        >
          {isOpen ? (
            <svg className="w-7 h-7 text-white transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg className="w-7 h-7 text-white transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}

          {/* Unread Badge */}
          {hasUnread && !isOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
              !
            </span>
          )}

          {/* Pulse Animation */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-sand/50 animate-ping opacity-75" />
          )}
        </button>
      }
    </div>
  );
};

export default LiveChatWidget;
