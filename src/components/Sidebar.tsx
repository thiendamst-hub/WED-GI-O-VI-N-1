import React from 'react';
import { useApp, NavTab } from '../context/AppContext';
import {
  Home,
  Users,
  UserCheck,
  BookOpen,
  ClipboardCheck,
  Award,
  BarChart3,
  Calendar,
  Sparkles,
  Sliders,
  Settings,
  BookMarked,
} from 'lucide-react';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentRole } = useApp();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Trang chủ', icon: Home },
    { id: 'classes', label: 'Lớp học của tôi', icon: Users, badge: '5' },
    { id: 'students', label: 'Danh sách học sinh', icon: UserCheck, badge: '120' },
    { id: 'lessons', label: 'Bài giảng - Tài liệu', icon: BookOpen },
    { id: 'assignments', label: 'Bài tập - Kiểm tra', icon: ClipboardCheck },
    { id: 'gradebook', label: 'Sổ điểm', icon: Award },
    { id: 'reports', label: 'Báo cáo học tập', icon: BarChart3 },
    { id: 'schedule', label: 'Lịch dạy & công việc', icon: Calendar },
    { id: 'ai_assistant', label: 'Trợ lý AI', icon: Sparkles, badge: 'Mới' },
    ...(currentRole === 'admin' || currentRole === 'teacher'
      ? [{ id: 'system_admin' as NavTab, label: 'Quản trị hệ thống', icon: Sliders }]
      : []),
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0B3B70] text-white flex flex-col justify-between shrink-0 min-h-[calc(100vh-65px)] shadow-lg border-r border-[#082a52]">
      {/* Navigation List */}
      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-[#0879D9] text-white shadow-md font-bold translate-x-1'
                  : 'text-blue-100 hover:bg-[#0f4b8c] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-blue-300'
                  }`}
                />
                <span className="tracking-wide text-[13.5px]">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    isActive
                      ? 'bg-white text-[#0879D9]'
                      : 'bg-blue-900 text-blue-200 group-hover:bg-blue-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Inspiration Quote & Line Art Book */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-[#082e57]/80 border border-blue-400/20 text-center relative overflow-hidden">
        <div className="flex justify-center mb-2 text-blue-300/80">
          <BookMarked className="w-8 h-8 opacity-80" />
        </div>
        <p className="text-xs italic text-blue-200/90 leading-relaxed font-serif">
          “Giáo dục không chỉ là truyền đạt kiến thức, mà còn là thắp sáng những ước mơ.”
        </p>
        <span className="text-[10px] text-blue-300/70 mt-1 block">
          Trường THPT Nguyễn Huệ
        </span>
      </div>
    </aside>
  );
};
