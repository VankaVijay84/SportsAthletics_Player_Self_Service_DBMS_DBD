import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Search, Filter, Shield, Trophy, Dumbbell, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/Common/StatusBadge';
import Modal from '../components/Common/Modal';
import api from '../services/api';

export default function AdminDashboardPage() {
  const { user, showToast } = useAuth();
  const [players, setPlayers] = useState([]);
  const [sports, setSports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('players');
  const [loading, setLoading] = useState(true);

  // Modals
  const [sportModalOpen, setSportModalOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);

  const [newSport, setNewSport] = useState({ name: '', code: '', category: 'Team Sport' });
  const [newTeam, setNewTeam] = useState({ name: '', sport_id: 1, season: '2026 Season' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, sRes, tRes] = await Promise.all([
        api.get(`/players?search=${search}`),
        api.get('/admin/sports'),
        api.get('/admin/teams')
      ]);

      if (pRes.success) setPlayers(pRes.data);
      if (sRes.success) setSports(sRes.data);
      if (tRes.success) setTeams(tRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleDeletePlayer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this player account?')) return;
    try {
      const res = await api.delete(`/players/${id}`);
      if (res.success) {
        showToast('Player deleted', 'info');
        fetchData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete player', 'error');
    }
  };

  const handleCreateSport = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/sports', newSport);
      if (res.success) {
        showToast('Sport branch added!', 'success');
        setSportModalOpen(false);
        fetchData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to add sport', 'error');
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/teams', newTeam);
      if (res.success) {
        showToast('Team squad created!', 'success');
        setTeamModalOpen(false);
        fetchData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create team', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Administration Control Hub</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Manage varsity rosters, sports branches, team squads and system access</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSportModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Sport</span>
          </button>
          <button
            onClick={() => setTeamModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Squad</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab('players')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'players' ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-slate-800'}`}
        >
          Players Directory ({players.length})
        </button>
        <button
          onClick={() => setActiveTab('sports')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'sports' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-slate-800'}`}
        >
          Sports Branches ({sports.length})
        </button>
        <button
          onClick={() => setActiveTab('teams')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'teams' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-800'}`}
        >
          Team Squads ({teams.length})
        </button>
      </div>

      {/* Players Directory Tab */}
      {activeTab === 'players' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search player by name, ID code or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-slate-900/80 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-bold">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Player ID</th>
                  <th className="px-4 py-3">Athlete Name</th>
                  <th className="px-4 py-3">Sport Branch</th>
                  <th className="px-4 py-3">Team Squad</th>
                  <th className="px-4 py-3">Performance Score</th>
                  <th className="px-4 py-3">Attendance</th>
                  <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {players.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                    <td className="px-4 py-3.5 font-bold text-emerald-600">{p.player_id_code}</td>
                    <td className="px-4 py-3.5 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <img src={p.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'} alt="" className="w-7 h-7 rounded-full object-cover" />
                      <span>{p.full_name}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-medium">{p.sport_name || 'Football'}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-500">{p.team_name || 'Varsity Eagles'}</td>
                    <td className="px-4 py-3.5 font-black text-emerald-600">{p.performance_score || 88}/100</td>
                    <td className="px-4 py-3.5 font-bold text-blue-600">{p.attendance_percentage || 94}%</td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleDeletePlayer(p.id)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sports Tab */}
      {activeTab === 'sports' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sports.map((s) => (
            <div key={s.id} className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full">{s.code}</span>
                <span className="text-xs text-gray-400 font-semibold">{s.category}</span>
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">{s.name}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{s.description || 'Varsity championship branch.'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Teams Tab */}
      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((t) => (
            <div key={t.id} className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">{t.sport_name}</span>
                <span className="text-xs font-bold text-blue-600">{t.season || '2026 Season'}</span>
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">{t.name}</h3>
              <p className="text-xs text-gray-500">Coach: {t.coach_name || 'Rahul Dravid'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Sport Modal */}
      <Modal isOpen={sportModalOpen} onClose={() => setSportModalOpen(false)} title="Add New Sport Branch">
        <form onSubmit={handleCreateSport} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Sport Name</label>
            <input
              type="text"
              required
              value={newSport.name}
              onChange={(e) => setNewSport({ ...newSport, name: e.target.value })}
              placeholder="e.g. Swimming & Aquatics"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Sport Code</label>
            <input
              type="text"
              required
              value={newSport.code}
              onChange={(e) => setNewSport({ ...newSport, code: e.target.value })}
              placeholder="e.g. SWM"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 rounded-xl"
            />
          </div>
          <button type="submit" className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl">
            Save Sport Branch
          </button>
        </form>
      </Modal>

      {/* Team Modal */}
      <Modal isOpen={teamModalOpen} onClose={() => setTeamModalOpen(false)} title="Create Team Squad">
        <form onSubmit={handleCreateTeam} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Team Squad Name</label>
            <input
              type="text"
              required
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              placeholder="e.g. University Aquatics Squad"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 rounded-xl"
            />
          </div>
          <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl">
            Create Team Squad
          </button>
        </form>
      </Modal>
    </div>
  );
}
