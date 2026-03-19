import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { TrendingUp, Download } from 'lucide-react';
import { cn } from '../../utils/helpers';

import { useAuthStore } from '../../context/authStore';

const PERIOD_OPTIONS = ['This week', 'This month', 'Last 3 months', 'This year'];

const PROJECT_PROGRESS_DATA = [
  { name: 'Jan', progress: 45 },
  { name: 'Feb', progress: 52 },
  { name: 'Mar', progress: 48 },
  { name: 'Apr', progress: 61 },
  { name: 'May', progress: 55 },
  { name: 'Jun', progress: 67 },
];

const TASK_STATUS_DATA = [
  { name: 'Done', value: 45, color: '#10b981' },
  { name: 'In Progress', value: 30, color: '#3366ff' },
  { name: 'To Do', value: 15, color: '#8896b8' },
  { name: 'On Hold', value: 10, color: '#f59e0b' },
];

const PRIORITY_DATA = [
  { priority: 'Urgent', count: 8 },
  { priority: 'High', count: 15 },
  { priority: 'Medium', count: 25 },
  { priority: 'Low', count: 12 },
];

// Super Admin Mock Data
const COMPANY_GROWTH_DATA = [
  { name: 'Jan', companies: 85, users: 1240 },
  { name: 'Feb', companies: 94, users: 1560 },
  { name: 'Mar', companies: 108, users: 1890 },
  { name: 'Apr', companies: 115, users: 2100 },
  { name: 'May', companies: 124, users: 2450 },
  { name: 'Jun', companies: 142, users: 2800 },
];

const LICENSE_DISTRIBUTION = [
  { name: 'Basic', value: 400, color: '#8896b8' },
  { name: 'Pro', value: 850, color: '#3366ff' },
  { name: 'Enterprise', value: 300, color: '#7c3aed' },
];

const TOP_COMPANIES = [
  { name: 'Acme Corp', users: 154, activity: 92 },
  { name: 'Global Tech', users: 89, activity: 85 },
  { name: 'Stellar Systems', users: 45, activity: 78 },
  { name: 'Flowboard', users: 210, activity: 95 },
  { name: 'Nebula Labs', users: 12, activity: 60 },
];

export const ReportsPage: React.FC = () => {
  const [period, setPeriod] = useState('This month');
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <div className="max-w-full mx-auto">
      <div className="page-header flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">{isSuperAdmin ? 'Platform Analytics' : 'Project Reports'}</h1>
          <p className="page-subtitle">
            {isSuperAdmin 
              ? 'Analyze platform-wide growth and registration metrics' 
              : 'Track project progress and team performance'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-100 dark:bg-surface-800 rounded-xl p-1 gap-1">
            {PERIOD_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => setPeriod(opt)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
                  period === opt ? 'bg-white dark:bg-surface-900 text-surface-900 dark:text-white shadow-sm' : 'text-surface-500 hover:text-surface-700'
                )}
              >
                {opt}
              </button>
            ))}
          </div>
          <button className="btn-secondary btn-md ml-2">
            <Download size={15} /> Export PDF
          </button>
        </div>
      </div>

      {isSuperAdmin ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 card p-5">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-surface-900 dark:text-white">Company & User Growth</h3>
                  <p className="text-xs text-surface-400">Total registrations over the current year</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
                   <div className="flex items-center gap-1.5 text-brand-600">
                     <div className="w-2 h-2 rounded-full bg-brand-600" /> Companies
                   </div>
                   <div className="flex items-center gap-1.5 text-violet-600">
                     <div className="w-2 h-2 rounded-full bg-violet-600" /> Users
                   </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={COMPANY_GROWTH_DATA} margin={{ left: -20 }}>
                  <defs>
                    <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3366ff" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3366ff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e8f2" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8896b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#8896b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e4e8f2', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="companies" stroke="#3366ff" strokeWidth={3} fill="url(#compGrad)" />
                  <Area type="monotone" dataKey="users" stroke="#7c3aed" strokeWidth={2} fill="url(#userGrad)" strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-5">
              <div className="mb-6">
                <h3 className="font-display font-bold text-surface-900 dark:text-white">Plan Distribution</h3>
                <p className="text-xs text-surface-400">Companies by subscription tier</p>
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={LICENSE_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {LICENSE_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {LICENSE_DISTRIBUTION.map(item => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                       <span className="text-xs text-surface-600 dark:text-surface-400 font-medium">{item.name} Licenses</span>
                    </div>
                    <span className="text-xs font-bold text-surface-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="card p-5">
                <h3 className="font-display font-bold text-surface-900 dark:text-white mb-6">Company Performance Index</h3>
                <div className="space-y-5">
                   {TOP_COMPANIES.map((company, i) => (
                     <div key={company.name}>
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-surface-400">0{i+1}</span>
                              <span className="text-sm font-semibold text-surface-800 dark:text-surface-200">{company.name}</span>
                           </div>
                           <span className="text-xs font-medium text-surface-500">{company.activity}% Active</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                           <div 
                              className="h-full bg-brand-600 rounded-full" 
                              style={{ width: `${company.activity}%` }} 
                           />
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="card p-5 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950/20 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp size={32} className="text-brand-600" />
                </div>
                <h3 className="font-display font-bold text-xl text-surface-900 dark:text-white">Ready for more?</h3>
                <p className="text-sm text-surface-400 mt-2 max-w-[320px]">
                   Unlock advanced BI tools to see churn rates, revenue forecasting, and deep-dive user behavioral patterns.
                </p>
                <button className="btn-primary mt-6 px-8 rounded-xl font-bold">Generate Custom Report</button>
             </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 card p-5">
              <div className="mb-6">
                <h3 className="font-display font-bold text-surface-900 dark:text-white">Project Progress</h3>
                <p className="text-xs text-surface-400">Average completion rate across all projects</p>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={PROJECT_PROGRESS_DATA} margin={{ left: -20 }}>
                  <defs>
                    <linearGradient id="reportsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3366ff" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3366ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e8f2" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8896b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#8896b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e4e8f2', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="progress" stroke="#3366ff" strokeWidth={3} fill="url(#reportsGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-5">
              <div className="mb-6">
                <h3 className="font-display font-bold text-surface-900 dark:text-white">Task Status</h3>
                <p className="text-xs text-surface-400">Distribution of tasks by current status</p>
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={TASK_STATUS_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {TASK_STATUS_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {TASK_STATUS_DATA.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] text-surface-500 font-medium">{item.name} ({item.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-5">
              <div className="mb-6 text-center">
                <h3 className="font-display font-bold text-surface-900 dark:text-white">Task Priority</h3>
                <p className="text-xs text-surface-400">Number of tasks per priority level</p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={PRIORITY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e8f2" />
                  <XAxis dataKey="priority" tick={{ fontSize: 11, fill: '#8896b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#8896b8' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="count" fill="#3366ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-5 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-surface-50 dark:bg-surface-800 rounded-full flex items-center justify-center mb-4">
                <TrendingUp size={24} className="text-brand-500" />
              </div>
              <h3 className="font-display font-bold text-surface-900 dark:text-white">Team Performance</h3>
              <p className="text-sm text-surface-400 mt-2 max-w-[280px]">Detailed team velocity and individual contribution metrics will appear here.</p>
              <button className="btn-ghost btn-sm text-brand-600 mt-4">Learn more</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsPage;
