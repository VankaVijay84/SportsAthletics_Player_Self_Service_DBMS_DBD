import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy, Activity, CalendarCheck, Award, Shield, ArrowUpRight,
  TrendingUp, Clock, MapPin, CheckCircle2, ChevronRight, User, Dumbbell, Users
} from 'lucide-react';
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import CircularProgress from '../components/Common/CircularProgress';
import StatusBadge from '../components/Common/StatusBadge';
import api from '../services/api';

export default function DashboardPage() {
  const { user, playerProfile, loadUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    trainingSessions: 5,
    attendancePct: 94,
    competitions: 3,
    achievements: 4,
    performanceScore: 88,
    fitnessScore: 89
  });

  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [performanceRadarData, setPerformanceRadarData] = useState([
    { metric: 'Speed', score: 91, fullMark: 100 },
    { metric: 'Strength', score: 85, fullMark: 100 },
    { metric: 'Endurance', score: 89, fullMark: 100 },
    { metric: 'Agility', score: 88, fullMark: 100 },
    { metric: 'Flexibility', score: 80, fullMark: 100 },
    { metric: 'Accuracy', score: 92, fullMark: 100 }
  ]);

  const [adminStats, setAdminStats] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        if (user?.role === 'PLAYER' && playerProfile?.id) {
          const [trainRes, compRes, achRes, perfRes, attRes] = await Promise.all([
            api.get('/training?status=Upcoming'),
            api.get(`/competitions`),
            api.get(`/competitions/achievements/${playerProfile.id}`),
            api.get(`/performance/${playerProfile.id}`),
            api.get(`/training/attendance/${playerProfile.id}`)
          ]);

          if (trainRes.success) setUpcomingSessions(trainRes.data.slice(0, 3));
          if (achRes.success) {
            setStats(prev => ({ ...prev, achievements: achRes.data.length }));
          }
          if (attRes.success && attRes.data.summary) {
            setStats(prev => ({
              ...prev,
              attendancePct: attRes.data.summary.attendancePercentage,
              trainingSessions: attRes.data.summary.totalSessions
            }));
          }
          if (perfRes.success && perfRes.data.length > 0) {
            const latest = perfRes.data[perfRes.data.length - 1];
            setStats(prev => ({ ...prev, performanceScore: latest.overall_score || 88 }));
            setPerformanceRadarData([
              { metric: 'Speed', score: latest.speed || 85, fullMark: 100 },
              { metric: 'Strength', score: latest.strength || 80, fullMark: 100 },
              { metric: 'Endurance', score: latest.endurance || 85, fullMark: 100 },
              { metric: 'Agility', score: latest.agility || 88, fullMark: 100 },
              { metric: 'Flexibility', score: latest.flexibility || 80, fullMark: 100 },
              { metric: 'Accuracy', score: latest.accuracy || 90, fullMark: 100 }
            ]);
          }
        } else if (user?.role === 'ADMIN' || user?.role === 'SPORTS_ADMIN' || user?.role === 'COACH') {
          const res = await api.get('/admin/stats');
          if (res.success) setAdminStats(res.data);
          const tRes = await api.get('/training');
          if (tRes.success) setUpcomingSessions(tRes.data.slice(0, 3));
        }

        // Dummy activity feed
        setRecentActivities([
          { id: 1, title: 'Performance Updated', desc: 'Coach Rahul updated overall performance score to 88/100', time: '2 hours ago', icon: Activity, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' },
          { id: 2, title: 'Training Completed', desc: 'Set Piece Specialization session attended', time: 'Yesterday', icon: Dumbbell, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/50' },
          { id: 3, title: 'Competition Registered', desc: 'Registered for All India Inter-University Football Cup', time: '3 days ago', icon: Trophy, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/50' },
          { id: 4, title: 'Achievement Unlocked', desc: 'Man of the Match Gold Medal published to profile', time: '1 week ago', icon: Award, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' }
        ]);
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, playerProfile]);

  const playerName = playerProfile?.full_name || user?.full_name || 'Vijay Kumar';
  const playerCode = playerProfile?.player_id_code || 'ATH001';
  const sportName = playerProfile?.sport_name || 'Football';
  const teamName = playerProfile?.team_name || 'University Eagles FC';
  const profileCompletion = playerProfile?.profile_completion || 90;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-6 md:p-8 shadow-xl shadow-emerald-600/15">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide">
              <span>{user?.role === 'PLAYER' ? 'Athlete Self-Service' : `${user?.role} Control Hub`}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>2026 Varsity Season</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Good morning, {playerName.split(' ')[0]}! ⚽
            </h1>
            <p className="text-sm text-emerald-100 font-medium">
              Player ID: <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-lg">{playerCode}</span> • {sportName} • {teamName}
            </p>
          </div>

          {/* Profile Completion Card Widget */}
          <div className="w-full md:w-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 min-w-[240px]">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg text-white">
              {profileCompletion}%
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-emerald-100">Profile Completion</p>
              <div className="w-full bg-black/20 h-2 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-white h-full rounded-full transition-all duration-700" style={{ width: `${profileCompletion}%` }}></div>
              </div>
              <button
                onClick={() => navigate('/profile')}
                className="text-[11px] font-bold text-white underline mt-1 block hover:text-emerald-200"
              >
                Complete Remaining Details →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin / Coach System Overview Bar (If logged in as Admin/Coach) */}
      {(user?.role === 'ADMIN' || user?.role === 'SPORTS_ADMIN' || user?.role === 'COACH') && adminStats && (
        <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2 text-emerald-400">
              <Users className="w-5 h-5" /> Administrative Management Overview
            </h2>
            <span className="text-xs text-slate-400 font-medium">System Metrics & Roster Summary</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <p className="text-xl font-black text-emerald-400">{adminStats.totalPlayers}</p>
              <p className="text-xs text-slate-400 font-medium">Total Players</p>
            </div>
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <p className="text-xl font-black text-blue-400">{adminStats.totalCoaches}</p>
              <p className="text-xs text-slate-400 font-medium">Coaches</p>
            </div>
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <p className="text-xl font-black text-purple-400">{adminStats.totalSports}</p>
              <p className="text-xs text-slate-400 font-medium">Active Sports</p>
            </div>
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <p className="text-xl font-black text-amber-400">{adminStats.totalTeams}</p>
              <p className="text-xs text-slate-400 font-medium">Teams</p>
            </div>
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <p className="text-xl font-black text-rose-400">{adminStats.avgAttendance}%</p>
              <p className="text-xs text-slate-400 font-medium">Avg Attendance</p>
            </div>
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <p className="text-xl font-black text-cyan-400">{adminStats.avgPerformance}</p>
              <p className="text-xs text-slate-400 font-medium">Avg Score</p>
            </div>
          </div>
        </div>
      )}

      {/* Primary Statistics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Training Sessions */}
        <div
          onClick={() => navigate('/training')}
          className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Dumbbell className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition" />
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.trainingSessions}</p>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">Training Sessions</p>
        </div>

        {/* Attendance % */}
        <div
          onClick={() => navigate('/attendance')}
          className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
              High
            </span>
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.attendancePct}%</p>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">Attendance Rate</p>
        </div>

        {/* Competitions */}
        <div
          onClick={() => navigate('/competitions')}
          className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition" />
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.competitions}</p>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">Competitions</p>
        </div>

        {/* Achievements */}
        <div
          onClick={() => navigate('/achievements')}
          className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition" />
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.achievements}</p>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">Achievements</p>
        </div>

        {/* Performance Score */}
        <div
          onClick={() => navigate('/performance')}
          className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60 px-1.5 py-0.5 rounded">
              Index
            </span>
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.performanceScore}/100</p>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">Performance Score</p>
        </div>

        {/* Fitness Score */}
        <div
          onClick={() => navigate('/fitness')}
          className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-rose-500 transition" />
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.fitnessScore}/100</p>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">Fitness Rating</p>
        </div>
      </div>

      {/* Main Content Grid: Performance Chart + Schedule & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2-Cols: Interactive Recharts Performance Radar */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Athlete Performance Radar</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Multi-attribute athletic evaluation scores</p>
            </div>
            <button
              onClick={() => navigate('/performance')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              View Full History →
            </button>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceRadarData}>
                <PolarGrid stroke="#94a3b8" strokeDasharray="3 3" opacity={0.4} />
                <PolarAngleAxis dataKey="metric" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" />
                <Radar name="Vijay Kumar" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1-Col: Attendance Summary Widget */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Attendance Meter</h2>
            <StatusBadge status="Verified" />
          </div>

          <CircularProgress percentage={stats.attendancePct} size={150} strokeWidth={12} label="Present Rate" />

          <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-gray-100 dark:border-slate-700">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">46</p>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Present</p>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded-xl">
              <p className="text-lg font-black text-amber-600 dark:text-amber-400">1</p>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Late</p>
            </div>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/40 rounded-xl">
              <p className="text-lg font-black text-rose-600 dark:text-rose-400">3</p>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Absent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Upcoming Training & Matches + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Schedule */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Training & Matches</h2>
            </div>
            <button
              onClick={() => navigate('/training')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Full Calendar →
            </button>
          </div>

          <div className="space-y-3">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700/60 flex items-center justify-between gap-4 hover:border-emerald-500 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={session.status || 'Upcoming'} />
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{session.session_type}</span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">{session.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {session.session_date} ({session.start_time})</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {session.location}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/training')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition flex-shrink-0"
                  >
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-6">No upcoming sessions scheduled.</p>
            )}
          </div>
        </div>

        {/* Recent Activity Stream */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Portal Activity</h2>
            <span className="text-xs font-medium text-gray-400">Real-time Activity Stream</span>
          </div>

          <div className="space-y-4">
            {recentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="flex items-start gap-3.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${act.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{act.title}</p>
                      <span className="text-[11px] text-gray-400 font-medium">{act.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{act.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
