import React, { useEffect, useState, useRef } from "react";
import { MessageCircle, Send, X, Search, Circle, Plus, User } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function AdminChat() {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");

  // Layout states (same as Users.jsx)
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [lastSeenPerUser, setLastSeenPerUser] = useState(() => {
    const saved = localStorage.getItem("adminChatLastSeen");
    return saved ? JSON.parse(saved) : {};
  });

  const [unreadCounts, setUnreadCounts] = useState(() => {
    const saved = localStorage.getItem("adminChatUnreadCounts");
    return saved ? JSON.parse(saved) : {};
  });

  const [toasts, setToasts] = useState([]);
  const previousMessagesRef = useRef({});
  const messagesEndRef = useRef(null);

  const adminHeaders = {
    Authorization: "admin-token",
  };

  useEffect(() => {
    localStorage.setItem("adminChatUnreadCounts", JSON.stringify(unreadCounts));
  }, [unreadCounts]);

  useEffect(() => {
    localStorage.setItem("adminChatLastSeen", JSON.stringify(lastSeenPerUser));
  }, [lastSeenPerUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addToast = (userName, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, userName, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const isUserOnline = (lastMessageAt) => {
    if (!lastMessageAt) return false;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return new Date(lastMessageAt) > fiveMinutesAgo;
  };

  const loadAllUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: adminHeaders,
      });
      const data = await res.json();
      // Map the data to ensure consistent userId field
      const usersWithUserId = (data || []).map(user => ({
        ...user,
        userId: user.id // Backend uses 'id', frontend uses 'userId'
      }));
      setAllUsers(usersWithUserId);
    } catch (err) {
      console.error("Failed to load all users", err);
    }
  };

  const loadConversations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/chat/conversations`, {
        headers: adminHeaders,
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        const newUnread = { ...unreadCounts };

        for (const conv of data) {
          const userId = conv.userId;
          const lastSeen = lastSeenPerUser[userId];

          const msgRes = await fetch(
            `${API_URL}/api/admin/chat/messages/${userId}`,
            { headers: adminHeaders }
          );
          const msgs = await msgRes.json();

          if (!Array.isArray(msgs)) continue;

          let count = 0;
          if (!lastSeen) {
            count = msgs.filter(m => m.sender === "USER").length;
          } else {
            const seenTime = new Date(lastSeen);
            count = msgs.filter(m =>
              m.sender === "USER" && new Date(m.createdAt) > seenTime
            ).length;
          }

          const prev = newUnread[userId] || 0;
          if (count > prev && selectedUser?.userId !== userId) {
            const latest = msgs[msgs.length - 1];
            if (latest?.text) {
              addToast(`${conv.firstName} ${conv.lastName}`, latest.text);
            }
          }

          newUnread[userId] = count;
        }

        setUnreadCounts(newUnread);
      }

      setConversations(data || []);
    } catch (err) {
      console.error("Failed to load conversations", err);
    }
  };

  const loadMessages = async (userId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/admin/chat/messages/${userId}`,
        { headers: adminHeaders }
      );
      const data = await res.json();
      setMessages(data || []);

      const now = new Date().toISOString();
      setLastSeenPerUser(prev => ({ ...prev, [userId]: now }));
      setUnreadCounts(prev => ({ ...prev, [userId]: 0 }));
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;

    try {
      await fetch(`${API_URL}/api/admin/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "admin-token",
        },
        body: JSON.stringify({
          userId: selectedUser.userId,
          message: input,
        }),
      });

      setInput("");
      loadMessages(selectedUser.userId);
      loadConversations();
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  const startNewChat = (user) => {
    // Check if conversation already exists
    const existingConv = conversations.find(c => c.userId === user.userId);
    
    if (existingConv) {
      // If exists, just select it
      setSelectedUser(existingConv);
    } else {
      // Create new conversation entry
      const newConv = {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        lastMessage: "",
        lastMessageAt: new Date().toISOString()
      };
      
      // Add to conversations list
      setConversations(data || []);
      setSelectedUser(newConv);
    }
    
    setShowNewChatModal(false);
    setUserSearchTerm("");
  };

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    loadMessages(selectedUser.userId);
    const interval = setInterval(() => {
      loadMessages(selectedUser.userId);
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  function formatTime(dateStr) {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  const groupedMessages = messages.reduce((acc, msg) => {
    const dateKey = new Date(msg.createdAt).toLocaleDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {});

  const filteredConversations = conversations.filter(c => {
    if (!searchTerm) return true;
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const filteredUsers = allUsers.filter(user => {
    if (!userSearchTerm) return true;
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email?.toLowerCase() || "";
    const search = userSearchTerm.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  // Get users not already in conversations
    const availableUsers = filteredUsers;


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Layout */}
      <Sidebar
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
        setLogoutModal={() => {}}
      />

      <Topbar
        sidebarExpanded={sidebarExpanded}
        setLogoutModal={() => {}}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className={`transition-all duration-300 ${sidebarExpanded ? "md:ml-64" : "md:ml-16"}`}>
        {/* Toast Notifications */}
        <div className="fixed top-20 right-6 z-50 space-y-3">
          {toasts.map((t) => (
            <div 
              key={t.id} 
              className="bg-white rounded-xl shadow-2xl border border-slate-200 p-4 min-w-[300px] max-w-sm animate-slide-in-right backdrop-blur-sm bg-white/95"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 text-sm mb-1">{t.userName}</div>
                  <p className="text-sm text-slate-600 line-clamp-2">{t.message}</p>
                </div>
                <button
                  onClick={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* New Chat Modal */}
        {showNewChatModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-900">Start New Chat</h2>
                  <button
                    onClick={() => {
                      setShowNewChatModal(false);
                      setUserSearchTerm("");
                    }}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    autoFocus
                  />
                </div>
              </div>

              {/* User List */}
              <div className="flex-1 overflow-y-auto p-4">
                {availableUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                    <User className="w-16 h-16 mb-3 opacity-20" />
                    <p className="text-sm text-center">
                      {userSearchTerm ? "No users found" : "All users are already in your conversations"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {availableUsers.map(user => (
                      <div
                        key={user.userId}
                        onClick={() => startNewChat(user)}
                        className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-sm text-slate-500">{user.email}</p>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="w-5 h-5 text-emerald-600" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Chat Container */}
        <div className="p-6 ">
          <div className="max-w-[1600px] mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden h-[calc(100vh-140px)]">
              <div className="flex h-full">
                {/* Conversations Sidebar */}
                <div className="w-96 border-r border-slate-200 flex flex-col bg-slate-50/50">
                  {/* Search Header */}
                  <div className="p-5 border-b border-slate-200 bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <MessageCircle className="w-6 h-6 text-emerald-600" />
                        Messages
                      </h2>
                      <button
                        onClick={() => {
                          loadAllUsers();
                          setShowNewChatModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">New Chat</span>
                      </button>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Conversation List */}
                  <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8">
                        <MessageCircle className="w-16 h-16 mb-3 opacity-20" />
                        <p className="text-sm text-center mb-4">No conversations yet</p>
                        <button
                          onClick={() => {
                            loadAllUsers();
                            setShowNewChatModal(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Start a conversation
                        </button>
                      </div>
                    ) : (
                      <div className="p-2">
                        {filteredConversations.map(c => (
                          <div
                            key={c.userId}
                            onClick={() => setSelectedUser(c)}
                            className={`
                              group relative p-4 mb-1 cursor-pointer rounded-xl transition-all duration-200
                              ${selectedUser?.userId === c.userId 
                                ? "bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 shadow-md" 
                                : "hover:bg-white border border-transparent hover:shadow-sm"
                              }
                            `}
                          >
                            <div className="flex items-start gap-3">
                              {/* Avatar */}
                              <div className="relative flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                                  {c.firstName[0]}{c.lastName[0]}
                                </div>
                                {isUserOnline(c.lastMessageAt) && (
                                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                  <h3 className="font-semibold text-slate-900 text-sm">
                                    {c.firstName} {c.lastName}
                                  </h3>
                                  {unreadCounts[c.userId] > 0 && (
                                    <span className="flex items-center justify-center min-w-[22px] h-[22px] bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-bold rounded-full px-1.5 shadow-lg">
                                      {unreadCounts[c.userId]}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-1">{c.lastMessage || "Start a conversation"}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                  {!selectedUser ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                      <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                        <MessageCircle className="w-12 h-12 text-slate-300" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-600 mb-2">Welcome to Admin Chat</h3>
                      <p className="text-sm text-slate-400 mb-6">Select a conversation to start messaging</p>
                      <button
                        onClick={() => {
                          loadAllUsers();
                          setShowNewChatModal(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">New Chat</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Chat Header */}
                      <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-white to-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold shadow-md">
                            {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg">
                              {selectedUser.firstName} {selectedUser.lastName}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Circle className={`w-2 h-2 ${isUserOnline(selectedUser.lastMessageAt) ? 'fill-green-500 text-green-500' : 'fill-slate-300 text-slate-300'}`} />
                              <span>{isUserOnline(selectedUser.lastMessageAt) ? 'Online' : 'Offline'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Messages Area */}
                      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                        <div className="max-w-4xl mx-auto space-y-4">
                          {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                              <MessageCircle className="w-16 h-16 mb-3 opacity-20" />
                              <p className="text-sm text-center">No messages yet. Start the conversation!</p>
                            </div>
                          ) : (
                            Object.entries(groupedMessages).map(([date, msgs]) => (
                              <div key={date}>
                                {/* Date Divider */}
                                <div className="flex items-center gap-3 my-6">
                                  <div className="flex-1 h-px bg-slate-200"></div>
                                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                    {date}
                                  </span>
                                  <div className="flex-1 h-px bg-slate-200"></div>
                                </div>

                                {/* Messages */}
                                {msgs.map(msg => (
                                  <div
                                    key={msg.id}
                                    className={`flex mb-4 ${msg.sender === "ADMIN" ? "justify-end" : "justify-start"}`}
                                  >
                                    <div className={`group max-w-[70%] ${msg.sender === "ADMIN" ? "items-end" : "items-start"} flex flex-col`}>
                                      <div className={`
                                        px-4 py-2.5 rounded-2xl shadow-sm transition-all duration-200
                                        ${msg.sender === "ADMIN"
                                          ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-md"
                                          : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
                                        }
                                      `}>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                                      </div>
                                      <span className={`
                                        text-[10px] text-slate-400 mt-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity
                                        ${msg.sender === "ADMIN" ? "text-right" : "text-left"}
                                      `}>
                                        {formatTime(msg.createdAt)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ))
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      </div>

                      {/* Message Input */}
                      <div className="p-6 border-t border-slate-200 bg-white">
                        <div className="flex gap-3 items-end max-w-4xl mx-auto">
                          <div className="flex-1 relative">
                            <textarea
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  sendMessage();
                                }
                              }}
                              rows="1"
                              className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all"
                              placeholder="Type your message..."
                              style={{
                                minHeight: '48px',
                                maxHeight: '120px',
                                height: 'auto',
                                overflowY: input.split('\n').length > 2 ? 'auto' : 'hidden'
                              }}
                            />
                          </div>
                          <button
                            onClick={sendMessage}
                            disabled={!input.trim()}
                            className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}