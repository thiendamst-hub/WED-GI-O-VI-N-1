/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ClassesModule } from './components/ClassesModule';
import { StudentsModule } from './components/StudentsModule';
import { LessonsModule } from './components/LessonsModule';
import { AssignmentsModule } from './components/AssignmentsModule';
import { GradebookModule } from './components/GradebookModule';
import { ReportsModule } from './components/ReportsModule';
import { ScheduleModule } from './components/ScheduleModule';
import { AiAssistantModule } from './components/AiAssistantModule';
import { SystemAdminModule } from './components/SystemAdminModule';
import { SettingsModule } from './components/SettingsModule';
import { StudentPortalModule } from './components/StudentPortalModule';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-lg border text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : toast.type === 'error'
              ? 'bg-red-50 text-red-900 border-red-300'
              : toast.type === 'warning'
              ? 'bg-amber-50 text-amber-900 border-amber-300'
              : 'bg-blue-50 text-blue-900 border-blue-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
            {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-600 shrink-0" />}
            <span>{toast.message}</span>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-700 ml-2 p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

const MainContent: React.FC = () => {
  const { activeTab, currentRole } = useApp();

  // If in student role, render the Student Portal View unless browsing materials/assignments
  if (currentRole === 'student' && activeTab === 'dashboard') {
    return <StudentPortalModule />;
  }

  switch (activeTab) {
    case 'dashboard':
      return <Dashboard />;
    case 'classes':
      return <ClassesModule />;
    case 'students':
      return <StudentsModule />;
    case 'lessons':
      return <LessonsModule />;
    case 'assignments':
      return <AssignmentsModule />;
    case 'gradebook':
      return <GradebookModule />;
    case 'reports':
      return <ReportsModule />;
    case 'schedule':
      return <ScheduleModule />;
    case 'ai_assistant':
      return <AiAssistantModule />;
    case 'system_admin':
      return <SystemAdminModule />;
    case 'settings':
      return <SettingsModule />;
    default:
      return <Dashboard />;
  }
};

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F8FC] text-slate-800">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-12">
          <MainContent />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
