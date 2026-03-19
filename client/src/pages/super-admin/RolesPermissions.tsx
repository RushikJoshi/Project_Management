import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus, Search, Edit3, Trash2, CheckCircle2, MoreHorizontal, UserCircle2 } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { Table } from '../../components/ui';
import { Modal } from '../../components/Modal';

const PERMISSION_GROUPS = [
  {
    name: 'Companies',
    permissions: [
      { id: 'c_view', label: 'See Companies', description: 'Can see all company details' },
      { id: 'c_create', label: 'Add Company', description: 'Can register new companies' },
      { id: 'c_edit', label: 'Edit Company', description: 'Can update company info' },
      { id: 'c_suspend', label: 'Disable Company', description: 'Can block company access' },
    ]
  },
  {
    name: 'Users',
    permissions: [
      { id: 'u_view', label: 'See Users', description: 'Can see all platform users' },
      { id: 'u_create', label: 'Add User', description: 'Can create new users' },
      { id: 'u_edit', label: 'Edit User', description: 'Can update user profiles' },
      { id: 'u_block', label: 'Disable User', description: 'Can block user accounts' },
    ]
  },
  {
    name: 'Platform',
    permissions: [
      { id: 's_view_logs', label: 'See Activity Logs', description: 'Can see system activity' },
      { id: 's_manage_modules', label: 'Manage Features', description: 'Can turn features on/off' },
      { id: 's_edit_config', label: 'Platform Settings', description: 'Can change site settings' },
    ]
  }
];

const ROLES = [
  { id: 'r1', name: 'Super Admin', description: 'Total control over the whole platform', usersCount: 2, isDefault: true },
  { id: 'r2', name: 'Platform Manager', description: 'Can manage companies and users', usersCount: 4, isDefault: false },
  { id: 'r3', name: 'Support Staff', description: 'Helps with basic user and company issues', usersCount: 12, isDefault: false },
];

export const RolesPermissionsPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [rolePerms, setRolePerms] = useState<string[]>(['c_view', 'c_create', 'u_view', 's_view_logs']);

  const togglePerm = (id: string) => {
    setRolePerms(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="page-header flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Roles & Permissions</h1>
          <p className="page-subtitle">Define role-based access control policies</p>
        </div>
        <button onClick={() => { setSelectedRole(null); setShowModal(true); }} className="btn-primary btn-md">
          <Plus size={16} />
          Create Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="md:col-span-1 space-y-3">
          <h2 className="text-xs font-bold text-surface-400 uppercase tracking-widest px-1">Available Roles</h2>
          {ROLES.map(role => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={cn(
                "p-4 rounded-xl border cursor-pointer transition-all",
                selectedRole?.id === role.id 
                  ? "bg-brand-50 border-brand-200 dark:bg-brand-950/20 dark:border-brand-800"
                  : "bg-white border-surface-100 dark:bg-surface-900 dark:border-surface-800 hover:border-surface-300"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-surface-900 dark:text-white">{role.name}</h3>
                {role.isDefault && <span className="badge-blue text-[10px]">Default</span>}
              </div>
              <p className="text-xs text-surface-400 mb-3 line-clamp-2">{role.description}</p>
              <div className="flex items-center gap-2 text-xs text-surface-500">
                <UserCircle2 size={14} />
                <span>{role.usersCount} users assigned</span>
              </div>
            </div>
          ))}
        </div>

        {/* Permissions Table */}
        <div className="md:col-span-2">
          {!selectedRole ? (
            <div className="card h-full flex flex-col items-center justify-center p-12 text-center bg-surface-50/50 dark:bg-surface-800/20 border-dashed border-2">
              <Shield size={48} className="text-surface-200 mb-4" />
              <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-1">Select a Role</h3>
              <p className="text-sm text-surface-400 max-w-xs">Choose a role from the left to view and manage its specific permissions</p>
            </div>
          ) : (
            <motion.div
              layout
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="card overflow-hidden"
            >
              <div className="p-5 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-surface-900 dark:text-white">{selectedRole.name} Permissions</h3>
                  <p className="text-xs text-surface-400">Configure what users with this role can see and do</p>
                </div>
                <button className="btn-primary btn-sm">Save Changes</button>
              </div>

              <div className="divide-y divide-surface-100 dark:divide-surface-800">
                {PERMISSION_GROUPS.map(group => (
                  <div key={group.name} className="p-5">
                    <h4 className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-4">{group.name}</h4>
                    <div className="space-y-4">
                      {group.permissions.map(perm => (
                        <div key={perm.id} className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-surface-900 dark:text-white">{perm.label}</p>
                            <p className="text-xs text-surface-400 mt-0.5">{perm.description}</p>
                          </div>
                          <button
                            onClick={() => togglePerm(perm.id)}
                            className={cn(
                              "w-10 h-5 rounded-full relative transition-colors duration-200 flex-shrink-0",
                              rolePerms.includes(perm.id) ? "bg-emerald-500" : "bg-surface-200 dark:bg-surface-700"
                            )}
                          >
                            <span className={cn(
                              "absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-200",
                              rolePerms.includes(perm.id) ? "left-6" : "left-1"
                            )} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Create/Edit Role Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Role Settings" size="md">
        <div className="p-6 space-y-4">
          <div>
            <label className="label">Role Name</label>
            <input className="input" placeholder="e.g. Content Moderator" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input h-24" placeholder="Briefly describe what this role is for..." />
          </div>
          <div className="flex items-center gap-2 p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
            <input type="checkbox" id="is_default" className="rounded text-brand-600 focus:ring-brand-500" />
            <label htmlFor="is_default" className="text-sm text-surface-700 dark:text-surface-300">Set as default role for new users</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="btn-secondary btn-md flex-1">Cancel</button>
            <button onClick={() => setShowModal(false)} className="btn-primary btn-md flex-1">Save Role</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RolesPermissionsPage;
