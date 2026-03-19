import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  User, Lock, Bell, Palette, Building2, Shield,
  Camera, Save, Eye, EyeOff, Moon, Sun, Check, Loader2
} from 'lucide-react';
import { cn } from '../../utils/helpers';
import { useAuthStore } from '../../context/authStore';
import { useAppStore } from '../../context/appStore';
import { UserAvatar } from '../../components/UserAvatar';
import { Tabs, TabsContent } from '../../components/ui';
import { PROJECT_COLORS } from '../../app/constants';

const TAB_ITEMS = [
  { value: 'profile', label: 'Profile', icon: <User size={14} /> },
  { value: 'workspace', label: 'Workspace', icon: <Building2 size={14} /> },
  { value: 'security', label: 'Security', icon: <Lock size={14} /> },
  { value: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
  { value: 'appearance', label: 'Appearance', icon: <Palette size={14} /> },
];

interface ProfileForm {
  name: string;
  email: string;
  jobTitle: string;
  department: string;
  bio: string;
}

interface SecurityForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SettingRow: React.FC<{
  label: string;
  description?: string;
  children: React.ReactNode;
}> = ({ label, description, children }) => (
  <div className="flex items-start justify-between gap-6 py-4 border-b border-surface-100 dark:border-surface-800 last:border-0">
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{label}</p>
      {description && <p className="text-xs text-surface-400 mt-0.5 leading-relaxed">{description}</p>}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const { darkMode, toggleDarkMode, workspaces } = useAppStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [selectedColor, setSelectedColor] = useState(user?.color || PROJECT_COLORS[0]);

  const workspace = workspaces[0];

  const { register: registerProfile, handleSubmit: handleProfile } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      jobTitle: user?.jobTitle || '',
      department: user?.department || '',
    }
  });

  const { register: registerSecurity, handleSubmit: handleSecurity, formState: { errors: secErrors }, watch } = useForm<SecurityForm>();

  const onSaveProfile = async (data: ProfileForm) => {
    setSavingProfile(true);
    await new Promise(r => setTimeout(r, 800));
    updateUser({ name: data.name, jobTitle: data.jobTitle, department: data.department, color: selectedColor });
    setSavingProfile(false);
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 2000);
  };

  const onSaveSecurity = async (_data: SecurityForm) => {
    await new Promise(r => setTimeout(r, 600));
    alert('Password updated successfully');
  };

  const newPass = watch('newPassword', '');

  const [notifSettings, setNotifSettings] = useState({
    taskAssigned: true,
    taskCompleted: true,
    comments: true,
    deadlines: true,
    projectUpdates: false,
    weeklyDigest: true,
    emailNotifs: true,
    pushNotifs: false,
  });

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and workspace preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} items={TAB_ITEMS} variant="underline">
        {/* Profile Tab */}
        <TabsContent value="profile" className="pt-6">
          <form onSubmit={handleProfile(onSaveProfile)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Avatar card */}
              <div className="card p-5 flex flex-col items-center gap-4">
                <div className="relative">
                  <UserAvatar name={user.name} color={selectedColor} size="xl" />
                  <button type="button" className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center text-white shadow-sm hover:bg-brand-700 transition-colors">
                    <Camera size={13} />
                  </button>
                </div>
                <div className="text-center">
                  <p className="font-display font-semibold text-surface-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-surface-400 capitalize">{user.role.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-surface-500 mb-2 text-center">Profile color</p>
                  <div className="flex gap-1.5 flex-wrap justify-center">
                    {PROJECT_COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={cn('w-6 h-6 rounded-lg transition-all', selectedColor === c && 'ring-2 ring-offset-2 ring-brand-500 scale-110')}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Profile form */}
              <div className="lg:col-span-2 card p-5">
                <h3 className="font-display font-semibold text-surface-900 dark:text-white mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Full name</label>
                      <input {...registerProfile('name', { required: true })} className="input" />
                    </div>
                    <div>
                      <label className="label">Email</label>
                      <input {...registerProfile('email')} type="email" className="input bg-surface-50 dark:bg-surface-800" readOnly />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Job title</label>
                      <input {...registerProfile('jobTitle')} placeholder="e.g. Frontend Developer" className="input" />
                    </div>
                    <div>
                      <label className="label">Department</label>
                      <input {...registerProfile('department')} placeholder="e.g. Engineering" className="input" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Bio</label>
                    <textarea {...registerProfile('bio')} placeholder="Tell your teammates a bit about yourself..." className="input h-auto py-2 resize-none" rows={3} />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="submit" disabled={savingProfile} className="btn-primary btn-md">
                      {savingProfile ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : savedProfile ? (
                        <><Check size={16} /> Saved!</>
                      ) : (
                        <><Save size={15} /> Save changes</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </TabsContent>

        {/* Workspace Tab */}
        <TabsContent value="workspace" className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-5">
              <h3 className="font-display font-semibold text-surface-900 dark:text-white mb-4">Workspace Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Workspace name</label>
                  <input defaultValue={workspace.name} className="input" />
                </div>
                <div>
                  <label className="label">Workspace URL</label>
                  <div className="flex items-center">
                    <span className="px-3 h-10 bg-surface-50 dark:bg-surface-800 border border-r-0 border-surface-200 dark:border-surface-700 rounded-l-xl text-sm text-surface-400 flex items-center">
                      app.flowboard.io/
                    </span>
                    <input defaultValue={workspace.slug} className="input rounded-l-none border-l-0 flex-1" />
                  </div>
                </div>
                <div>
                  <label className="label">Plan</label>
                  <div className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800 rounded-xl border border-surface-100 dark:border-surface-700">
                    <div>
                      <p className="text-sm font-medium text-surface-800 dark:text-surface-200 capitalize">{workspace.plan} Plan</p>
                      <p className="text-xs text-surface-400">{workspace.membersCount} members</p>
                    </div>
                    <button className="btn-primary btn-sm">Upgrade</button>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button className="btn-primary btn-md"><Save size={15} /> Save</button>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-display font-semibold text-surface-900 dark:text-white mb-4">Danger Zone</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20">
                  <p className="text-sm font-medium text-rose-800 dark:text-rose-300">Delete Workspace</p>
                  <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-1">This will permanently delete all projects, tasks, and data.</p>
                  <button className="btn-danger btn-sm mt-3">Delete workspace</button>
                </div>
                <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Export Data</p>
                  <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">Download all workspace data as a JSON/CSV export.</p>
                  <button className="btn-secondary btn-sm mt-3">Export all data</button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-5">
              <h3 className="font-display font-semibold text-surface-900 dark:text-white mb-4">Change Password</h3>
              <form onSubmit={handleSecurity(onSaveSecurity)} className="space-y-4">
                <div>
                  <label className="label">Current password</label>
                  <div className="relative">
                    <input
                      {...registerSecurity('currentPassword', { required: true })}
                      type={showCurrent ? 'text' : 'password'}
                      className="input pr-10"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400">
                      {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="label">New password</label>
                  <div className="relative">
                    <input
                      {...registerSecurity('newPassword', { required: true, minLength: 8 })}
                      type={showNew ? 'text' : 'password'}
                      className="input pr-10"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400">
                      {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="label">Confirm new password</label>
                  <input
                    {...registerSecurity('confirmPassword', {
                      required: true,
                      validate: v => v === newPass || 'Passwords do not match'
                    })}
                    type="password"
                    className={cn('input', secErrors.confirmPassword && 'border-rose-400')}
                    placeholder="••••••••"
                  />
                  {secErrors.confirmPassword && (
                    <p className="mt-1 text-xs text-rose-500">{secErrors.confirmPassword.message}</p>
                  )}
                </div>
                <button type="submit" className="btn-primary btn-md w-full">
                  <Lock size={15} /> Update password
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <div className="card p-5">
                <h3 className="font-display font-semibold text-surface-900 dark:text-white mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-surface-700 dark:text-surface-300">Authenticator App</p>
                    <p className="text-xs text-surface-400">Use an authenticator app for 2FA</p>
                  </div>
                  <span className="badge-gray text-xs">Not set up</span>
                </div>
                <button className="btn-secondary btn-sm w-full"><Shield size={13} /> Enable 2FA</button>
              </div>

              <div className="card p-5">
                <h3 className="font-display font-semibold text-surface-900 dark:text-white mb-3">Active Sessions</h3>
                <div className="space-y-3">
                  {[
                    { device: 'Chrome on macOS', location: 'San Francisco, US', time: 'Now', current: true },
                    { device: 'Safari on iPhone', location: 'San Francisco, US', time: '2h ago', current: false },
                    { device: 'Firefox on Windows', location: 'New York, US', time: '3d ago', current: false },
                  ].map(session => (
                    <div key={session.device} className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800">
                      <div>
                        <p className="text-xs font-medium text-surface-700 dark:text-surface-300">{session.device}</p>
                        <p className="text-[11px] text-surface-400">{session.location} · {session.time}</p>
                      </div>
                      {session.current ? (
                        <span className="badge-green text-[10px]">Current</span>
                      ) : (
                        <button className="text-xs text-rose-500 hover:text-rose-600 font-medium">Revoke</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="pt-6">
          <div className="card p-5 max-w-2xl">
            <h3 className="font-display font-semibold text-surface-900 dark:text-white mb-4">Notification Preferences</h3>
            <div>
              <p className="section-title mb-3">In-App Notifications</p>
              {[
                { key: 'taskAssigned', label: 'Task assigned to me', description: 'When someone assigns a task to you' },
                { key: 'taskCompleted', label: 'Task completed', description: 'When a task you created is marked done' },
                { key: 'comments', label: 'Comments on my tasks', description: 'When someone comments on your task' },
                { key: 'deadlines', label: 'Upcoming deadlines', description: '24 hours before a task is due' },
                { key: 'projectUpdates', label: 'Project updates', description: 'Status changes on your projects' },
              ].map(item => (
                <SettingRow key={item.key} label={item.label} description={item.description}>
                  <button
                    onClick={() => setNotifSettings(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                    className={cn(
                      'relative w-10 h-6 rounded-full transition-colors',
                      notifSettings[item.key as keyof typeof notifSettings] ? 'bg-brand-600' : 'bg-surface-200 dark:bg-surface-700'
                    )}
                  >
                    <span className={cn(
                      'absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform',
                      notifSettings[item.key as keyof typeof notifSettings] ? 'left-5' : 'left-1'
                    )} />
                  </button>
                </SettingRow>
              ))}

              <p className="section-title mt-6 mb-3">Email & Push</p>
              {[
                { key: 'weeklyDigest', label: 'Weekly digest', description: 'Summary of your team\'s activity every Monday' },
                { key: 'emailNotifs', label: 'Email notifications', description: 'Receive important notifications via email' },
                { key: 'pushNotifs', label: 'Push notifications', description: 'Browser push notifications' },
              ].map(item => (
                <SettingRow key={item.key} label={item.label} description={item.description}>
                  <button
                    onClick={() => setNotifSettings(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                    className={cn(
                      'relative w-10 h-6 rounded-full transition-colors',
                      notifSettings[item.key as keyof typeof notifSettings] ? 'bg-brand-600' : 'bg-surface-200 dark:bg-surface-700'
                    )}
                  >
                    <span className={cn(
                      'absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform',
                      notifSettings[item.key as keyof typeof notifSettings] ? 'left-5' : 'left-1'
                    )} />
                  </button>
                </SettingRow>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="pt-6">
          <div className="max-w-2xl space-y-6">
            <div className="card p-5">
              <h3 className="font-display font-semibold text-surface-900 dark:text-white mb-4">Theme</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light', label: 'Light', icon: <Sun size={20} /> },
                  { value: 'dark', label: 'Dark', icon: <Moon size={20} /> },
                  { value: 'system', label: 'System', icon: <div className="w-5 h-5 rounded-full bg-gradient-to-r from-white to-gray-900 border border-gray-200" /> },
                ].map(theme => {
                  const isActive = (theme.value === 'dark') === darkMode || (theme.value === 'system' && false);
                  return (
                    <button
                      key={theme.value}
                      onClick={() => theme.value !== 'system' && !isActive && toggleDarkMode()}
                      className={cn(
                        'flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all',
                        isActive
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30'
                          : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                      )}
                    >
                      <div className={cn('text-surface-500', isActive && 'text-brand-600')}>{theme.icon}</div>
                      <span className={cn('text-sm font-medium', isActive ? 'text-brand-700 dark:text-brand-300' : 'text-surface-600 dark:text-surface-400')}>
                        {theme.label}
                      </span>
                      {isActive && <Check size={14} className="text-brand-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-display font-semibold text-surface-900 dark:text-white mb-4">Display Density</h3>
              <div className="grid grid-cols-3 gap-3">
                {['Compact', 'Default', 'Comfortable'].map((density, i) => (
                  <button
                    key={density}
                    className={cn(
                      'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
                      i === 1
                        ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20'
                        : 'border-surface-200 dark:border-surface-700 hover:border-surface-300'
                    )}
                  >
                    <div className="space-y-1 w-8">
                      {Array.from({ length: i === 0 ? 4 : i === 1 ? 3 : 2 }).map((_, j) => (
                        <div key={j} className="h-1 bg-current rounded-full opacity-30" />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-surface-600 dark:text-surface-400">{density}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-display font-semibold text-surface-900 dark:text-white mb-4">Language & Region</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Language</label>
                  <select className="input">
                    <option>English (US)</option>
                    <option>French</option>
                    <option>Spanish</option>
                    <option>German</option>
                  </select>
                </div>
                <div>
                  <label className="label">Timezone</label>
                  <select className="input">
                    <option>UTC-8 (Pacific)</option>
                    <option>UTC-5 (Eastern)</option>
                    <option>UTC+0 (GMT)</option>
                    <option>UTC+1 (CET)</option>
                  </select>
                </div>
                <div>
                  <label className="label">Date format</label>
                  <select className="input">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="label">Start of week</label>
                  <select className="input">
                    <option>Monday</option>
                    <option>Sunday</option>
                    <option>Saturday</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
