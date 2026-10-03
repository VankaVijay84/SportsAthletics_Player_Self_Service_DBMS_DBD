import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, MapPin, Shield, Plus, CheckCircle2, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/Common/StatusBadge';
import Modal from '../components/Common/Modal';
import api from '../services/api';

export default function CompetitionsPage() {
  const { user, playerProfile, showToast } = useAuth();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newComp, setNewComp] = useState({
    name: '',
    sport_id: playerProfile?.sport_id || 1,
    category: 'Inter-University League',
    competition_date: '',
    location: 'Central Sports Complex Stadium',
    opponent: 'St. Xavier Varsity FC',
    description: 'Championship match with live broadcast.'
  });

  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/competitions');
      if (res.success) {
        setCompetitions(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const handleRegister = async (compId) => {
    try {
      const res = await api.post(`/competitions/${compId}/register`, {
        player_id: playerProfile?.id || 1
      });
      if (res.success) {
        showToast('Registration for competition submitted successfully!', 'success');
        fetchCompetitions();
      }
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    }
  };

  const handleCreateCompetition = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/competitions', newComp);
      if (res.success) {
        showToast('Competition event published!', 'success');
        setCreateModalOpen(false);
        fetchCompetitions();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create competition', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Competitions & Tournaments</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Browse upcoming varsity leagues, register for fixtures and inspect match results</p>
        </div>

        {(user?.role === 'COACH' || user?.role === 'ADMIN' || user?.role === 'SPORTS_ADMIN') && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Tournament Fixture</span>
          </button>
        )}
      </div>

      {/* Competitions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {competitions.map((c) => (
          <div
            key={c.id}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <StatusBadge status={c.userRegistrationStatus || c.status} />
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full">
                  {c.category}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug">{c.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{c.sport_name} • Opponent: <span className="font-semibold text-gray-700 dark:text-gray-200">{c.opponent || 'State Rivals'}</span></p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400 pt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <span>Scheduled Date: {c.competition_date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>Venue: {c.location}</span>
                </div>
              </div>

              {c.result_summary && (
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700/60 text-xs font-semibold text-gray-800 dark:text-gray-200">
                  🏆 Match Outcome: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{c.result_summary}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-medium">Varsity Sanctioned</span>
              {c.userRegistrationStatus === 'Approved' || c.userRegistrationStatus === 'Registered' ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" /> Registered
                </span>
              ) : (
                <button
                  onClick={() => handleRegister(c.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition"
                >
                  Register for Competition
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Competition Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create Competition Event">
        <form onSubmit={handleCreateCompetition} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Competition Title</label>
            <input
              type="text"
              required
              value={newComp.name}
              onChange={(e) => setNewComp({ ...newComp, name: e.target.value })}
              placeholder="e.g. All India Inter-University Cup"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Event Date</label>
              <input
                type="date"
                required
                value={newComp.competition_date}
                onChange={(e) => setNewComp({ ...newComp, competition_date: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <input
                type="text"
                value={newComp.category}
                onChange={(e) => setNewComp({ ...newComp, category: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Venue Location</label>
            <input
              type="text"
              required
              value={newComp.location}
              onChange={(e) => setNewComp({ ...newComp, location: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Opponent Team</label>
            <input
              type="text"
              value={newComp.opponent}
              onChange={(e) => setNewComp({ ...newComp, opponent: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
          >
            Publish Tournament Entry
          </button>
        </form>
      </Modal>
    </div>
  );
}
