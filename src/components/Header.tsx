import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Settings,
  ChevronDown,
  User,
  Shield,
  GraduationCap,
  Sparkles,
  RefreshCw,
  LogOut,
  CheckCircle,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    currentRole,
    setCurrentRole,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
    isDemoMode,
    resetAllToDemoData,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-[#0B3B70] text-white shadow-md border-b border-[#08284d] sticky top-0 z-40">
      <div className="w-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: School Logo & System Title */}
        <div className="flex items-center gap-3.5">
          {/* Circular School Emblem */}
          <div className="w-12 h-12 rounded-full border-2 border-amber-300/80 bg-[#082a52] flex items-center justify-center p-1 shadow-inner shrink-0 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 to-transparent"></div>
            {/* SVG Emblem representing Book & Torch */}
            <svg viewBox="0 0 100 100" className="w-9 h-9 text-amber-300" fill="currentColor">
              {/* Laurel wreath circle */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 2" />
              {/* Open Book */}
              <path d="M50 72 C40 68 25 68 18 73 L18 42 C25 38 40 38 50 43 C60 38 75 38 82 42 L82 73 C75 68 60 68 50 72 Z" fill="#EAF4FF" />
              <path d="M50 43 L50 72" stroke="#0B3B70" strokeWidth="2" />
              {/* Torch / Flame */}
              <path d="M50 20 C46 25 43 28 47 34 C49 32 50 29 50 29 C50 29 51 32 53 34 C57 28 54 25 50 20 Z" fill="#F59E0B" />
              {/* Stars */}
              <polygon points="50,28 52,33 57,33 53,36 55,41 50,38 45,41 47,36 43,33 48,33" fill="#FBBF24" />
            </svg>
          </div>

          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-wide uppercase text-white leading-tight flex items-center gap-2">
              TRƯỜNG THPT NGUYỄN HUỆ
              <span className="hidden lg:inline-block text-xs font-normal bg-blue-900/80 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded">
                Môn: Hóa học
              </span>
            </h1>
            <p className="text-xs text-blue-200/90 italic font-serif">
              Tri thức hôm nay - Thành công ngày mai
            </p>
          </div>
        </div>

        {/* Center: System Slogan Banner */}
        <div className="hidden xl:flex flex-col items-center justify-center text-center px-4 py-1 rounded bg-[#092e59]/60 border border-blue-400/20 shadow-inner">
          <span className="text-sm font-bold tracking-wider text-amber-300 uppercase">
            HỆ THỐNG DẠY HỌC VÀ QUẢN LÝ HỌC TẬP THÔNG MINH
          </span>
          <span className="text-xs text-blue-100 italic">
            Kết nối tri thức - Đồng hành cùng học sinh
          </span>
        </div>

        {/* Right: Actions, Demo Badge & User Profile */}
        <div className="flex items-center gap-3">
          {/* Demo Badge */}
          {isDemoMode && (
            <div
              onClick={resetAllToDemoData}
              title="Hệ thống đang chạy chế độ dữ liệu mẫu. Nhấn để đặt lại dữ liệu nếu cần."
              className="cursor-pointer hidden sm:flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 text-xs px-2.5 py-1 rounded-full transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="font-semibold tracking-wider">DỮ LIỆU DEMO</span>
              <RefreshCw className="w-3 h-3 text-amber-300" />
            </div>
          )}

          {/* Quick Role Switcher */}
          <div className="relative">
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as any)}
              className="bg-[#092f5c] hover:bg-[#0d3f78] text-blue-100 text-xs rounded border border-blue-400/40 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-300 cursor-pointer"
              title="Đổi vai trò để kiểm tra phân quyền (Giáo viên / Quản trị viên / Học sinh)"
            >
              <option value="teacher">👨‍🏫 Thầy Tấn Thanh (Giáo viên)</option>
              <option value="admin">🛡️ Quản trị viên (BGH)</option>
              <option value="student">🎓 Học sinh (Nguyễn Văn A)</option>
            </select>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-full hover:bg-white/10 text-white transition-colors"
              title="Thông báo mới"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-lg shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-sm text-[#0B3B70]">Thông báo hệ thống</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-[#0879D9] hover:underline"
                    >
                      Đã đọc tất cả
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.linkTab) setActiveTab(n.linkTab as any);
                        setShowNotifications(false);
                      }}
                      className={`px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors ${
                        !n.read ? 'bg-blue-50/60 font-semibold' : 'text-slate-600'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#0879D9] mt-1.5 shrink-0"></span>
                        <div className="flex-1">
                          <p className="text-xs leading-snug">{n.title}</p>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">{n.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setActiveTab('system_admin');
                      setShowNotifications(false);
                    }}
                    className="text-xs text-[#0879D9] hover:underline font-medium"
                  >
                    Xem lịch sử thông báo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Settings Icon */}
          <button
            onClick={() => setActiveTab('settings')}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            title="Cài đặt hệ thống"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* User Profile Card */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-white/70 shadow-sm"
              />
              <div className="hidden md:flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-white">{currentUser.name}</span>
                <span className="text-[11px] text-blue-200">
                  {currentUser.title} {currentUser.subject ? `• ${currentUser.subject}` : ''}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-blue-200" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-lg shadow-2xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="font-bold text-sm text-[#0B3B70]">{currentUser.name}</p>
                  <p className="text-xs text-slate-500">{currentUser.email}</p>
                  <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded bg-blue-100 text-[#0B3B70] font-medium">
                    {currentUser.role === 'teacher'
                      ? 'Giáo viên bộ môn Hóa học'
                      : currentUser.role === 'admin'
                      ? 'Ban Quản trị Nhà trường'
                      : 'Học sinh THPT'}
                  </span>
                </div>
                <div className="py-1 text-xs">
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    Hồ sơ cá nhân & Cài đặt
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('ai_assistant');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center gap-2 text-blue-700"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Trợ lý AI giảng dạy
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => {
                      resetAllToDemoData();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-amber-50 text-amber-700 flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Khôi phục dữ liệu mẫu THPT Nguyễn Huệ
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
