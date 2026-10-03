import React, { useState } from 'react';
import { Settings, Sun, Moon, Lock, Bell, Shield, User, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function SettingsPage() {
  const { user, showToast } = useAuth();
  const { theme, setTheme } = useTheme();

  const [notifPrefs, setNotifPrefs] = useState({
    trainingReminders: true,
    competitionUpdates: true,
    performanceAlerts: true,
    emailDigest: false
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    showToast('Password changed successfully!', 'success');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header Bar */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Account & Portal Settings</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Configure theme appearance, notification alerts and security credentials</p>
      </div>

      {/* Theme Selection Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-slate-700">
          <Sun className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Theme & Visual Mode</h2>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition ${
              theme === 'light'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-600 font-bold'
                : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            <Sun className="w-6 h-6 text-amber-500" />
            <span className="text-xs">Light Mode</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition ${
              theme === 'dark'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-600 font-bold'
                : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            <Moon className="w-6 h-6 text-purple-400" />
            <span className="text-xs">Dark Mode</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition ${
              theme === 'system'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-600 font-bold'
                : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            <Settings className="w-6 h-6 text-blue-500" />
            <span className="text-xs">System Auto</span>
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-slate-700">
          <Bell className="w-5 h-5 text-emerald-500" />
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Notification Alert Preferences</h2>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-900 cursor-pointer">
            <span className="font-bold text-gray-800 dark:text-gray-200">Training Session Reminders & Schedule Changes</span>
            <input
              type="checkbox"
              checked={notifPrefs.trainingReminders}
              onChange={(e) => setNotifPrefs({ ...notifPrefs, trainingReminders: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-900 cursor-pointer">
            <span className="font-bold text-gray-800 dark:text-gray-200">Competition Registrations & Fixture Approvals</span>
            <input
              type="checkbox"
              checked={notifPrefs.competitionUpdates}
              onChange={(e) => setNotifPrefs({ ...notifPrefs, competitionUpdates: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-900 cursor-pointer">
            <span className="font-bold text-gray-800 dark:text-gray-200">Coach Performance Assessment & Rating Alerts</span>
            <input
              type="checkbox"
              checked={notifPrefs.performanceAlerts}
              onChange={(e) => setNotifPrefs({ ...notifPrefs, performanceAlerts: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded"
            />
          </label>
        </div>
      </div>

      {/* Password Change Form */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-slate-700">
          <Lock className="w-5 h-5 text-rose-500" />
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Security & Password</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-3 text-xs max-w-md">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">New Password</label>
            <input
              type="password"
              required
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
          >
            Update Security Password
          </button>
        </form>
      </div>
    </div>
  );
}
