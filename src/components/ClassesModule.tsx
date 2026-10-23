import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClassItem } from '../types';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit2,
  Trash2,
  Eye,
  BookOpen,
  GraduationCap,
  Sparkles,
  X,
  FileSpreadsheet,
} from 'lucide-react';

export const ClassesModule: React.FC = () => {
  const {
    classes,
    students,
    assignments,
    addClass,
    updateClass,
    deleteClass,
    setActiveTab,
    showToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [selectedYear, setSelectedYear] = useState('2024-2025');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [viewingClassDetail, setViewingClassDetail] = useState<ClassItem | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    grade: 10 as 10 | 11 | 12,
    schoolYear: '2024-2025',
    subject: 'Hóa học',
    room: '',
    studentCount: 30,
    description: '',
  });

  const handleOpenAdd = () => {
    setFormData({
      code: '',
      name: '',
      grade: 10,
      schoolYear: '2024-2025',
      subject: 'Hóa học',
      room: 'Phòng 201 - Dãy A',
      studentCount: 30,
      description: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (cls: ClassItem) => {
    setEditingClass(cls);
    setFormData({
      code: cls.code,
      name: cls.name,
      grade: cls.grade,
      schoolYear: cls.schoolYear,
      subject: cls.subject,
      room: cls.room,
      studentCount: cls.studentCount,
      description: cls.description,
    });
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      showToast('error', 'Vui lòng nhập đầy đủ mã lớp và tên lớp.');
      return;
    }

    if (editingClass) {
      updateClass(editingClass.id, formData);
      setEditingClass(null);
    } else {
      addClass(formData);
      setIsAddModalOpen(false);
    }
  };

  const filteredClasses = classes.filter((cls) => {
    const matchGrade = selectedGrade === 'all' || cls.grade === selectedGrade;
    const matchYear = !selectedYear || cls.schoolYear === selectedYear;
    const matchSearch =
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.room.toLowerCase().includes(searchTerm.toLowerCase());
    return matchGrade && matchYear && matchSearch;
  });

  const exportClassesCSV = () => {
    const headers = ['Mã Lớp', 'Tên Lớp', 'Khối', 'Năm Học', 'Môn Học', 'Phòng Học', 'Sĩ Số', 'Mô Tả'];
    const rows = filteredClasses.map((c) => [
      c.code,
      `"${c.name}"`,
      c.grade,
      c.schoolYear,
      `"${c.subject}"`,
      `"${c.room}"`,
      c.studentCount,
      `"${c.description}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Danh_sach_lop_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Đã xuất file CSV danh sách lớp học thành công.');
  };

  return (
    <div className="space-y-4">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#0B3B70] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#0879D9]" />
            Quản Lý Lớp Học Của Tôi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Phân công giảng dạy môn Hóa học - Trường THPT Nguyễn Huệ
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={exportClassesCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Xuất CSV
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0879D9] hover:bg-[#0663b3] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Tạo Lớp Mới
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Khối:</span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value === 'all' ? 'all' : Number(e.target.value) as any)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Tất cả các khối</option>
              <option value="10">Khối 10</option>
              <option value="11">Khối 11</option>
              <option value="12">Khối 12</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Năm học:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="2024-2025">2024 - 2025</option>
              <option value="2025-2026">2025 - 2026</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên lớp, mã, phòng..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses.map((cls) => {
          const classStudents = students.filter(
            (s) => s.classId === cls.id || s.className === cls.code
          );
          const studentCount = classStudents.length > 0 ? classStudents.length : cls.studentCount;
          const avgScore = classStudents.length
            ? Math.round(
                (classStudents.reduce((acc, s) => acc + s.avgScore, 0) / classStudents.length) * 10
              ) / 10
            : 7.5;

          return (
            <div
              key={cls.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-4.5 flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#0B3B70]">{cls.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#0879D9] uppercase">
                        Khối {cls.grade}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{cls.room}</p>
                  </div>

                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                    {cls.schoolYear}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 my-3 line-clamp-2 italic">
                  {cls.description || 'Chưa có ghi chú cho lớp học.'}
                </p>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Sĩ số:</span>
                    <strong className="text-slate-800 text-sm">{studentCount} học sinh</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Điểm TB môn:</span>
                    <strong className="text-blue-700 text-sm">{String(avgScore).replace('.', ',')} /10</strong>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4 text-xs">
                <button
                  onClick={() => setViewingClassDetail(cls)}
                  className="flex items-center gap-1 text-[#0879D9] hover:underline font-semibold"
                >
                  <Eye className="w-3.5 h-3.5" /> Chi tiết lớp
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(cls)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Chỉnh sửa thông tin lớp"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(cls.id)}
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Xóa lớp học"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredClasses.length === 0 && (
        <div className="bg-white p-8 rounded-xl text-center text-slate-500 border border-slate-200">
          <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="font-semibold">Không tìm thấy lớp học phù hợp với bộ lọc.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedGrade('all');
            }}
            className="text-xs text-[#0879D9] hover:underline mt-2 font-medium"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {/* Add / Edit Class Modal */}
      {(isAddModalOpen || editingClass) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0B3B70] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0879D9]" />
                {editingClass ? 'Chỉnh Sửa Thông Tin Lớp Học' : 'Tạo Lớp Học Mới'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingClass(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-3.5 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mã lớp (VD: 10A1): *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="10A1"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tên lớp: *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="Lớp 10A1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Khối:</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: Number(e.target.value) as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value={10}>Khối 10</option>
                    <option value={11}>Khối 11</option>
                    <option value={12}>Khối 12</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Năm học:</label>
                  <select
                    value={formData.schoolYear}
                    onChange={(e) => setFormData({ ...formData, schoolYear: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sĩ số dự kiến:</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.studentCount}
                    onChange={(e) => setFormData({ ...formData, studentCount: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Môn giảng dạy:</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phòng học:</label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="Phòng 201 - Dãy A"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô tả / Đặc điểm lớp học:</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ví dụ: Lớp chuyên định hướng Khoa học Tự nhiên..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingClass(null);
                  }}
                  className="px-3.5 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0879D9] hover:bg-[#0663b3] text-white rounded-lg font-bold shadow-sm"
                >
                  {editingClass ? 'Lưu Thay Đổi' : 'Tạo Lớp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5 text-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Xác nhận xóa lớp học</h3>
            <p className="text-slate-600">
              Bạn có chắc chắn muốn xóa lớp học này? Thao tác này sẽ không xóa hồ sơ học sinh nhưng sẽ gỡ lớp khỏi danh sách hiển thị.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  deleteClass(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Class Detail Modal */}
      {viewingClassDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-5 animate-in fade-in">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#0B3B70] flex items-center gap-2">
                  {viewingClassDetail.name} ({viewingClassDetail.code})
                  <span className="text-xs bg-blue-100 text-[#0879D9] px-2 py-0.5 rounded font-normal">
                    {viewingClassDetail.room}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{viewingClassDetail.description}</p>
              </div>
              <button
                onClick={() => setViewingClassDetail(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Students in this class */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#0879D9]" />
                    Danh sách học sinh lớp {viewingClassDetail.code}
                  </h4>
                  <button
                    onClick={() => {
                      setViewingClassDetail(null);
                      setActiveTab('students');
                    }}
                    className="text-[#0879D9] hover:underline font-semibold"
                  >
                    Mở trang quản lý học sinh &rarr;
                  </button>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-1.5 px-3 text-left">Mã HS</th>
                        <th className="py-1.5 px-3 text-left">Họ và tên</th>
                        <th className="py-1.5 px-3 text-center">Trạng thái</th>
                        <th className="py-1.5 px-3 text-center">Điểm TB</th>
                        <th className="py-1.5 px-3 text-center">Số bài hoàn thành</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students
                        .filter(
                          (s) =>
                            s.classId === viewingClassDetail.id ||
                            s.className === viewingClassDetail.code
                        )
                        .map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-mono font-medium text-slate-700">{s.code}</td>
                            <td className="py-2 px-3 font-bold text-slate-800">{s.name}</td>
                            <td className="py-2 px-3 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 font-medium">
                                {s.statusText}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-center font-bold text-blue-700">
                              {String(s.avgScore).replace('.', ',')}
                            </td>
                            <td className="py-2 px-3 text-center text-slate-600">
                              {s.completedAssignments} bài
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => setViewingClassDetail(null)}
                className="px-4 py-1.5 bg-[#0B3B70] text-white rounded-lg text-xs font-bold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
