import React, { useState, useEffect } from 'react';
import { Shield, Activity, Heart, Flame, Plus, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Common/Modal';
import api from '../services/api';

export default function FitnessPage() {
  const { user, playerProfile, showToast } = useAuth();
  const [fitnessLogs, setFitnessLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logModalOpen, setLogModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    player_id: playerProfile?.id || 1,
    height_cm: 178,
    weight_kg: 72.5,
    body_fat_percentage: 12.0,
    resting_hr: 56,
    vo2_max: 56.5,
    flexibility_score: 85,
    strength_score: 86
  });

  const fetchFitness = async () => {
    setLoading(true);
    try {
      const targetId = playerProfile?.id || 1;
      const res = await api.get(`/performance/fitness/${targetId}`);
      if (res.success) {
        setFitnessLogs(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFitness();
  }, [user, playerProfile]);

  const handleAddFitness = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/performance/fitness', formData);
      if (res.success) {
        showToast(`Fitness entry logged! BMI: ${res.data.bmi} | Score: ${res.data.fitness_score}`, 'success');
        setLogModalOpen(false);
        fetchFitness();
      }
    } catch (err) {
      showToast(err.message || 'Failed to log fitness entry', 'error');
    }
  };

  const latest = fitnessLogs[fitnessLogs.length - 1] || {
    height_cm: 178, weight_kg: 72.5, bmi: 22.88, body_fat_percentage: 11.8, resting_hr: 56, vo2_max: 56.5, fitness_score: 89
  };

  const chartData = fitnessLogs.map(f => ({
    date: f.recorded_date,
    Weight: f.weight_kg,
    BMI: f.bmi,
    VO2Max: f.vo2_max,
    Score: f.fitness_score
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Fitness & Physiological Metrics</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Body composition analysis, VO2 Max endurance and cardiovascular health stats</p>
        </div>

        <button
          onClick={() => setLogModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Log Assessment</span>
        </button>
      </div>

      {/* Fitness Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-gray-400">Body Mass (Kg)</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{latest.weight_kg} kg</p>
          <span className="text-[10px] text-emerald-600 font-bold">Optimal Range</span>
        </div>
        <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-gray-400">BMI Index</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{latest.bmi}</p>
          <span className="text-[10px] text-gray-400 font-semibold">Normal (18.5 - 24.9)</span>
        </div>
        <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-gray-400">Body Fat %</span>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{latest.body_fat_percentage}%</p>
          <span className="text-[10px] text-blue-600 font-bold">Athletic Tier</span>
        </div>
        <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-gray-400">Resting HR</span>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{latest.resting_hr} bpm</p>
          <span className="text-[10px] text-rose-600 font-bold">Bradycardia Good</span>
        </div>
        <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-gray-400">VO2 Max</span>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{latest.vo2_max}</p>
          <span className="text-[10px] text-purple-600 font-bold">Elite Aerobic</span>
        </div>
        <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-gray-400">Fitness Rating</span>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{latest.fitness_score}/100</p>
          <span className="text-[10px] text-amber-600 font-bold">Varsity Ready</span>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Fitness & VO2 Max Historical Trend</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis domain={[15, 100]} stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
              <Line type="monotone" dataKey="Score" stroke="#f59e0b" strokeWidth={3} />
              <Line type="monotone" dataKey="VO2Max" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="BMI" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Log Assessment Modal */}
      <Modal isOpen={logModalOpen} onClose={() => setLogModalOpen(false)} title="Log Physical Assessment">
        <form onSubmit={handleAddFitness} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Height (cm)</label>
              <input
                type="number"
                value={formData.height_cm}
                onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weight_kg}
                onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Body Fat %</label>
              <input
                type="number"
                step="0.1"
                value={formData.body_fat_percentage}
                onChange={(e) => setFormData({ ...formData, body_fat_percentage: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Resting Heart Rate (bpm)</label>
              <input
                type="number"
                value={formData.resting_hr}
                onChange={(e) => setFormData({ ...formData, resting_hr: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">VO2 Max Score</label>
              <input
                type="number"
                step="0.1"
                value={formData.vo2_max}
                onChange={(e) => setFormData({ ...formData, vo2_max: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
          >
            Calculate & Save Assessment
          </button>
        </form>
      </Modal>
    </div>
  );
}
