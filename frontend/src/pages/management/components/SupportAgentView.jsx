import { useState, useEffect, useRef } from "react";
import {
  fetchActiveChats,
  claimChat,
  fetchChatMessages,
  sendChatMessage,
  fetchCustomerContext,
  uploadFile,
} from "../../../api/mockAdminService";

const SupportAgentView = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [customerContext, setCustomerContext] = useState(null);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Load chats on mount
  useEffect(() => {
    loadChats();
    // Simulate real-time updates every 10 seconds
    const interval = setInterval(loadChats, 10000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChats = async () => {
    setIsLoadingChats(true);
    try {
      const data = await fetchActiveChats();
      setChats(data);
    } catch (error) {
      console.error("Error loading chats:", error);
    } finally {
      setIsLoadingChats(false);
    }
  };

  const handleClaimChat = async (chat) => {
    try {
      await claimChat(chat.id, "AGENT-001");
      await loadChats();
      setActiveChat(chat);
      await loadChatMessages(chat.id);
      if (chat.isLinkedUser) {
        await loadCustomerContext(chat.customerId);
      }
    } catch (error) {
      alert("Error claiming chat");
    }
  };

  const handleSelectChat = async (chat) => {
    setActiveChat(chat);
    await loadChatMessages(chat.id);
    if (chat.isLinkedUser) {
      await loadCustomerContext(chat.customerId);
    } else {
      setCustomerContext(null);
    }
  };

  const loadChatMessages = async (chatId) => {
    setIsLoadingMessages(true);
    try {
      const data = await fetchChatMessages(chatId);
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const loadCustomerContext = async (customerId) => {
    setIsLoadingContext(true);
    try {
      const data = await fetchCustomerContext(customerId);
      setCustomerContext(data);
    } catch (error) {
      console.error("Error loading customer context:", error);
    } finally {
      setIsLoadingContext(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat) return;

    setIsSending(true);
    try {
      const newMessage = await sendChatMessage(activeChat.id, messageInput);
      setMessages([...messages, newMessage.message]);
      setMessageInput("");
    } catch (error) {
      alert("Error sending message");
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await uploadFile(file);
      const fileMessage = await sendChatMessage(
        activeChat.id,
        `📎 File attached: ${file.name}`
      );
      setMessages([...messages, fileMessage.message]);
    } catch (error) {
      alert("Error uploading file");
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Support Chat Interface
        </h2>
        <p className="text-gray-600">
          Manage customer conversations and view their context
        </p>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Queue (Left Sidebar) */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-lg border border-sand/20 max-h-[calc(100vh-16rem)] overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Active Chats ({chats.length})
          </h3>

          {isLoadingChats ? (
            <p className="text-center text-gray-500 py-4">Loading...</p>
          ) : chats.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No active chats</p>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() =>
                    chat.status === "active"
                      ? handleSelectChat(chat)
                      : handleClaimChat(chat)
                  }
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    activeChat?.id === chat.id
                      ? "border-sand bg-sand/10"
                      : chat.status === "waiting"
                      ? "border-warning/30 bg-warning/5 hover:border-warning"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900 text-sm">
                      {chat.customerName}
                    </h4>
                    {chat.unreadCount > 0 && (
                      <span className="px-2 py-1 rounded-full bg-error text-white text-xs font-bold">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-2 truncate">
                    {chat.lastMessage}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      {formatTime(chat.lastMessageTime)}
                    </span>
                    {chat.status === "waiting" ? (
                      <span className="px-2 py-1 rounded-full bg-warning/20 text-warning text-xs font-semibold">
                        Claim
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full bg-success-light text-success text-xs font-semibold">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area (Center) */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-sand/20 flex flex-col h-[calc(100vh-16rem)]">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {activeChat.customerName}
                    </h3>
                    <p className="text-sm text-gray-500">{activeChat.customerId}</p>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        activeChat.isLinkedUser
                          ? "bg-success-light text-success"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {activeChat.isLinkedUser ? "Logged In" : "Guest"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {isLoadingMessages ? (
                  <p className="text-center text-gray-500">Loading messages...</p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "agent"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-4 rounded-2xl ${
                          message.sender === "agent"
                            ? "bg-linear-to-br from-sand to-sage text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p
                          className={`text-xs mt-2 ${
                            message.sender === "agent"
                              ? "text-white/70"
                              : "text-gray-500"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <label className="flex items-center justify-center px-4 py-3 rounded-2xl border-2 border-gray-200 hover:border-sand cursor-pointer transition-colors">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
                  />

                  <button
                    type="submit"
                    disabled={isSending || !messageInput.trim()}
                    className="px-6 py-3 rounded-2xl bg-linear-to-r from-sand to-sage text-white font-semibold hover:shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-lg font-medium">No chat selected</p>
                <p className="text-sm">Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>

        {/* Customer Context (Right Sidebar) */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-lg border border-sand/20 max-h-[calc(100vh-16rem)] overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Customer Context
          </h3>

          {!activeChat ? (
            <p className="text-center text-gray-500 py-4">
              Select a chat to view context
            </p>
          ) : !activeChat.isLinkedUser ? (
            <div className="text-center text-gray-500 py-4">
              <svg
                className="w-12 h-12 mx-auto mb-3 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <p className="text-sm">Guest User</p>
              <p className="text-xs mt-1">No profile information available</p>
            </div>
          ) : isLoadingContext ? (
            <p className="text-center text-gray-500 py-4">Loading...</p>
          ) : customerContext ? (
            <div className="space-y-6">
              {/* Profile */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-2">Profile</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name:</span>
                    <span className="font-medium text-gray-900">
                      {customerContext.profile.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium text-gray-900 truncate ml-2">
                      {customerContext.profile.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-medium text-gray-900">
                      {customerContext.profile.phone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Points:</span>
                    <span className="font-medium text-sand">
                      {customerContext.profile.loyaltyPoints}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cart */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-2">
                  Cart ({customerContext.cart.length})
                </h4>
                <div className="space-y-2">
                  {customerContext.cart.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-gray-50 border border-gray-200"
                    >
                      <p className="font-medium text-gray-900 text-sm">
                        {item.name}
                      </p>
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>Qty: {item.quantity}</span>
                        <span className="font-semibold">${item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Orders */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-2">
                  Recent Orders
                </h4>
                <div className="space-y-2">
                  {customerContext.orders.map((order, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-gray-50 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {order.id}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            order.status === "delivered"
                              ? "bg-success-light text-success"
                              : "bg-warning/20 text-warning"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{order.date}</span>
                        <span className="font-semibold">${order.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wishlist */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-2">
                  Wishlist ({customerContext.wishlist.length})
                </h4>
                <div className="space-y-2">
                  {customerContext.wishlist.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-gray-50 border border-gray-200"
                    >
                      <p className="font-medium text-gray-900 text-sm">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">${item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SupportAgentView;
