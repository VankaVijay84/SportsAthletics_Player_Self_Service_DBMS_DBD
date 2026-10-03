import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User, Search, Check, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function MessagesPage() {
  const { user, playerProfile, showToast } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages');
      if (res.success && res.data.length > 0) {
        setConversations(res.data);
        if (!activeContact) {
          setActiveContact(res.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChatHistory = async (contactId) => {
    if (!contactId) return;
    try {
      const res = await api.get(`/messages?contactId=${contactId}`);
      if (res.success) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (activeContact) {
      fetchChatHistory(activeContact.user_id);
    }
  }, [activeContact]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeContact) return;

    try {
      const res = await api.post('/messages', {
        receiver_id: activeContact.user_id,
        content: newMessageText
      });

      if (res.success) {
        setNewMessageText('');
        fetchChatHistory(activeContact.user_id);
      }
    } catch (err) {
      showToast(err.message || 'Failed to send message', 'error');
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden animate-fade-in">
      {/* Left Conversations Sidebar */}
      <div className="w-full md:w-80 border-r border-gray-100 dark:border-slate-700 flex flex-col">
        <div className="p-4 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" /> Direct Messaging
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700">
          {conversations.map((contact) => (
            <div
              key={contact.user_id}
              onClick={() => setActiveContact(contact)}
              className={`p-4 flex items-center gap-3 cursor-pointer transition ${
                activeContact?.user_id === contact.user_id
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-l-4 border-emerald-500'
                  : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <img
                src={contact.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'}
                alt={contact.display_name}
                className="w-10 h-10 rounded-full object-cover border border-emerald-500"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{contact.display_name}</p>
                <p className="text-[11px] text-gray-400 font-semibold">{contact.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Chat Messaging Box */}
      <div className="flex-1 flex flex-col bg-gray-50/50 dark:bg-slate-900/50">
        {activeContact ? (
          <>
            {/* Active Contact Bar */}
            <div className="p-4 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 flex items-center gap-3">
              <img
                src={activeContact.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'}
                alt={activeContact.display_name}
                className="w-9 h-9 rounded-full object-cover border border-emerald-500"
              />
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">{activeContact.display_name}</h3>
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Active Chat Session</span>
              </div>
            </div>

            {/* Chat Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => {
                const isMe = m.sender_id === user?.id;
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs md:max-w-md px-4 py-2.5 rounded-2xl text-xs space-y-1 shadow-sm ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-100 dark:border-slate-700 rounded-bl-none'
                      }`}
                    >
                      <p className="leading-relaxed">{m.content}</p>
                      <div className="flex items-center justify-end gap-1 text-[9px] opacity-75">
                        <span>{m.created_at?.split(' ')[1]?.slice(0, 5) || '10:15'}</span>
                        {isMe && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Send Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 flex gap-2">
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Type your message to coach or admin..."
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-slate-900 border border-transparent focus:border-emerald-500 rounded-xl outline-none text-xs text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-xs">
            Select a coach or athlete from the list to start messaging.
          </div>
        )}
      </div>
    </div>
  );
}
