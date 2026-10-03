import React, { useState, useEffect } from 'react';
import { Award, Trophy, Shield, Zap, Plus, Star, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Common/Modal';
import api from '../services/api';

export default function AchievementsPage() {
  const { user, playerProfile, showToast } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newAch, setNewAch] = useState({
    player_id: playerProfile?.id || 1,
    title: 'Man of the Match & Gold Medal',
    award_type: 'Gold Medal',
    event_name: 'Regional Collegiate Football Derby',
    year: 2026,
    description: 'Scored 2 decisive goals in the 3-1 victory.'
  });

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const targetId = playerProfile?.id || 1;
      const res = await api.get(`/competitions/achievements/${targetId}`);
      if (res.success) {
        setAchievements(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [user, playerProfile]);

  const handleAddAchievement = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/competitions/achievements', newAch);
      if (res.success) {
        showToast('Achievement awarded and published to profile!', 'success');
        setAddModalOpen(false);
        fetchAchievements();
      }
    } catch (err) {
      showToast(err.message || 'Failed to add achievement', 'error');
    }
  };

  const getAwardBadge = (type) => {
    if (type.includes('Gold')) return { color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200', icon: '🥇' };
    if (type.includes('Silver')) return { color: 'text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-300', icon: '🥈' };
    if (type.includes('Bronze')) return { color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/60 border-orange-200', icon: '🥉' };
    if (type.includes('Trophy')) return { color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 border-purple-200', icon: '🏆' };
    return { color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200', icon: '🎖️' };
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Honors & Trophy Showcase</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Celebrate university varsity gold medals, tournament trophies and MVP certificates</p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Honor</span>
        </button>
      </div>

      {/* Achievements Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((ach) => {
          const badge = getAwardBadge(ach.award_type);
          return (
            <div
              key={ach.id}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm flex items-start gap-4 hover:shadow-md transition"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border ${badge.color} flex-shrink-0 shadow-sm`}>
                {badge.icon}
              </div>

              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{ach.award_type}</span>
                  <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {ach.year}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug">{ach.title}</h3>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{ach.event_name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 pt-1 leading-relaxed">{ach.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Achievement Modal */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Award New Achievement">
        <form onSubmit={handleAddAchievement} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Achievement Title</label>
            <input
              type="text"
              required
              value={newAch.title}
              onChange={(e) => setNewAch({ ...newAch, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Award Type</label>
              <select
                value={newAch.award_type}
                onChange={(e) => setNewAch({ ...newAch, award_type: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
              >
                <option value="Gold Medal">Gold Medal 🥇</option>
                <option value="Silver Medal">Silver Medal 🥈</option>
                <option value="Bronze Medal">Bronze Medal 🥉</option>
                <option value="Trophy">Championship Trophy 🏆</option>
                <option value="Certificate">Varsity Certificate 📜</option>
                <option value="Award">Special MVP Award 🎖️</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Award Year</label>
              <input
                type="number"
                value={newAch.year}
                onChange={(e) => setNewAch({ ...newAch, year: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Event Name</label>
            <input
              type="text"
              required
              value={newAch.event_name}
              onChange={(e) => setNewAch({ ...newAch, event_name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              rows="2"
              value={newAch.description}
              onChange={(e) => setNewAch({ ...newAch, description: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
          >
            Publish Honor to Profile
          </button>
        </form>
      </Modal>
    </div>
  );
}
