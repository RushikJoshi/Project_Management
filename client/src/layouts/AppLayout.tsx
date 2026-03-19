import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { useAppStore } from '../context/appStore';
import { cn } from '../utils/helpers';
import MobileNav from '../components/MobileNav';
import { useAuthStore } from '../context/authStore.ts';
import { AdminChatSidebar } from '../pages/calendar/admin/components/AdminChatSidebar.tsx';

export const AppLayout: React.FC = () => {
  const { sidebarCollapsed, darkMode, bootstrap } = useAppStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7356/ingest/f2bbb2a3-c016-48c5-8c3f-7d86788fca17',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1d61fd'},body:JSON.stringify({sessionId:'1d61fd',runId:'pre-fix',hypothesisId:'H7',location:'client/src/layouts/AppLayout.tsx:26',message:'bootstrap_start',data:{hasUser:Boolean(user)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
    bootstrap().then(() => {
      // #region agent log
      fetch('http://127.0.0.1:7356/ingest/f2bbb2a3-c016-48c5-8c3f-7d86788fca17',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1d61fd'},body:JSON.stringify({sessionId:'1d61fd',runId:'pre-fix',hypothesisId:'H7',location:'client/src/layouts/AppLayout.tsx:30',message:'bootstrap_success',data:{ok:true},timestamp:Date.now()})}).catch(()=>{});
      // #endregion agent log
    }).catch((e) => {
      // #region agent log
      fetch('http://127.0.0.1:7356/ingest/f2bbb2a3-c016-48c5-8c3f-7d86788fca17',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1d61fd'},body:JSON.stringify({sessionId:'1d61fd',runId:'pre-fix',hypothesisId:'H7',location:'client/src/layouts/AppLayout.tsx:35',message:'bootstrap_error',data:{message:String(e?.message||e)},timestamp:Date.now()})}).catch(()=>{});
      // #endregion agent log
    });
  }, [bootstrap]);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Sidebar />
      <Topbar />
      <main
        className={cn(
          'transition-all duration-250 pt-[60px] min-h-screen ml-0',
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-[260px]'
        )}
      >
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-6 max-md:p-4 max-md:pb-24"
        >
          <Outlet />
        </motion.div>
      </main>
      <MobileNav />
      {user && <AdminChatSidebar />}
    </div>
  );
};

export default AppLayout;
