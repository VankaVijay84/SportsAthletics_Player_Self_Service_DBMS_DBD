import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Calendar, MapPin, Shield, Trophy, Activity,
  Award, Edit3, Camera, CheckCircle2, ChevronRight, Sparkles, Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Common/Modal';
import CircularProgress from '../components/Common/CircularProgress';
import api from '../services/api';

export default function ProfilePage() {
  const { user, playerProfile, loadUser, showToast } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Avatar presets
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
  ];

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    dob: '',
    gender: 'Male',
    address: '',
    emergency_contact: '',
    position: 'Attacking Midfielder',
    jersey_number: '10',
    playing_level: 'University Varsity',
    experience_years: '3',
    avatar_url: ''
  });

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const targetId = playerProfile?.id || user?.id || 1;
      const res = await api.get(`/players/${targetId}`);
      if (res.success) {
        setProfileData(res.data);
        setFormData({
          full_name: res.data.full_name || '',
          phone: res.data.phone || '',
          dob: res.data.dob || '',
          gender: res.data.gender || 'Male',
          address: res.data.address || '',
          emergency_contact: res.data.emergency_contact || '',
          position: res.data.position || '',
          jersey_number: res.data.jersey_number || '',
          playing_level: res.data.playing_level || '',
          experience_years: res.data.experience_years || '',
          avatar_url: res.data.avatar_url || ''
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user, playerProfile]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const targetId = profileData?.id || 1;
      const res = await api.put(`/players/${targetId}`, formData);
      if (res.success) {
        showToast('Profile updated successfully!', 'success');
        setEditModalOpen(false);
        fetchProfile();
        loadUser();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    }
  };

  const p = profileData || {
    full_name: 'Vijay Kumar',
    player_id_code: 'ATH001',
    email: 'vijay@university.edu',
    phone: '+91 98123 45678',
    dob: '2003-05-14',
    gender: 'Male',
    address: 'Campus Hostel Block A, Room 402',
    emergency_contact: 'Mr. Suresh Kumar (+91 94111 22233)',
    sport_name: 'Football',
    team_name: 'University Eagles FC',
    coach_name: 'Rahul Dravid',
    position: 'Attacking Midfielder',
    jersey_number: 10,
    playing_level: 'University Varsity',
    experience_years: 3,
    profile_completion: 90,
    performance_score: 88,
    attendance_percentage: 94
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Player Self-Service Profile</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Manage personal credentials, sports info and varsity status</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Player Identity Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col items-center text-center space-y-6">
          <div className="relative group">
            <img
              src={p.avatar_url || user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
              alt={p.full_name}
              className="w-32 h-32 rounded-full object-cover border-4 border-emerald-500 shadow-xl"
            />
            <button
              onClick={() => setEditModalOpen(true)}
              className="absolute bottom-0 right-0 p-2 bg-emerald-600 text-white rounded-full shadow-lg hover:scale-110 transition"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">{p.full_name}</h2>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mt-0.5">
              Player ID: {p.player_id_code}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{p.sport_name} • {p.team_name}</p>
          </div>

          <div className="w-full pt-4 border-t border-gray-100 dark:border-slate-700 space-y-3">
            <CircularProgress percentage={p.profile_completion || 90} size={110} strokeWidth={9} label="Completion" />
          </div>

          {/* Quick Metrics */}
          <div className="w-full grid grid-cols-3 gap-2 text-center pt-2">
            <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl">
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{p.performance_score || 88}</p>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Performance</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl">
              <p className="text-lg font-black text-blue-600 dark:text-blue-400">{p.attendance_percentage || 94}%</p>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Attendance</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl">
              <p className="text-lg font-black text-amber-600 dark:text-amber-400">#{p.jersey_number || 10}</p>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Jersey</p>
            </div>
          </div>

          <div className="w-full pt-4 space-y-2">
            <button
              onClick={() => navigate('/performance')}
              className="w-full py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-bold text-xs flex items-center justify-between transition"
            >
              <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-500" /> View Performance Metrics</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/achievements')}
              className="w-full py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-amber-50 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-bold text-xs flex items-center justify-between transition"
            >
              <span className="flex items-center gap-2"><Award className="w-4 h-4 text-amber-500" /> View Trophy & Achievements</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right 2-Cols: Detailed Personal & Sports Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sports Information Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-slate-700">
              <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Sports & Athletic Credentials</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-900">
                <span className="text-xs text-gray-400 font-semibold uppercase">Sport Branch</span>
                <p className="font-bold text-gray-900 dark:text-white mt-0.5">{p.sport_name}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-900">
                <span className="text-xs text-gray-400 font-semibold uppercase">Assigned Team</span>
                <p className="font-bold text-gray-900 dark:text-white mt-0.5">{p.team_name}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-900">
                <span className="text-xs text-gray-400 font-semibold uppercase">Playing Position</span>
                <p className="font-bold text-gray-900 dark:text-white mt-0.5">{p.position}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-900">
                <span className="text-xs text-gray-400 font-semibold uppercase">Head Coach</span>
                <p className="font-bold text-gray-900 dark:text-white mt-0.5">{p.coach_name || 'Rahul Dravid'}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-900">
                <span className="text-xs text-gray-400 font-semibold uppercase">Competition Level</span>
                <p className="font-bold text-gray-900 dark:text-white mt-0.5">{p.playing_level}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-900">
                <span className="text-xs text-gray-400 font-semibold uppercase">Experience</span>
                <p className="font-bold text-gray-900 dark:text-white mt-0.5">{p.experience_years} Years Active</p>
              </div>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-slate-700">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-900">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-xs text-gray-400 font-semibold uppercase">University Email</span>
                  <p className="font-bold text-gray-900 dark:text-white">{p.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-900">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-xs text-gray-400 font-semibold uppercase">Contact Phone</span>
                  <p className="font-bold text-gray-900 dark:text-white">{p.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-900">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-xs text-gray-400 font-semibold uppercase">Date of Birth</span>
                  <p className="font-bold text-gray-900 dark:text-white">{p.dob} ({p.gender})</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-900">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-xs text-gray-400 font-semibold uppercase">Hostel / Address</span>
                  <p className="font-bold text-gray-900 dark:text-white truncate">{p.address}</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 flex items-center gap-3">
              <Heart className="w-5 h-5 text-rose-500" />
              <div>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase">Emergency Contact Info</span>
                <p className="font-bold text-sm text-gray-900 dark:text-white">{p.emergency_contact}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Player Information">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Select Avatar Photo</label>
            <div className="flex gap-2 mb-2">
              {avatarPresets.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="Avatar option"
                  onClick={() => setFormData({ ...formData, avatar_url: url })}
                  className={`w-12 h-12 rounded-full object-cover cursor-pointer border-2 transition ${formData.avatar_url === url ? 'border-emerald-500 scale-105' : 'border-transparent opacity-70'}`}
                />
              ))}
            </div>
            <input
              type="text"
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              placeholder="Or paste custom image URL"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs outline-none text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Jersey Number</label>
              <input
                type="number"
                value={formData.jersey_number}
                onChange={(e) => setFormData({ ...formData, jersey_number: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Hostel Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs outline-none text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Emergency Contact</label>
            <input
              type="text"
              value={formData.emergency_contact}
              onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs outline-none text-gray-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition"
          >
            Save Updated Profile
          </button>
        </form>
      </Modal>
    </div>
  );
}
