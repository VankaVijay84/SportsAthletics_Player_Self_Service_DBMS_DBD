import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Dumbbell, Trophy, Activity, Shield, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function NotificationsPage() {
  const { user, showToast } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      if (res.success) {
        setNotifications(res.data.notifications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const handleMarkRead = async (id) => {
    try {
      const res = await api.put(`/notifications/${id}/read`);
      if (res.success) {
        showToast(id === 'all' ? 'All notifications marked as read' : 'Notification marked as read', 'success');
        fetchNotifications();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update notification', 'error');
    }
  };

  const categoryIcons = {
    Training: Dumbbell,
    Competition: Trophy,
    Performance: Activity,
    System: Shield
  };

  const filtered = activeCategory === 'All'
    ? notifications
    : notifications.filter(n => n.category === activeCategory);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Notifications Inbox</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Stay informed on training schedule updates, competition approvals and coach evaluation notes</p>
        </div>

        <button
          onClick={() => handleMarkRead('all')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-bold text-xs transition"
        >
          <CheckCheck className="w-4 h-4 text-emerald-500" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['All', 'Training', 'Competition', 'Performance', 'System'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-3">
        {filtered.length > 0 ? (
          filtered.map((n) => {
            const Icon = categoryIcons[n.category] || Bell;
            return (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                  !n.is_read
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                    : 'bg-gray-50 dark:bg-slate-900 border-gray-100 dark:border-slate-700/60'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">{n.title}</h3>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                        {n.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{n.message}</p>
                    <span className="text-[11px] text-gray-400 font-medium block pt-1">{n.created_at || 'Just now'}</span>
                  </div>
                </div>

                {!n.is_read && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="text-xs font-bold text-emerald-600 hover:underline flex-shrink-0"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center py-8 text-xs text-gray-400">No notifications found in this category.</p>
        )}
      </div>
    </div>
  );
}
