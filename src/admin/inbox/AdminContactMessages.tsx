import { useEffect, useState } from 'react';
import { Trash2, Mail, MailOpen, Archive, ChevronDown, ChevronUp } from 'lucide-react';
import { apiFetch, ApiError } from '../../lib/api';
import type { ContactMessage } from '../../lib/types';

const STATUS_STYLES: Record<ContactMessage['status'], string> = {
  unread: 'bg-blue-100 text-blue-700',
  read: 'bg-gray-100 text-gray-600',
  archived: 'bg-gray-100 text-gray-400',
};

export default function AdminContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  function load() {
    setLoading(true);
    apiFetch<ContactMessage[]>('/api/admin/contact-messages')
      .then(setMessages)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load messages'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function setStatus(id: number, status: ContactMessage['status']) {
    try {
      const updated = await apiFetch<ContactMessage>(`/api/admin/contact-messages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setMessages((msgs) => msgs.map((m) => (m.id === id ? updated : m)));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to update message');
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      await apiFetch(`/api/admin/contact-messages/${id}`, { method: 'DELETE' });
      setMessages((msgs) => msgs.filter((m) => m.id !== id));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to delete message');
    }
  }

  function toggleExpand(msg: ContactMessage) {
    const nextId = expandedId === msg.id ? null : msg.id;
    setExpandedId(nextId);
    if (nextId !== null && msg.status === 'unread') setStatus(msg.id, 'read');
  }

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-dark">
        Contact Messages {unreadCount > 0 && <span className="text-primary-blue">({unreadCount} unread)</span>}
      </h1>
      <p className="text-body-text text-sm mb-6">Messages submitted through the public Contact page.</p>

      {loading && <p className="text-body-text">Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && messages.length === 0 && (
        <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-xl bg-white text-gray-400">No messages yet.</div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
        {messages.map((msg) => (
          <div key={msg.id}>
            <button onClick={() => toggleExpand(msg)} className="w-full flex items-center gap-4 p-4 text-left hover:bg-light-gray/50">
              <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${STATUS_STYLES[msg.status]}`}>{msg.status}</span>
              <div className="flex-1 min-w-0">
                <p className={`truncate ${msg.status === 'unread' ? 'font-bold text-primary-dark' : 'font-medium text-gray-700'}`}>
                  {msg.name} {msg.company && <span className="text-gray-400 font-normal">— {msg.company}</span>}
                </p>
                <p className="text-xs text-gray-400 truncate">{msg.subject || '(no subject)'} · {msg.email}</p>
              </div>
              <span className="text-xs text-gray-400 shrink-0">{new Date(msg.createdAt).toLocaleDateString()}</span>
              {expandedId === msg.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {expandedId === msg.id && (
              <div className="px-4 pb-4">
                <div className="bg-light-gray/60 rounded-xl p-4 text-sm text-body-text space-y-2">
                  {msg.phone && <p><span className="font-medium text-primary-dark">Phone:</span> {msg.phone}</p>}
                  <p className="whitespace-pre-line">{msg.message}</p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <a href={`mailto:${msg.email}`} className="text-xs font-medium text-primary-blue hover:text-accent-hover px-3 py-1.5 border border-primary-blue/30 rounded-lg">Reply by Email</a>
                  {msg.status !== 'unread' && (
                    <button onClick={() => setStatus(msg.id, 'unread')} className="text-xs font-medium text-gray-500 hover:text-primary-blue px-3 py-1.5 border border-gray-200 rounded-lg flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" /> Mark Unread
                    </button>
                  )}
                  {msg.status !== 'read' && (
                    <button onClick={() => setStatus(msg.id, 'read')} className="text-xs font-medium text-gray-500 hover:text-primary-blue px-3 py-1.5 border border-gray-200 rounded-lg flex items-center gap-1">
                      <MailOpen className="w-3.5 h-3.5" /> Mark Read
                    </button>
                  )}
                  {msg.status !== 'archived' && (
                    <button onClick={() => setStatus(msg.id, 'archived')} className="text-xs font-medium text-gray-500 hover:text-primary-blue px-3 py-1.5 border border-gray-200 rounded-lg flex items-center gap-1">
                      <Archive className="w-3.5 h-3.5" /> Archive
                    </button>
                  )}
                  <button onClick={() => handleDelete(msg.id)} className="text-xs font-medium text-red-500 hover:text-red-700 px-3 py-1.5 border border-red-200 rounded-lg flex items-center gap-1 ml-auto">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
