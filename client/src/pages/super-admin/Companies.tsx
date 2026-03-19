import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  Plus, Search, LayoutGrid, List, Filter, SortAsc,
  Building2, Users, Calendar, MoreHorizontal, Trash2, Edit3, ShieldAlert
} from 'lucide-react';
import { cn, formatDate, generateId } from '../../utils/helpers';
import { useAppStore } from '../../context/appStore';
import { UserAvatar } from '../../components/UserAvatar';
import { Table, EmptyState } from '../../components/ui';
import { Modal } from '../../components/Modal';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'trial', label: 'Trial' },
];

const COMPANY_STATUS_BADGES: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'badge-green' },
  suspended: { label: 'Suspended', className: 'badge-rose' },
  trial: { label: 'Trial', className: 'badge-amber' },
};

interface Company {
  id: string;
  name: string;
  email: string;
  usersCount: number;
  projectsCount: number;
  status: 'active' | 'suspended' | 'trial';
  createdAt: string;
  color: string;
}

const MOCK_COMPANIES: Company[] = [
  { id: 'c1', name: 'Acme Corp', email: 'admin@acme.com', usersCount: 154, projectsCount: 12, status: 'active', createdAt: '2024-01-10', color: '#3366ff' },
  { id: 'c2', name: 'Global Tech', email: 'contact@global.tech', usersCount: 89, projectsCount: 8, status: 'active', createdAt: '2024-02-15', color: '#10b981' },
  { id: 'c3', name: 'Stellar Systems', email: 'hello@stellar.io', usersCount: 45, projectsCount: 5, status: 'trial', createdAt: '2024-03-01', color: '#f59e0b' },
  { id: 'c4', name: 'Flowboard', email: 'support@flow.com', usersCount: 210, projectsCount: 18, status: 'active', createdAt: '2023-11-20', color: '#7c3aed' },
  { id: 'c5', name: 'Nebula Labs', email: 'admin@nebula.ai', usersCount: 12, projectsCount: 2, status: 'suspended', createdAt: '2024-03-10', color: '#f43f5e' },
];

export const CompaniesPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const filtered = MOCK_COMPANIES.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="page-header flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Companies</h1>
          <p className="page-subtitle">{MOCK_COMPANIES.length} total companies registered on the platform</p>
        </div>
        <button onClick={() => { setSelectedCompany(null); setShowModal(true); }} className="btn-primary btn-md">
          <Plus size={16} />
          Add Company
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search companies..."
            className="input pl-9"
          />
        </div>

        <div className="flex items-center bg-surface-100 dark:bg-surface-800 rounded-xl p-1 gap-1">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
                statusFilter === f.value
                  ? 'bg-white dark:bg-surface-900 text-surface-900 dark:text-white shadow-sm'
                  : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <Table
          columns={[
            {
              key: 'name', header: 'Company Name',
              render: (c: Company) => (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: c.color }}>
                    {c.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-surface-900 dark:text-white text-sm">{c.name}</p>
                    <p className="text-xs text-surface-400">{c.email}</p>
                  </div>
                </div>
              )
            },
            { key: 'usersCount', header: 'Users', render: (c: Company) => <span className="text-sm font-medium">{c.usersCount}</span> },
            { key: 'projectsCount', header: 'Projects', render: (c: Company) => <span className="text-sm text-surface-500">{c.projectsCount}</span> },
            {
              key: 'status', header: 'Status',
              render: (c: Company) => {
                const badge = COMPANY_STATUS_BADGES[c.status];
                return <span className={cn('badge text-[10px]', badge.className)}>{badge.label}</span>;
              }
            },
            { key: 'createdAt', header: 'Created At', render: (c: Company) => <span className="text-xs text-surface-400">{formatDate(c.createdAt)}</span> },
            {
              key: 'actions', header: '', align: 'right',
              render: (c: Company) => (
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => navigate(`/companies/${c.id}`)} className="p-1.5 text-surface-400 hover:text-brand-600 transition-colors" title="View Details">
                    <Search size={14} />
                  </button>
                  <button onClick={() => { setSelectedCompany(c); setShowModal(true); }} className="p-1.5 text-surface-400 hover:text-brand-600 transition-colors" title="Edit Company">
                    <Edit3 size={14} />
                  </button>
                  <button className="p-1.5 text-surface-400 hover:text-rose-500 transition-colors" title="Suspend Company">
                    <ShieldAlert size={14} />
                  </button>
                </div>
              )
            }
          ]}
          data={filtered}
          keyExtractor={c => c.id}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={selectedCompany ? "Edit Company" : "Add Company"} size="md">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Company Name</label>
              <input defaultValue={selectedCompany?.name} className="input" placeholder="Acme Corp" />
            </div>
            <div className="col-span-2">
              <label className="label">Admin Email</label>
              <input defaultValue={selectedCompany?.email} className="input" placeholder="admin@acme.com" />
            </div>
            <div>
              <label className="label">Initial User Limit</label>
              <input type="number" defaultValue={selectedCompany?.usersCount || 50} className="input" />
            </div>
            <div>
              <label className="label">Status</label>
              <select defaultValue={selectedCompany?.status || 'active'} className="input">
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="btn-secondary btn-md flex-1">Cancel</button>
            <button onClick={() => setShowModal(false)} className="btn-primary btn-md flex-1">{selectedCompany ? "Save Changes" : "Register Company"}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CompaniesPage;
