import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import {
  UserCheck,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit2,
  Trash2,
  Eye,
  ArrowUpDown,
  X,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  Award,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const StudentsModule: React.FC = () => {
  const {
    students,
    classes,
    addStudent,
    updateStudent,
    deleteStudent,
    importStudents,
    selectedStudentId,
    setSelectedStudentId,
    showToast,
    setActiveTab,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'score_asc' | 'score_desc'>('name');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Student profile modal
  const viewingStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || null;
  }, [students, selectedStudentId]);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    classId: 'class-10a1',
    className: '10A1',
    dob: '2009-01-01',
    gender: 'Nam' as 'Nam' | 'Nữ',
    phone: '',
    parentPhone: '',
    email: '',
    status: 'normal' as 'normal' | 'support_needed' | 'excellent' | 'warning',
    statusText: 'Đạt chuẩn',
    avgScore: 7.0,
    completedAssignments: 3,
    pendingAssignments: 0,
    teacherNote: '',
  });

  const handleOpenAdd = () => {
    const nextCode = `HS${String(students.length + 1).padStart(3, '0')}`;
    setFormData({
      code: nextCode,
      name: '',
      classId: classes[0]?.id || 'class-10a1',
      className: classes[0]?.name || '10A1',
      dob: '2009-05-15',
      gender: 'Nam',
      phone: '',
      parentPhone: '',
      email: '',
      status: 'normal',
      statusText: 'Đạt chuẩn',
      avgScore: 7.0,
      completedAssignments: 2,
      pendingAssignments: 0,
      teacherNote: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      code: student.code,
      name: student.name,
      classId: student.classId,
      className: student.className,
      dob: student.dob,
      gender: student.gender,
      phone: student.phone,
      parentPhone: student.parentPhone,
      email: student.email,
      status: student.status,
      statusText: student.statusText,
      avgScore: student.avgScore,
      completedAssignments: student.completedAssignments,
      pendingAssignments: student.pendingAssignments,
      teacherNote: student.teacherNote,
    });
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      showToast('error', 'Vui lòng nhập họ tên và mã học sinh.');
      return;
    }

    // Determine status text based on status
    let autoStatusText = formData.statusText;
    if (formData.status === 'warning') autoStatusText = 'Điểm thấp (<5)';
    else if (formData.status === 'support_needed') autoStatusText = 'Chưa nộp bài';
    else if (formData.status === 'excellent') autoStatusText = 'Xuất sắc';
    else if (formData.status === 'normal') autoStatusText = 'Đạt chuẩn';

    const selectedCls = classes.find((c) => c.id === formData.classId);
    const resolvedClassName = selectedCls ? selectedCls.code : formData.className;

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        ...formData,
        className: resolvedClassName,
        statusText: autoStatusText,
      });
      setEditingStudent(null);
    } else {
      addStudent({
        ...formData,
        className: resolvedClassName,
        statusText: autoStatusText,
      });
      setIsAddModalOpen(false);
    }
  };

  // CSV Import handler
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          showToast('error', 'File không đúng định dạng hoặc không có dòng dữ liệu.');
          return;
        }

        const newItems: Partial<Student>[] = [];
        // Skip header
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
          if (parts[0] && parts[1]) {
            newItems.push({
              code: parts[0],
              name: parts[1],
              className: parts[2] || '10A1',
              dob: parts[3] || '2009-01-01',
              phone: parts[4] || '',
              parentPhone: parts[5] || '',
              avgScore: parts[6] ? parseFloat(parts[6]) : 7.0,
            });
          }
        }

        if (newItems.length > 0) {
          importStudents(newItems);
        } else {
          showToast('error', 'Không tìm thấy dòng dữ liệu học sinh hợp lệ.');
        }
      } catch (err) {
        showToast('error', 'Lỗi khi đọc file CSV.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // CSV Export
  const exportStudentsCSV = () => {
    const headers = [
      'Mã HS',
      'Họ và Tên',
      'Lớp',
      'Ngày Sinh',
      'Giới Tính',
      'SĐT Học Sinh',
      'SĐT Phụ Huynh',
      'Email',
      'Trạng Thái',
      'Điểm Trung Bình',
      'Đã Hoàn Thành',
      'Chưa Hoàn Thành',
      'Nhận Xét Giáo Viên',
    ];

    const rows = sortedAndFilteredStudents.map((s) => [
      s.code,
      `"${s.name}"`,
      s.className,
      s.dob,
      s.gender,
      s.phone,
      s.parentPhone,
      s.email,
      `"${s.statusText}"`,
      s.avgScore,
      s.completedAssignments,
      s.pendingAssignments,
      `"${s.teacherNote.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Danh_sach_hoc_sinh_THPT_Nguyen_Hue.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Đã xuất file CSV học sinh thành công.');
  };

  // Filter & Sort
  const sortedAndFilteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        const matchClass =
          selectedClass === 'all' || s.classId === selectedClass || s.className === selectedClass;
        const matchStatus = selectedStatus === 'all' || s.status === selectedStatus;
        const matchSearch =
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.className.toLowerCase().includes(searchTerm.toLowerCase());
        return matchClass && matchStatus && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name, 'vi');
        } else if (sortBy === 'score_asc') {
          return a.avgScore - b.avgScore;
        } else if (sortBy === 'score_desc') {
          return b.avgScore - a.avgScore;
        }
        return 0;
      });
  }, [students, searchTerm, selectedClass, selectedStatus, sortBy]);

  return (
    <div className="space-y-4">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#0B3B70] flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-[#0879D9]" />
            Hồ Sơ & Danh Sách Học Sinh
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý thông tin, theo dõi kết quả rèn luyện và tiến bộ học tập môn Hóa học
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            Nhập CSV
            <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
          </label>

          <button
            onClick={exportStudentsCSV}
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
            Thêm Học Sinh
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Class Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Lớp:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Tất cả các lớp ({students.length})</option>
              {classes.map((c) => (
                <option key={c.id} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Tình trạng:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Tất cả tình trạng</option>
              <option value="normal">Đạt chuẩn</option>
              <option value="support_needed">Chưa nộp bài / Cần theo dõi</option>
              <option value="warning">Điểm thấp (&lt;5)</option>
              <option value="excellent">Xuất sắc</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="name">Sắp xếp: Tên A-Z</option>
              <option value="score_desc">Điểm TB: Giảm dần</option>
              <option value="score_asc">Điểm TB: Tăng dần</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên, mã HS..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main Student Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#0B3B70] text-white">
              <tr>
                <th className="py-2.5 px-3 text-center w-12 font-bold">STT</th>
                <th className="py-2.5 px-3 text-left font-bold">Mã HS</th>
                <th className="py-2.5 px-3 text-left font-bold">Họ và tên</th>
                <th className="py-2.5 px-3 text-center font-bold">Lớp</th>
                <th className="py-2.5 px-3 text-center font-bold">Ngày sinh</th>
                <th className="py-2.5 px-3 text-center font-bold">Liên hệ PH</th>
                <th className="py-2.5 px-3 text-center font-bold">Tình trạng</th>
                <th className="py-2.5 px-3 text-center font-bold">Điểm TB</th>
                <th className="py-2.5 px-3 text-center font-bold">Đã nộp</th>
                <th className="py-2.5 px-3 text-center font-bold">Chưa nộp</th>
                <th className="py-2.5 px-3 text-center font-bold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedAndFilteredStudents.map((s, idx) => (
                <tr key={s.id} className="hover:bg-blue-50/60 transition-colors">
                  <td className="py-2.5 px-3 text-center font-semibold text-slate-500">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{s.code}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                    {s.name}
                    {s.avgScore >= 9.0 && (
                      <span title="Học sinh tiêu biểu" className="text-amber-500">
                        ⭐
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center font-semibold text-slate-700">{s.className}</td>
                  <td className="py-2.5 px-3 text-center text-slate-500">{s.dob}</td>
                  <td className="py-2.5 px-3 text-center text-slate-600 font-mono text-[11px]">
                    {s.parentPhone || 'Chưa cập nhật'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.statusText.includes('Chưa nộp bài')
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : s.statusText.includes('Điểm thấp')
                          ? 'bg-red-100 text-red-700 border border-red-300'
                          : s.statusText.includes('Xuất sắc')
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}
                    >
                      {s.statusText}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-sm text-blue-700">
                    {String(s.avgScore).replace('.', ',')}
                  </td>
                  <td className="py-2.5 px-3 text-center font-semibold text-emerald-600">
                    {s.completedAssignments}
                  </td>
                  <td className="py-2.5 px-3 text-center font-semibold text-amber-600">
                    {s.pendingAssignments}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedStudentId(s.id)}
                        className="p-1 text-[#0879D9] hover:bg-blue-100 rounded transition-colors"
                        title="Xem hồ sơ chi tiết & tiến độ"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                        title="Sửa thông tin"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(s.id)}
                        className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Xóa học sinh"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedAndFilteredStudents.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            <UserCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-sm">Không tìm thấy học sinh nào phù hợp.</p>
          </div>
        )}

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>
            Hiển thị <strong>{sortedAndFilteredStudents.length}</strong> / <strong>{students.length}</strong> học sinh
          </span>
          <span className="italic">
            *Dữ liệu được cập nhật tự động khi nhập điểm hoặc chấm bài kiểm tra
          </span>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {(isAddModalOpen || editingStudent) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0B3B70] flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#0879D9]" />
                {editingStudent ? `Chỉnh Sửa Hồ Sơ: ${editingStudent.name}` : 'Thêm Học Sinh Mới'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingStudent(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3.5 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mã học sinh: *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="HS001"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Họ và tên: *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lớp:</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => {
                      const c = classes.find((cl) => cl.id === e.target.value);
                      setFormData({
                        ...formData,
                        classId: e.target.value,
                        className: c ? c.code : '10A1',
                      });
                    }}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ngày sinh:</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giới tính:</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SĐT Học sinh:</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="090..."
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SĐT Phụ huynh (Liên lạc):</label>
                  <input
                    type="tel"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="098..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tình trạng học tập:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="normal">Đạt chuẩn</option>
                    <option value="support_needed">Cần hỗ trợ / Chưa nộp bài</option>
                    <option value="warning">Cảnh báo / Điểm thấp (&lt;5)</option>
                    <option value="excellent">Xuất sắc</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Điểm TB ban đầu:</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    max={10}
                    value={formData.avgScore}
                    onChange={(e) => setFormData({ ...formData, avgScore: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ghi chú của giáo viên:</label>
                <textarea
                  rows={2}
                  value={formData.teacherNote}
                  onChange={(e) => setFormData({ ...formData, teacherNote: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="Điểm mạnh, nội dung cần kèm cặp thêm..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingStudent(null);
                  }}
                  className="px-3.5 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0879D9] hover:bg-[#0663b3] text-white rounded-lg font-bold shadow-sm"
                >
                  {editingStudent ? 'Lưu Hồ Sơ' : 'Thêm Học Sinh'}
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
            <h3 className="text-base font-bold text-slate-900">Xác nhận xóa học sinh</h3>
            <p className="text-slate-600">
              Bạn có chắc chắn muốn xóa học sinh này khỏi hệ thống? Dữ liệu điểm số và bài nộp liên quan cũng sẽ bị gỡ.
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
                  deleteStudent(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
              >
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9 & 10: Detailed Student Profile Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-blue-100 border-2 border-[#0879D9] flex items-center justify-center text-xl font-bold text-[#0B3B70]">
                  {viewingStudent.name.charAt(viewingStudent.name.lastIndexOf(' ') + 1) || 'A'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0B3B70] flex items-center gap-2">
                    {viewingStudent.name}
                    <span className="text-xs bg-blue-100 text-[#0879D9] px-2.5 py-0.5 rounded font-mono font-semibold">
                      {viewingStudent.code}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Lớp: <strong className="text-slate-800">{viewingStudent.className}</strong> • Ngày sinh:{' '}
                    {viewingStudent.dob} • Giới tính: {viewingStudent.gender}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudentId(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="mt-4 space-y-4 text-xs">
              {/* Top stats bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">Điểm trung bình:</span>
                  <span className="text-xl font-bold text-blue-700">
                    {String(viewingStudent.avgScore).replace('.', ',')} /10
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Tình trạng:</span>
                  <span className="font-bold text-amber-700">{viewingStudent.statusText}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Bài hoàn thành:</span>
                  <span className="font-bold text-emerald-600">{viewingStudent.completedAssignments} bài</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Bài chưa nộp:</span>
                  <span className="font-bold text-amber-600">{viewingStudent.pendingAssignments} bài</span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-[#0B3B70]">
                  Thông Tin Liên Lạc Gia Đình
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    SĐT Phụ huynh: <strong>{viewingStudent.parentPhone || 'Chưa cập nhật'}</strong>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    SĐT Học sinh: <strong>{viewingStudent.phone || 'Chưa cập nhật'}</strong>
                  </p>
                  <p className="flex items-center gap-2 sm:col-span-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Email học đường: <strong>{viewingStudent.email || `${viewingStudent.code.toLowerCase()}@thptnguyenhue.edu.vn`}</strong>
                  </p>
                </div>
              </div>

              {/* Teacher Assessment & Recommended Study Focus */}
              <div className="bg-blue-50/70 p-3.5 rounded-lg border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#0B3B70] flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#0879D9]" />
                    Đánh Giá Của Giáo Viên (Thầy Tấn Thanh)
                  </h4>
                  <button
                    onClick={() => {
                      setActiveTab('ai_assistant');
                      setSelectedStudentId(null);
                    }}
                    className="text-[11px] text-[#0879D9] font-bold hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Dùng AI gợi ý nhận xét & lộ trình
                  </button>
                </div>
                <p className="text-slate-700 italic font-serif text-[13px] leading-relaxed">
                  “{viewingStudent.teacherNote || 'Học sinh có ý thức học tập tốt, cần duy trì chuyên cần và rèn thêm phản xạ làm bài trắc nghiệm.'}”
                </p>
              </div>

              {/* Exam & Assignment History */}
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-2">
                  Lịch Sử Các Bài Kiểm Tra & Bài Làm
                </h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3 text-left">Bài kiểm tra</th>
                        <th className="py-2 px-3 text-center">Ngày thực hiện</th>
                        <th className="py-2 px-3 text-center">Điểm số</th>
                        <th className="py-2 px-3 text-center">Trạng thái</th>
                        <th className="py-2 px-3 text-left">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {viewingStudent.examRecords.length > 0 ? (
                        viewingStudent.examRecords.map((ex, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-semibold text-slate-800">{ex.examTitle}</td>
                            <td className="py-2 px-3 text-center text-slate-500">{ex.date}</td>
                            <td className="py-2 px-3 text-center font-bold text-blue-700">
                              {ex.score > 0 ? `${ex.score} / ${ex.maxScore}` : '—'}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  ex.status === 'passed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : ex.status === 'failed'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {ex.status === 'passed' ? 'Đạt' : ex.status === 'failed' ? 'Chưa đạt' : 'Chưa nộp'}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-slate-500 italic">{ex.note || '—'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-slate-400">
                            Chưa có dữ liệu lịch sử bài kiểm tra chi tiết.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => {
                  handleOpenEdit(viewingStudent);
                  setSelectedStudentId(null);
                }}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" /> Chỉnh sửa hồ sơ
              </button>

              <button
                onClick={() => setSelectedStudentId(null)}
                className="px-4 py-1.5 bg-[#0B3B70] text-white rounded-lg text-xs font-bold"
              >
                Đóng hồ sơ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
