'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { Mail, Eye, EyeOff, Trash2, ChevronDown, ChevronUp, Building2, Phone } from 'lucide-react';

interface ContactMessage {
  id: number;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const subjectLabels: Record<string, string> = {
  question: 'Question sur une recette',
  suggestion: 'Suggestion de recette',
  collaboration: 'Collaboration / Partenariat',
  bug: 'Signaler un problème',
  autre: 'Autre',
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const supabase = createClient();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_messages' as never)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur chargement messages:', error);
    } else {
      setMessages((data as ContactMessage[]) || []);
    }
    setLoading(false);
  };

  const toggleRead = async (id: number, currentStatus: boolean) => {
    const { error } = await supabase
      .from('contact_messages' as never)
      .update({ is_read: !currentStatus } as never)
      .eq('id', id);

    if (!error) {
      setMessages(messages.map(m =>
        m.id === id ? { ...m, is_read: !currentStatus } : m
      ));
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;

    const { error } = await supabase
      .from('contact_messages' as never)
      .delete()
      .eq('id', id);

    if (!error) {
      setMessages(messages.filter(m => m.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
  };

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread') return !m.is_read;
    if (filter === 'read') return m.is_read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Messages de contact</h1>
          {unreadCount > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-sm rounded-md ${
              filter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tous ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 text-sm rounded-md ${
              filter === 'unread'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Non lus ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1.5 text-sm rounded-md ${
              filter === 'read'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Lus ({messages.length - unreadCount})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500">Chargement des messages...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {filter === 'all'
              ? 'Aucun message reçu'
              : filter === 'unread'
                ? 'Aucun message non lu'
                : 'Aucun message lu'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`${!msg.is_read ? 'bg-orange-50' : ''}`}
            >
              <div
                className="px-6 py-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${!msg.is_read ? 'bg-orange-500' : 'bg-transparent'}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${!msg.is_read ? 'text-gray-900' : 'text-gray-600'}`}>
                          {msg.name}
                        </span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                          {subjectLabels[msg.subject] || msg.subject}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{msg.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">
                      {new Date(msg.created_at).toLocaleDateString('fr-CA', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {expandedId === msg.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {expandedId === msg.id && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  {/* Contact Info */}
                  <div className="flex flex-wrap gap-4 mb-4 text-sm">
                    <a
                      href={`mailto:${msg.email}`}
                      className="flex items-center gap-1.5 text-orange-600 hover:text-orange-700"
                    >
                      <Mail className="w-4 h-4" />
                      {msg.email}
                    </a>
                    {msg.phone && (
                      <a
                        href={`tel:${msg.phone}`}
                        className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800"
                      >
                        <Phone className="w-4 h-4" />
                        {msg.phone}
                      </a>
                    )}
                    {msg.company && (
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <Building2 className="w-4 h-4" />
                        {msg.company}
                      </span>
                    )}
                  </div>

                  {/* Message */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRead(msg.id, msg.is_read);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md ${
                        msg.is_read
                          ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {msg.is_read ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Marquer non lu
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Marquer lu
                        </>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(msg.id);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
