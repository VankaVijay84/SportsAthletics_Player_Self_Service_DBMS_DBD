import React, { useState, useEffect } from 'react';
import { Dumbbell, Clock, MapPin, User, Plus, Filter, CheckCircle2, Calendar, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/Common/StatusBadge';
import Modal from '../components/Common/Modal';
import api from '../services/api';

export default function TrainingPage() {
  const { user, playerProfile, showToast } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const [newSession, setNewSession] = useState({
    title: '',
    sport_id: playerProfile?.sport_id || 1,
    team_id: playerProfile?.team_id || 1,
    session_date: '',
    start_time: '07:00',
    end_time: '09:00',
    location: 'Main Sports Stadium Field 1',
    session_type: 'Tactical & Conditioning',
    instructions: 'Bring hydration packs and full varsity kit.'
  });

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/training');
      if (res.success) {
        setSessions(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/training', newSession);
      if (res.success) {
        showToast('Training session scheduled successfully!', 'success');
        setCreateModalOpen(false);
        fetchSessions();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create training session', 'error');
    }
  };

  const handleConfirmRSVP = async (sessionId) => {
    try {
      const playerId = playerProfile?.id || 1;
      const res = await api.post('/training/attendance', {
        session_id: sessionId,
        player_id: playerId,
        status: 'Present',
        notes: 'Self-confirmed via Player Self-Service Portal'
      });
      if (res.success) {
        showToast('Attendance RSVP confirmed!', 'success');
        setDetailModalOpen(false);
      }
    } catch (err) {
      showToast(err.message || 'Failed to confirm attendance', 'error');
    }
  };

  const filteredSessions = activeFilter === 'All'
    ? sessions
    : sessions.filter(s => s.status === activeFilter);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Training Schedule & Management</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">View upcoming drills, confirm attendance RSVP and review tactical notes</p>
        </div>

        {(user?.role === 'COACH' || user?.role === 'ADMIN' || user?.role === 'SPORTS_ADMIN') && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Session</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['All', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeFilter === tab
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            {tab} Sessions
          </button>
        ))}
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((s) => (
          <div
            key={s.id}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <StatusBadge status={s.status} />
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  {s.session_type}
                </span>
              </div>

              <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug">{s.title}</h3>

              <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <span>{s.session_date} ({s.start_time} - {s.end_time || '09:00'})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>{s.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-500" />
                  <span>Coach: {s.coach_name || 'Rahul Dravid'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
              <button
                onClick={() => { setSelectedSession(s); setDetailModalOpen(true); }}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" /> View Instructions
              </button>
              {s.status === 'Upcoming' && (
                <button
                  onClick={() => handleConfirmRSVP(s.id)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition"
                >
                  Confirm RSVP
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      <Modal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} title="Training Session Details">
        {selectedSession && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">{selectedSession.title}</h4>
                <StatusBadge status={selectedSession.status} />
              </div>
              <p className="text-gray-500">Date: {selectedSession.session_date} | Time: {selectedSession.start_time}</p>
              <p className="text-gray-500">Location: {selectedSession.location}</p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-gray-700 dark:text-gray-300">Coach Tactical Notes & Instructions:</span>
              <p className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 rounded-xl leading-relaxed">
                {selectedSession.instructions || 'Focus on tactical positioning, warm-up sprint sets and hydration drills.'}
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => handleConfirmRSVP(selectedSession.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs"
              >
                Confirm Attendance RSVP
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Schedule Session Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Schedule Training Session">
        <form onSubmit={handleCreateSession} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Session Title</label>
            <input
              type="text"
              required
              value={newSession.title}
              onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
              placeholder="e.g. High-Intensity Tactical Drills"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Session Date</label>
              <input
                type="date"
                required
                value={newSession.session_date}
                onChange={(e) => setNewSession({ ...newSession, session_date: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={newSession.start_time}
                onChange={(e) => setNewSession({ ...newSession, start_time: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input
              type="text"
              required
              value={newSession.location}
              onChange={(e) => setNewSession({ ...newSession, location: e.target.value })}
              placeholder="e.g. Main Sports Stadium Field 1"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Tactical Instructions</label>
            <textarea
              rows="3"
              value={newSession.instructions}
              onChange={(e) => setNewSession({ ...newSession, instructions: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
          >
            Publish Training Session
          </button>
        </form>
      </Modal>
    </div>
  );
}
