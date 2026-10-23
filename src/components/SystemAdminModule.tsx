import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sliders,
  Shield,
  Users,
  CheckCircle,
  XCircle,
  Database,
  RefreshCw,
  Download,
  Upload,
  Lock,
  Key,
} from 'lucide-react';

export const SystemAdminModule: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    isDemoMode,
    setIsDemoMode,
    resetAllToDemoData,
    showToast,
    students,
    classes,
    lessons,
    assignments,
    grades,
  } = useApp();

  const handleExportFullSystemJSON = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      school: 'THPT Nguyễn Huệ',
      teacher: 'Tấn Thanh',
      classes,
      students,
      lessons,
      assignments,
      grades,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_hue_learning_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Đã xuất bản sao lưu hệ thống toàn diện dưới dạng file JSON.');
  };

  const permissionsMatrix = [
    {
      feature: 'Xem thông tin lớp học & danh sách',
      admin: true,
      teacher: true,
      student: true,
    },
    {
      feature: 'Tạo, sửa, xóa lớp học',
      admin: true,
      teacher: true,
      student: false,
    },
    {
      feature: 'Nhập điểm & chỉnh sửa sổ điểm',
      admin: true,
      teacher: true,
      student: false,
    },
    {
      feature: 'Tạo đề kiểm tra & xuất bản',
      admin: true,
      teacher: true,
      student: false,
    },
    {
      feature: 'Làm bài kiểm tra & nộp bài trực tuyến',
      admin: true,
      teacher: true,
      student: true,
    },
    {
      feature: 'Chấm bài kiểm tra & nhận xét học sinh',
      admin: true,
      teacher: true,
      student: false,
    },
    {
      feature: 'Sử dụng Trợ lý AI giáo dục (Gemini)',
      admin: true,
      teacher: true,
      student: false,
    },
    {
      feature: 'Cấu hình hệ thống & Khôi phục dữ liệu',
      admin: true,
      teacher: false,
      student: false,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#0B3B70] flex items-center gap-2">
            <Sliders className="w-6 h-6 text-[#0879D9]" />
            Quản Trị Hệ Thống & Phân Quyền Vai Trò
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Phân định quyền hạn giữa Ban Quản trị, Giáo viên bộ môn (Thầy Tấn Thanh) và Học sinh
          </p>
        </div>

        <button
          onClick={handleExportFullSystemJSON}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0879D9] hover:bg-[#0663b3] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
        >
          <Download className="w-4 h-4" />
          Sao Lưu Hệ Thống (JSON)
        </button>
      </div>

      {/* Role Switcher Sandbox */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-[#0B3B70] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#0879D9]" />
          Thử Nghiệm Chuyển Đổi Vai Trò Người Dùng (Sandbox Role Test)
        </h3>
        <p className="text-xs text-slate-600">
          Chuyển đổi vai trò để kiểm tra cơ chế phân quyền bảo mật giao diện và máy chủ:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div
            onClick={() => {
              setCurrentRole('teacher');
              showToast('success', 'Đã kích hoạt vai trò Thầy Tấn Thanh (Giáo viên Hóa học).');
            }}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              currentRole === 'teacher'
                ? 'bg-blue-50/80 border-[#0879D9] shadow-sm'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-[#0B3B70]">👨‍🏫 Giáo Viên</span>
              {currentRole === 'teacher' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#0879D9] text-white font-bold">
                  Đang dùng
                </span>
              )}
            </div>
            <p className="text-slate-600 font-medium">Thầy Tấn Thanh (Môn Hóa học)</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Quyền quản lý 5 lớp, sổ điểm, đề thi, AI trợ lý và tài liệu số.
            </p>
          </div>

          <div
            onClick={() => {
              setCurrentRole('admin');
              showToast('success', 'Đã kích hoạt vai trò Quản Trị Viên (Ban Giám Hiệu).');
            }}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              currentRole === 'admin'
                ? 'bg-purple-50/80 border-purple-500 shadow-sm'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-purple-900">🛡️ Quản Trị Viên</span>
              {currentRole === 'admin' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-600 text-white font-bold">
                  Đang dùng
                </span>
              )}
            </div>
            <p className="text-slate-600 font-medium">Ban Giám Hiệu THPT Nguyễn Huệ</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Toàn quyền cấu hình hệ thống, quản lý tài khoản và sao lưu dữ liệu.
            </p>
          </div>

          <div
            onClick={() => {
              setCurrentRole('student');
              showToast('info', 'Đã chuyển sang vai trò Học Sinh (Nguyễn Văn A - Lớp 10A1).');
            }}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              currentRole === 'student'
                ? 'bg-amber-50/80 border-amber-500 shadow-sm'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-amber-900">🎓 Học Sinh</span>
              {currentRole === 'student' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-600 text-white font-bold">
                  Đang dùng
                </span>
              )}
            </div>
            <p className="text-slate-600 font-medium">Nguyễn Văn A (Lớp 10A1)</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Chỉ được xem tài liệu giao cho lớp, làm bài kiểm tra và xem điểm cá nhân.
            </p>
          </div>
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-sm text-[#0B3B70]">
            Bảng Ma Trận Phân Quyền Chi Tiết (Role-Based Access Control)
          </h3>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full">
            <thead className="bg-[#0B3B70] text-white">
              <tr>
                <th className="py-2.5 px-3 text-left">Chức năng hệ thống</th>
                <th className="py-2.5 px-3 text-center">Quản Trị Viên (Admin)</th>
                <th className="py-2.5 px-3 text-center">Giáo Viên (Thầy Tấn Thanh)</th>
                <th className="py-2.5 px-3 text-center">Học Sinh THPT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{item.feature}</td>
                  <td className="py-2.5 px-3 text-center">
                    {item.admin ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {item.teacher ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {item.student ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Database & Demo Management */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-[#0B3B70] flex items-center gap-2">
          <Database className="w-4 h-4 text-[#0879D9]" />
          Trạng Thái Dữ Liệu & Khôi Phục Dữ Liệu Mẫu
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="font-bold text-slate-800 block text-sm">
              Chế độ dữ liệu mẫu (DEMO MODE):{' '}
              <span className={isDemoMode ? 'text-amber-600' : 'text-emerald-600'}>
                {isDemoMode ? 'ĐANG BẬT (Dữ liệu mô phỏng)' : 'ĐÃ TẮT (Chế độ thật)'}
              </span>
            </span>
            <p className="text-slate-500 mt-0.5">
              Toàn bộ dữ liệu lớp học, học sinh, điểm số môn Hóa học và bài giảng được lưu trữ an toàn trong bộ nhớ máy chủ và trình duyệt.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setIsDemoMode(!isDemoMode);
                showToast('info', `Đã chuyển sang ${!isDemoMode ? 'Chế độ Demo' : 'Chế độ Dữ liệu thật'}.`);
              }}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg"
            >
              Chuyển Chế Độ
            </button>
            <button
              onClick={resetAllToDemoData}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Đặt Lại Dữ Liệu Mẫu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
