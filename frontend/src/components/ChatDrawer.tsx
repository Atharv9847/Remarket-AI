import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare, ArrowLeft, CheckCircle2 } from 'lucide-react';
import type { Conversation, Message, User } from '../types';
import { api } from '../api';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  initialSellerId?: number | null;
  initialProductId?: number | null;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenAuth,
  initialSellerId,
  initialProductId
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const data = await api.getConversations();
      setConversations(data);
      if (initialProductId && !activeConv) {
        const found = data.find((c) => c.product_id === initialProductId);
        if (found) {
          setActiveConv(found);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
  }, [isOpen, currentUser, initialProductId]);

  useEffect(() => {
    if (activeConv) {
      api.getMessages(activeConv.id)
        .then((msgs) => setMessages(msgs))
        .catch(console.error);
    }
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentUser) return;

    try {
      setSending(true);
      const receiverId = activeConv
        ? (activeConv.buyer_id === currentUser.id ? activeConv.seller_id : activeConv.buyer_id)
        : (initialSellerId || 2);

      const newMsg = await api.sendMessage(
        receiverId,
        inputMessage.trim(),
        activeConv?.product_id || initialProductId || undefined,
        activeConv?.id
      );

      setMessages((prev) => [...prev, newMsg]);
      setInputMessage('');
      loadConversations();
    } catch (err: any) {
      alert(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            {activeConv && (
              <button
                onClick={() => setActiveConv(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 mr-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="font-bold text-white text-base">
                {activeConv ? (activeConv.other_user?.name || 'Chat Thread') : 'Direct Messages'}
              </h2>
              {activeConv && (
                <span className="text-[11px] text-slate-400 block truncate max-w-[200px]">
                  Re: {activeConv.product_title}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!currentUser ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-sm text-slate-400 mb-3">Sign in to communicate with buyers and sellers.</p>
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
            >
              Sign In
            </button>
          </div>
        ) : activeConv || initialSellerId ? (
          // Active Chat Thread
          <div className="flex-1 flex flex-col min-h-0">
            
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-500">
                  Send a message to initiate the negotiation!
                </div>
              ) : (
                messages.map((m) => {
                  const isMine = m.sender_id === currentUser.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl text-xs sm:text-sm ${
                          isMine
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                        }`}
                      >
                        {m.message}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 px-1">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950/70 flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message or negotiate terms..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={sending || !inputMessage.trim()}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer disabled:opacity-50 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        ) : (
          // Conversations List
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {conversations.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500">
                No active conversations yet. Click "Chat with Seller" on any listing!
              </div>
            ) : (
              conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setActiveConv(c)}
                  className="p-3 rounded-xl glass-card border border-slate-800 hover:border-indigo-500/40 transition cursor-pointer flex items-center gap-3"
                >
                  <img
                    src={c.product_image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=150&q=80'}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-white text-xs truncate">
                        {c.other_user?.name || 'Seller'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(c.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-medium truncate mb-0.5">
                      {c.product_title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {c.last_message?.message || 'Started a conversation'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};
