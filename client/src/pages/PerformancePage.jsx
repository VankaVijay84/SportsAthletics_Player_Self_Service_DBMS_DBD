import React, { useState, useEffect } from 'react';
import { Activity, Plus, TrendingUp, ShieldCheck, Dumbbell, Award } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Common/Modal';
import api from '../services/api';

export default function PerformancePage() {
  const { user, playerProfile, showToast } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logModalOpen, setLogModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    player_id: playerProfile?.id || 1,
    recorded_date: new Date().toISOString().split('T')[0],
    speed: 88,
    strength: 82,
    endurance: 86,
    agility: 84,
    flexibility: 80,
    reaction_time: 85,
    accuracy: 90,
    remarks: 'Pre-match assessment performance test'
  });

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const targetId = playerProfile?.id || 1;
      const res = await api.get(`/performance/${targetId}`);
      if (res.success) {
        setRecords(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user, playerProfile]);

  const handleAddPerformance = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/performance', formData);
      if (res.success) {
        showToast(`Performance record added! Overall Score: ${res.data.overall_score}`, 'success');
        setLogModalOpen(false);
        fetchRecords();
      }
    } catch (err) {
      showToast(err.message || 'Failed to add record', 'error');
    }
  };

  const formattedChartData = records.map(r => ({
    date: r.recorded_date,
    Speed: r.speed,
    Strength: r.strength,
    Endurance: r.endurance,
    Agility: r.agility,
    Overall: r.overall_score
  }));

  const latestRecord = records[records.length - 1] || {
    speed: 91, strength: 85, endurance: 89, agility: 88, flexibility: 80, reaction_time: 88, accuracy: 92, overall_score: 88
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Performance Analytics</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Track athletic attributes, velocity, endurance and physical progression</p>
        </div>

        {(user?.role === 'COACH' || user?.role === 'ADMIN' || user?.role === 'SPORTS_ADMIN') && (
          <button
            onClick={() => setLogModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Log Performance Entry</span>
          </button>
        )}
      </div>

      {/* Top Metrics Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Speed Score</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{latestRecord.speed} / 100</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Strength Score</span>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{latestRecord.strength} / 100</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Endurance Score</span>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{latestRecord.endurance} / 100</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Agility Score</span>
          <p className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">{latestRecord.agility} / 100</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart Trend */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Historical Score Trends</h2>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              +9% Season Growth
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis domain={[60, 100]} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="Overall" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="Speed" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="Agility" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attribute Bar Comparison */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Attribute Breakdown</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{
                name: 'Current Metrics',
                Speed: latestRecord.speed,
                Strength: latestRecord.strength,
                Endurance: latestRecord.endurance,
                Agility: latestRecord.agility,
                Accuracy: latestRecord.accuracy
              }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis domain={[0, 100]} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
                <Legend />
                <Bar dataKey="Speed" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Strength" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Endurance" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Agility" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Accuracy" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Performance History Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Performance History Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-slate-900/80 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-bold">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Date</th>
                <th className="px-4 py-3">Speed</th>
                <th className="px-4 py-3">Strength</th>
                <th className="px-4 py-3">Endurance</th>
                <th className="px-4 py-3">Agility</th>
                <th className="px-4 py-3">Overall Score</th>
                <th className="px-4 py-3 rounded-r-xl">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                  <td className="px-4 py-3.5 font-bold text-gray-900 dark:text-white">{r.recorded_date}</td>
                  <td className="px-4 py-3.5 font-medium text-emerald-600 dark:text-emerald-400">{r.speed}</td>
                  <td className="px-4 py-3.5 font-medium text-blue-600 dark:text-blue-400">{r.strength}</td>
                  <td className="px-4 py-3.5 font-medium text-purple-600 dark:text-purple-400">{r.endurance}</td>
                  <td className="px-4 py-3.5 font-medium text-cyan-600 dark:text-cyan-400">{r.agility}</td>
                  <td className="px-4 py-3.5 font-black text-gray-900 dark:text-white">{r.overall_score}/100</td>
                  <td className="px-4 py-3.5 text-xs text-gray-500 dark:text-gray-400">{r.remarks || 'Regular log'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coach Log Modal */}
      <Modal isOpen={logModalOpen} onClose={() => setLogModalOpen(false)} title="Log Performance Evaluation">
        <form onSubmit={handleAddPerformance} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Speed (0-100)</label>
              <input
                type="number"
                value={formData.speed}
                onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Strength (0-100)</label>
              <input
                type="number"
                value={formData.strength}
                onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Endurance (0-100)</label>
              <input
                type="number"
                value={formData.endurance}
                onChange={(e) => setFormData({ ...formData, endurance: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Agility (0-100)</label>
              <input
                type="number"
                value={formData.agility}
                onChange={(e) => setFormData({ ...formData, agility: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Coach Assessment Remarks</label>
            <textarea
              rows="2"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
          >
            Submit Performance Log
          </button>
        </form>
      </Modal>
    </div>
  );
}
