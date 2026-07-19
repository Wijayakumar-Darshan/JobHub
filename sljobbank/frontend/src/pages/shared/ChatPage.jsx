import { useEffect, useRef, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { chatApi } from '@/api';
import { useAuthStore } from '/src/store/authStore';
import { supabase, isChatRealtimeConfigured } from '@/lib/supabaseClient';
import { formatDistanceToNow } from 'date-fns';
import { Send, Edit2, Trash2, Users } from 'lucide-react';

export default function ChatPage() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const bottomRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const res = await chatApi.getRecent(100);
      const list = (res.data.data || []).slice().reverse();
      setMessages(list);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Realtime or Polling
  useEffect(() => {
    if (isChatRealtimeConfigured) {
      const channel = supabase
        .channel('chat_messages_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, load)
        .subscribe();
      return () => supabase.removeChannel(channel);
    } else {
      const interval = setInterval(load, 4000);
      return () => clearInterval(interval);
    }
  }, [load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    try {
      await chatApi.send(input.trim());
      setInput('');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    }
  };

  const startEdit = (m) => {
    setEditingId(m.id);
    setEditValue(m.content);
  };

  const saveEdit = async (id) => {
    try {
      await chatApi.edit(id, editValue.trim());
      setEditingId(null);
      load();
      toast.success('Message updated');
    } catch (err) {
      toast.error('Failed to update message');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await chatApi.remove(id);
      load();
      toast.success('Message removed');
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  const canModerate = user?.role === 'COUNSELOR' || user?.role === 'SUPER_ADMIN';
  const isMine = (msg) => msg.authorId === user?.id;

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (role) => {
    if (role === 'SUPER_ADMIN') return 'bg-purple-600';
    if (role === 'COUNSELOR') return 'bg-blue-600';
    return 'bg-emerald-600';
  };

  // ←←← FIXED: Added missing function
  const getRoleLabel = (role) => {
    if (role === 'SUPER_ADMIN') return 'Admin';
    if (role === 'COUNSELOR') return 'Counselor';
    return 'Student';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl">
          💬
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Chat</h1>
          <p className="text-gray-500 text-sm">Talk with students, counselors, and mentors</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col h-[75vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-500" />
            <div>
              <span className="font-semibold">Public Chat</span>
              <span className="ml-2 text-xs text-gray-400">({messages.length} messages)</span>
            </div>
          </div>
          <div className="text-xs px-3 py-1 bg-white rounded-full border">
            {isChatRealtimeConfigured ? '🟢 Live' : '🔄 Polling'}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <div className="text-5xl mb-4">💬</div>
                <p className="text-gray-400">No messages yet.</p>
                <p className="text-sm text-gray-500 mt-1">Be the first to say something!</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const mine = isMine(msg);
              const isEditing = editingId === msg.id;

              return (
                <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] ${mine ? 'items-end' : 'items-start'} flex flex-col`}>
                    {/* Author info */}
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${getAvatarColor(msg.authorRole)}`}>
                        {getInitials(msg.authorName)}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">{msg.authorName}</span>
                        <span className="ml-2 text-[10px] text-gray-400">
                          {getRoleLabel(msg.authorRole)}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 ml-auto">
                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                      </span>
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`px-5 py-3 rounded-3xl text-[15px] leading-relaxed shadow-sm
                        ${mine 
                          ? 'bg-[#0A2E1C] text-white rounded-br-none' 
                          : 'bg-white border border-gray-100 rounded-bl-none'
                        }`}
                    >
                      {isEditing ? (
                        <div className="flex gap-2">
                          <input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="bg-transparent border-b border-white/30 focus:outline-none text-white flex-1"
                            autoFocus
                          />
                          <button onClick={() => saveEdit(msg.id)} className="text-emerald-400 text-sm font-medium">Save</button>
                          <button onClick={() => setEditingId(null)} className="text-gray-400 text-sm">Cancel</button>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 text-[10px] mt-1 px-1">
                      {mine && (
                        <button onClick={() => startEdit(msg)} className="text-gray-400 hover:text-gray-600 flex items-center gap-1">
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                      )}
                      {canModerate && (
                        <button onClick={() => remove(msg.id)} className="text-red-400 hover:text-red-600 flex items-center gap-1">
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Type a message..."
              className="flex-1 px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0A2E1C]/30 text-sm"
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="px-7 bg-[#0A2E1C] text-white rounded-2xl hover:bg-[#1A6B50] disabled:opacity-50 transition flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

