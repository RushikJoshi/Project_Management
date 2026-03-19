import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, History, Trash2, Download, Terminal, Clock, User, Shield, Zap } from 'lucide-react';
import { cn, formatDate, formatRelativeTime } from '../../utils/helpers';
import { Table } from '../../components/ui';

const LOG_ENTRIES = [
  { id: 'l1', user: 'Alex Morgan', action: 'Created Company', module: 'Companies', entity: 'Gitakshmi', timestamp: '2024-03-15T11:20:00', type: 'create' },
  { id: 'l2', user: 'Sarah Chen', action: 'Updated Permissions', module: 'Roles', entity: 'Support Agent', timestamp: '2024-03-15T10:45:00', type: 'update' },
  { id: 'l3', user: 'System', action: 'Daily Backup Completed', module: 'Infrastructure', entity: 'DB_Backup_0315', timestamp: '2024-03-15T02:00:00', type: 'info' },
  { id: 'l4', user: 'Alex Morgan', action: 'Suspended User', module: 'Users', entity: 'ryan@acme.com', timestamp: '2024-03-14T16:30:00', type: 'delete' },
  { id: 'l5', user: 'Sarah Chen', action: 'Changed SMTP', module: 'Settings', entity: 'Email Config', timestamp: '2024-03-14T14:15:00', type: 'update' },
  { id: 'l6', user: 'James Wilson', action: 'Logged In', module: 'Auth', entity: 'Session_AF32', timestamp: '2024-03-14T09:00:00', type: 'info' },
];

const LOG_TYPE_COLORS = {
  create: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400',
  update: 'bg-brand-50 text-brand-600 dark:bg-brand-950/30 dark:text-brand-400',
  delete: 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400',
  info: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
};

export const LogsPage: React.FC = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="page-header flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Audit Logs</h1>
          <p className="page-subtitle">Historical record of all platform activities and changes</p>
        </div>
        <button className="btn-secondary btn-md">
          <Download size={15} /> Export Logs
        </button>
      </div>

      {/* Stats/Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search logs..."
            className="input pl-9"
          />
        </div>
        <button className="btn-secondary h-10 px-4 flex items-center gap-2">
          <Filter size={15} /> Filter by Module
        </button>
        <button className="btn-secondary h-10 px-4 flex items-center gap-2">
          <Clock size={15} /> Last 24 Hours
        </button>
      </div>

      <div className="card overflow-hidden">
        <Table
          columns={[
            {
              key: 'timestamp', header: 'Time',
              render: (l: any) => (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-surface-900 dark:text-white">{formatDate(l.timestamp, 'HH:mm:ss')}</span>
                  <span className="text-[10px] text-surface-400">{formatRelativeTime(l.timestamp)}</span>
                </div>
              )
            },
            {
              key: 'user', header: 'Actor',
              render: (l: any) => (
                <div className="flex items-center gap-2">
                  <User size={14} className="text-surface-400" />
                  <span className="text-sm text-surface-700 dark:text-surface-300">{l.user}</span>
                </div>
              )
            },
            {
              key: 'action', header: 'Action',
              render: (l: any) => (
                <span className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider', LOG_TYPE_COLORS[l.type as keyof typeof LOG_TYPE_COLORS])}>
                  {l.action}
                </span>
              )
            },
            {
              key: 'module', header: 'Module',
              render: (l: any) => (
                <div className="flex items-center gap-2">
                  <Zap size={12} className="text-brand-500" />
                  <span className="text-xs text-surface-500">{l.module}</span>
                </div>
              )
            },
            {
              key: 'entity', header: 'Entity',
              render: (l: any) => <span className="text-sm font-mono text-surface-500 bg-surface-50 dark:bg-surface-800/50 px-2 py-0.5 rounded">{l.entity}</span>
            },
            {
              key: 'details', header: '', align: 'right',
              render: () => (
                <button className="p-1.5 text-surface-400 hover:text-brand-600 transition-colors">
                  <Terminal size={14} />
                </button>
              )
            }
          ]}
          data={LOG_ENTRIES}
          keyExtractor={l => l.id}
        />
      </div>
    </div>
  );
};

export default LogsPage;
