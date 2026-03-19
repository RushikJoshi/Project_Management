import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Mail, Save, Globe, Shield, Bell, Key, Database, Server, Cpu } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { Tabs, TabsContent } from '../../components/ui';

const TAB_ITEMS = [
  { value: 'general', label: 'General', icon: <Globe size={14} /> },
  { value: 'email', label: 'Email Setup', icon: <Mail size={14} /> },
  { value: 'security', label: 'Security', icon: <Shield size={14} /> },
  { value: 'infrastructure', label: 'System Health', icon: <Server size={14} /> },
];

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Site Settings</h1>
          <p className="page-subtitle">Manage your platform info, security, and emails</p>
        </div>
        <div className="flex gap-2">
            <button className="btn-secondary btn-sm">Clear Cache</button>
            <button className="btn-primary btn-sm px-6">Save Changes</button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} items={TAB_ITEMS} variant="underline">
        {/* General Tab */}
        <TabsContent value="general" className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <h3 className="font-display font-bold text-surface-900 dark:text-white mb-4">Site Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="md:col-span-2">
                    <label className="label">Site Name</label>
                    <input defaultValue="Flowboard SaaS" className="input" />
                  </div>
                  <div>
                    <label className="label">Support Email address</label>
                    <input defaultValue="support@flowboard.io" className="input" />
                  </div>
                  <div>
                    <label className="label">Admin Email address</label>
                    <input defaultValue="admin@flowboard.io" className="input" />
                  </div>
                  <div>
                    <label className="label">Site Language</label>
                    <select className="input">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Time Zone</label>
                    <select className="input">
                      <option>UTC (GMT)</option>
                      <option>PST (Pacific)</option>
                      <option>EST (Eastern)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="font-display font-bold text-surface-900 dark:text-white mb-4">New User & Login</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-surface-50 dark:border-surface-800">
                    <div>
                      <p className="text-sm font-medium text-surface-800 dark:text-surface-200">Open Registration</p>
                      <p className="text-[10px] text-surface-400">Allow anyone to join without invite</p>
                    </div>
                    <button className="w-10 h-5 rounded-full bg-brand-600 relative">
                      <span className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-surface-50 dark:border-surface-800">
                    <div>
                      <p className="text-sm font-medium text-surface-800 dark:text-surface-200">Confirm Email</p>
                      <p className="text-[10px] text-surface-400">Require email check for new users</p>
                    </div>
                    <button className="w-10 h-5 rounded-full bg-brand-600 relative">
                      <span className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-surface-50 dark:border-surface-800">
                    <div>
                      <p className="text-sm font-medium text-surface-800 dark:text-surface-200">Extra Login Security</p>
                      <p className="text-[10px] text-surface-400">Add code verification for admins</p>
                    </div>
                    <button className="w-10 h-5 rounded-full bg-surface-200 dark:bg-surface-700 relative">
                      <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-surface-50 dark:border-surface-800">
                    <div>
                      <p className="text-sm font-medium text-surface-800 dark:text-surface-200">Strong Passwords</p>
                      <p className="text-[10px] text-surface-400">Require difficult passwords for safety</p>
                    </div>
                    <button className="w-10 h-5 rounded-full bg-brand-600 relative">
                      <span className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="card p-5 bg-brand-50/50 dark:bg-brand-950/10 border-brand-100 dark:border-brand-900/30">
                <h4 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="btn-primary w-full py-2 hover:scale-[1.02] active:scale-[0.98] transition-all">Save All Changes</button>
                  <button className="btn-secondary w-full py-2">Refresh System Data</button>
                  <button className="btn-ghost w-full py-2 text-rose-500 hover:bg-rose-50">Maintenance Mode</button>
                </div>
              </div>

              <div className="card p-5">
                <h4 className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-4">System Stats</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-surface-500">Last Backup</span>
                    <span className="font-medium text-surface-900 dark:text-white">2 hours ago</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-surface-500">Storage Used</span>
                    <span className="font-medium text-surface-900 dark:text-white">68% / 500GB</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-surface-500">Online Users</span>
                    <span className="font-medium text-surface-900 dark:text-white">1,245</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email" className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-6">
                    <h3 className="font-display font-bold text-surface-900 dark:text-white mb-4">Email Sending (SMTP)</h3>
                    <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                        <label className="label">Mail Server Host</label>
                        <input defaultValue="smtp.sendgrid.net" className="input" />
                        </div>
                        <div>
                        <label className="label">Server Port</label>
                        <input defaultValue="587" className="input" />
                        </div>
                        <div>
                        <label className="label">Security Type</label>
                        <select className="input">
                            <option>TLS</option>
                            <option>SSL</option>
                            <option>None</option>
                        </select>
                        </div>
                        <div className="md:col-span-2">
                        <label className="label">Admin Username</label>
                        <input defaultValue="apikey" className="input" />
                        </div>
                        <div className="md:col-span-2">
                        <label className="label">Admin Password</label>
                        <input type="password" value="••••••••••••••••" className="input" />
                        </div>
                    </div>
                    <div className="pt-4 border-t border-surface-100 dark:border-surface-800 flex gap-2">
                        <button className="btn-secondary btn-sm flex-1">Test Connection</button>
                        <button className="btn-primary btn-sm flex-1">Apply Changes</button>
                    </div>
                    </div>
                </div>

                <div className="card p-6">
                    <h3 className="font-display font-bold text-surface-900 dark:text-white mb-4">Automatic Emails</h3>
                    <div className="space-y-3">
                        {['Welcome Message', 'Forgot Password', 'Login Alert', 'Payment Receipt'].map((tmpl) => (
                            <div key={tmpl} className="flex items-center justify-between p-3 rounded-xl border border-surface-50 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/50 cursor-pointer transition-colors">
                                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{tmpl}</span>
                                <Settings size={14} className="text-surface-400" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
