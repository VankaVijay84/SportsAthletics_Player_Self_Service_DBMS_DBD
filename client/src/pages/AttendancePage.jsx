import React, { useState, useEffect } from 'react';
import { CalendarCheck, CheckCircle2, XCircle, Clock, Plus, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';
import CircularProgress from '../components/Common/CircularProgress';
import StatusBadge from '../components/Common/StatusBadge';
import Modal from '../components/Common/Modal';
import api from '../services/api';

export default function AttendancePage() {
  const { user, playerProfile, showToast } = useAuth();
  const [attendanceData, setAttendanceData] = useState({
    summary: { totalSessions: 5, present: 4, absent: 0, late: 1, attendancePercentage: 94 },
    records: []
  });
  const [loading, setLoading] = useState(true);
  const [markModalOpen, setMarkModalOpen] = useState(false);

  const [markForm, setMarkForm] = useState({
    session_id: 1,
    player_id: playerProfile?.id || 1,
    status: 'Present',
    notes: 'On-time arrival and complete participation.'
  });

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const targetId = playerProfile?.id || 1;
      const res = await api.get(`/training/attendance/${targetId}`);
      if (res.success) {
        setAttendanceData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [user, playerProfile]);

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/training/attendance', markForm);
      if (res.success) {
        showToast(`Attendance recorded! Updated rate: ${res.data.attendancePercentage}%`, 'success');
        setMarkModalOpen(false);
        fetchAttendance();
      }
    } catch (err) {
      showToast(err.message || 'Failed to record attendance', 'error');
    }
  };

  const monthlyChartData = [
    { month: 'Jun', Attendance: 90 },
    { month: 'Jul', Attendance: 92 },
    { month: 'Aug', Attendance: 95 },
    { month: 'Sep', Attendance: 94 }
  ];

  const summary = attendanceData.summary || { totalSessions: 5, present: 4, absent: 0, late: 1, attendancePercentage: 94 };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Attendance Tracking</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Track varsity training attendance, present count and session history</p>
        </div>

        {(user?.role === 'COACH' || user?.role === 'ADMIN' || user?.role === 'SPORTS_ADMIN') && (
          <button
            onClick={() => setMarkModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Mark Attendance Entry</span>
          </button>
        )}
      </div>

      {/* Top Section: Circular Progress Meter + Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Overall Attendance Rate</h2>
          <CircularProgress percentage={summary.attendancePercentage} size={160} strokeWidth={14} label="Rate" />
          <p className="text-xs text-gray-500 dark:text-gray-400">Minimum varsity threshold: 85%</p>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <CalendarCheck className="w-6 h-6 text-blue-600 mb-2" />
            <div>
              <p className="text-3xl font-black text-gray-900 dark:text-white">{summary.totalSessions}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">Total Sessions</p>
            </div>
          </div>
          <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-2" />
            <div>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{summary.present}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">Present Count</p>
            </div>
          </div>
          <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <Clock className="w-6 h-6 text-amber-600 mb-2" />
            <div>
              <p className="text-3xl font-black text-amber-600 dark:text-amber-400">{summary.late}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">Late Arrivals</p>
            </div>
          </div>
          <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <XCircle className="w-6 h-6 text-rose-600 mb-2" />
            <div>
              <p className="text-3xl font-black text-rose-600 dark:text-rose-400">{summary.absent}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">Absent Sessions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Monthly Attendance Progression</h2>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis domain={[0, 100]} stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
              <Bar dataKey="Attendance" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Attendance Logs Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-slate-900/80 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-bold">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Session Title</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-xl">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {attendanceData.records.length > 0 ? (
                attendanceData.records.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                    <td className="px-4 py-3.5 font-bold text-gray-900 dark:text-white">{r.title}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-500 dark:text-gray-400">{r.session_date} ({r.start_time})</td>
                    <td className="px-4 py-3.5 text-xs text-gray-500 dark:text-gray-400">{r.location}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3.5 text-xs text-gray-500 dark:text-gray-400">{r.notes || 'Normal attendance log'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-xs text-gray-400">No session attendance records logged yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mark Attendance Modal */}
      <Modal isOpen={markModalOpen} onClose={() => setMarkModalOpen(false)} title="Record Attendance Entry">
        <form onSubmit={handleMarkAttendance} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Session ID</label>
            <input
              type="number"
              value={markForm.session_id}
              onChange={(e) => setMarkForm({ ...markForm, session_id: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Attendance Status</label>
            <select
              value={markForm.status}
              onChange={(e) => setMarkForm({ ...markForm, status: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
            >
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Notes / Remarks</label>
            <input
              type="text"
              value={markForm.notes}
              onChange={(e) => setMarkForm({ ...markForm, notes: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
          >
            Save Attendance Record
          </button>
        </form>
      </Modal>
    </div>
  );
}
