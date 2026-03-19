import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Mail, Edit3, Trash2, ShieldAlert, UserPlus, Filter } from 'lucide-react';
import { cn, formatDate } from '../../utils/helpers';
import { MOCK_USERS, ROLE_CONFIG } from '../../app/data';
import { UserAvatar } from '../../components/UserAvatar';
import { Table, EmptyState } from '../../components/ui';
import { Modal } from '../../components/Modal';

const ROLES = [
  { value: 'all', label: 'All Roles' },
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'team_leader', label: 'Lead' },
  { value: 'team_member', label: 'Member' },
];

export const UsersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = MOCK_USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="page-header flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">{MOCK_USERS.length} total users across the platform</p>
        </div>
        <button className="btn-primary btn-md" onClick={() => { setSelectedUser(null); setShowModal(true); }}>
          <UserPlus size={16} />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="input pl-9"
          />
        </div>

        <div className="flex items-center bg-surface-100 dark:bg-surface-800 rounded-xl p-1 gap-1 flex-wrap">
          {ROLES.map(r => (
            <button
              key={r.value}
              onClick={() => setRoleFilter(r.value)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
                roleFilter === r.value
                  ? 'bg-white dark:bg-surface-900 text-surface-900 dark:text-white shadow-sm'
                  : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <Table
          columns={[
            {
              key: 'name', header: 'User',
              render: (u: any) => (
                <div className="flex items-center gap-3">
                  <UserAvatar name={u.name} color={u.color} size="sm" isOnline={u.isActive} />
                  <div>
                    <p className="font-medium text-surface-900 dark:text-white text-sm">{u.name}</p>
                    <p className="text-xs text-surface-400">{u.email}</p>
                  </div>
                </div>
              )
            },
            { key: 'company', header: 'Company', render: (u: any) => <span className="text-sm font-medium">Acme Corp</span> },
            {
              key: 'role', header: 'Role',
              render: (u: any) => {
                const cfg = (ROLE_CONFIG as any)[u.role];
                return <span className={cn('badge text-[10px]', cfg.bg, cfg.color)}>{cfg.label}</span>;
              }
            },
            {
              key: 'status', header: 'Status',
              render: (u: any) => (
                <span className={cn('badge text-[10px]', u.isActive ? 'badge-green' : 'badge-rose')}>
                  {u.isActive ? 'Active' : 'Blocked'}
                </span>
              )
            },
            { key: 'createdAt', header: 'Created', render: (u: any) => <span className="text-xs text-surface-400">{formatDate(u.createdAt)}</span> },
            {
              key: 'actions', header: '', align: 'right',
              render: (u: any) => (
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => { setSelectedUser(u); setShowModal(true); }} className="p-1.5 text-surface-400 hover:text-brand-600 transition-colors" title="Edit User">
                    <Edit3 size={14} />
                  </button>
                  <button className="p-1.5 text-surface-400 hover:text-rose-500 transition-colors" title="Block User">
                    <ShieldAlert size={14} />
                  </button>
                </div>
              )
            }
          ]}
          data={filtered}
          keyExtractor={u => u.id}
        />
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={selectedUser ? "Edit User" : "Add User"} size="md">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Full Name</label>
              <input defaultValue={selectedUser?.name} className="input" placeholder="e.g. John Doe" />
            </div>
            <div className="col-span-2">
              <label className="label">Email Address</label>
              <input defaultValue={selectedUser?.email} className="input" placeholder="e.g. john@example.com" />
            </div>
            <div className="col-span-2">
              <label className="label">Company</label>
              <select className="input">
                <option>Acme Corp</option>
                <option>Global Tech</option>
                <option>Stellar Systems</option>
              </select>
            </div>
            <div>
              <label className="label">Role</label>
              <select defaultValue={selectedUser?.role || 'team_member'} className="input">
                {ROLES.filter(r => r.value !== 'all').map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select defaultValue={selectedUser?.isActive !== false ? 'active' : 'blocked'} className="input">
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="btn-secondary btn-md flex-1">Cancel</button>
            <button onClick={() => setShowModal(false)} className="btn-primary btn-md flex-1">{selectedUser ? "Update User" : "Create User"}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;
