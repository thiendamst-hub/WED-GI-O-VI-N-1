import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  Save,
  RefreshCw,
  Check,
  Award,
} from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const { currentUser, isDemoMode, setIsDemoMode, resetAllToDemoData, showToast } = useApp();

  const [teacherName, setTeacherName] = useState('Tấn Thanh');
  const [subject, setSubject] = useState('Hóa học');
  const [school, setSchool] = useState('Trường THPT Nguyễn Huệ');
  const [email, setEmail] = useState('tanthanh.chemistry@thptnguyenhue.edu.vn');
  const [phone, setPhone] = useState('0912 345 678');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Đã lưu thông tin hồ sơ giáo viên thành công.');
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#0B3B70] flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#0879D9]" />
            Cài Đặt Hệ Thống & Hồ Sơ Cá Nhân
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý thông tin giáo viên, cấu hình giao diện và chế độ vận hành
          </p>
        </div>
      </div>

      {/* Teacher Profile Form */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <h3 className="font-bold text-sm text-[#0B3B70] flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <User className="w-4 h-4 text-[#0879D9]" />
          Thông Tin Giáo Viên Giảng Dạy
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-3.5">
          <div className="flex items-center gap-4 pb-2">
            <img
              src={currentUser.avatar}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#0879D9] shadow-sm"
            />
            <div>
              <p className="font-bold text-sm text-slate-800">{teacherName}</p>
              <p className="text-slate-500">Giáo viên {subject} – {school}</p>
              <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded bg-blue-100 text-[#0B3B70] font-semibold">
                Tài khoản chính thức đã xác thực
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Họ và tên giáo viên:</label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Môn giảng dạy chính:</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Trường THPT:</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email sư phạm:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0879D9] hover:bg-[#0663b3] text-white font-bold rounded-lg shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              Lưu Thông Tin Hồ Sơ
            </button>
          </div>
        </form>
      </div>

      {/* Interface Standards & Typography */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
        <h3 className="font-bold text-sm text-[#0B3B70] flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <Palette className="w-4 h-4 text-[#0879D9]" />
          Quy Chuẩn Giao Diện & Kiểu Chữ (Design System)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 block">Phông chữ tiêu chuẩn:</span>
            <p className="text-slate-600 font-serif text-sm">Times New Roman (Bắt buộc toàn hệ thống)</p>
            <p className="text-[11px] text-slate-400">Đã áp dụng toàn bộ từ tiêu đề, menu, bảng biểu và nội dung.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 block">Bảng màu nhận diện:</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-5 h-5 rounded bg-[#0B3B70] border" title="Xanh navy #0B3B70"></span>
              <span className="w-5 h-5 rounded bg-[#0879D9] border" title="Xanh công nghệ #0879D9"></span>
              <span className="w-5 h-5 rounded bg-[#EAF4FF] border" title="Xanh nhạt #EAF4FF"></span>
              <span className="w-5 h-5 rounded bg-[#F4F8FC] border" title="Nền phụ #F4F8FC"></span>
              <span className="text-[11px] text-slate-500 font-medium ml-1">Chuẩn tông màu giáo dục hiện đại</span>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Reset */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between text-xs">
        <div>
          <h4 className="font-bold text-slate-800 text-sm">Đặt lại dữ liệu hệ thống</h4>
          <p className="text-slate-500 mt-0.5">
            Xóa các sửa đổi cục bộ và khôi phục lại 5 lớp học, 120 học sinh và các bài kiểm tra mẫu THPT Nguyễn Huệ
          </p>
        </div>

        <button
          onClick={resetAllToDemoData}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Khôi Phục Dữ Liệu Gốc
        </button>
      </div>
    </div>
  );
};
