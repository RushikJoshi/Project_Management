import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Send, Search, Filter, History, Trash2, CheckCircle2, AlertTriangle, Info, Globe, Building2, User } from 'lucide-react';
import { cn, formatDate } from '../../utils/helpers';
import { Table } from '../../components/ui';

const NOTIF_HISTORY = [
  { id: 'h1', title: 'System Maintenance', message: 'The system will be down for maintenance on Sunday at 2 AM EST.', target: 'All Users', type: 'urgent', sentAt: '2024-03-15T10:00:00', reach: '24.5k' },
  { id: 'h2', title: 'New Feature: AI Assistant', message: 'We have launched a new AI assistant to help you manage tasks.', target: 'Pro/Enterprise', type: 'info', sentAt: '2024-03-12T14:30:00', reach: '12.8k' },
  { id: 'h3', title: 'Security Update', message: 'Please update your mobile app to the latest version for security fixes.', target: 'All Users', type: 'warning', sentAt: '2024-03-10T09:15:00', reach: '24.2k' },
  { id: 'h4', title: 'Welcome to Acme Corp', message: 'Glad to have you onboard! Let us know if you need any help.', target: 'Acme Corp', type: 'success', sentAt: '2024-03-08T16:45:00', reach: '154' },
];

export const NotificationsPage: React.FC = () => {
  const [targetType, setTargetType] = useState<'all' | 'company' | 'user'>('all');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="page-header flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Broadcast Notifications</h1>
          <p className="page-subtitle">Send platform-wide announcements and targeted messages</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display font-bold text-lg text-surface-900 dark:text-white mb-4 flex items-center gap-2">
              <Send size={18} className="text-brand-600" />
              Compose Message
            </h2>
            <div className="space-y-4">
              <div>
                <label className="label">Target Audience</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'all', label: 'All', icon: Globe },
                    { id: 'company', label: 'Company', icon: Building2 },
                    { id: 'user', label: 'User', icon: User },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTargetType(t.id as any)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 p-2 rounded-xl border text-[10px] font-bold transition-all",
                        targetType === t.id 
                          ? "bg-brand-50 border-brand-200 text-brand-700 dark:bg-brand-950/20 dark:border-brand-800"
                          : "border-surface-100 dark:border-surface-800 text-surface-400 hover:border-surface-200"
                      )}
                    >
                      <t.icon size={16} />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {targetType === 'company' && (
                <div>
                  <label className="label">Select Company</label>
                  <select className="input">
                    <option>Acme Corp</option>
                    <option>Global Tech</option>
                    <option>Stellar Systems</option>
                  </select>
                </div>
              )}

              {targetType === 'user' && (
                <div>
                  <label className="label">User Email / ID</label>
                  <input className="input" placeholder="e.g. user@example.com" />
                </div>
              )}

              <div>
                <label className="label">Message Type</label>
                <select className="input">
                  <option value="info">Information (Blue)</option>
                  <option value="success">Success (Green)</option>
                  <option value="warning">Warning (Amber)</option>
                  <option value="urgent">Urgent (Red)</option>
                </select>
              </div>

              <div>
                <label className="label">Title</label>
                <input className="input" placeholder="Enter headline..." />
              </div>

              <div>
                <label className="label">Message Content</label>
                <textarea className="input h-32 py-2 resize-none" placeholder="Write your announcement here..." />
              </div>

              <button className="btn-primary w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2">
                <Send size={16} /> Broadcast Now
              </button>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="lg:col-span-2">
          <div className="card p-0 overflow-hidden">
            <div className="p-5 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-50 dark:bg-surface-800 flex items-center justify-center text-surface-400">
                  <History size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-surface-900 dark:text-white">Broadcast History</h3>
                  <p className="text-xs text-surface-400">Previous announcements sent by super admins</p>
                </div>
              </div>
              <button className="btn-ghost btn-sm text-surface-400"><Trash2 size={14} /></button>
            </div>

            <Table
              columns={[
                {
                  key: 'title', header: 'Announcement',
                  render: (h: any) => (
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                        h.type === 'urgent' ? 'bg-rose-500' : 
                        h.type === 'warning' ? 'bg-amber-500' : 
                        h.type === 'success' ? 'bg-emerald-500' : 'bg-brand-500'
                      )} />
                      <div className="min-w-0">
                        <p className="font-medium text-surface-900 dark:text-white text-sm truncate">{h.title}</p>
                        <p className="text-xs text-surface-400 truncate max-w-[200px]">{h.message}</p>
                      </div>
                    </div>
                  )
                },
                { key: 'target', header: 'Target', render: (h: any) => <span className="text-xs font-semibold px-2 py-0.5 bg-surface-50 dark:bg-surface-800 rounded">{h.target}</span> },
                { key: 'reach', header: 'Reach', render: (h: any) => <span className="text-xs text-surface-500">{h.reach}</span> },
                { key: 'sentAt', header: 'Sent At', render: (h: any) => <span className="text-xs text-surface-400">{formatDate(h.sentAt)}</span> },
                {
                  key: 'actions', header: '', align: 'right',
                  render: () => (
                    <button className="p-1.5 text-surface-400 hover:text-rose-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )
                }
              ]}
              data={NOTIF_HISTORY}
              keyExtractor={h => h.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
