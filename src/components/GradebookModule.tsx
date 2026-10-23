import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StudentGrade } from '../types';
import {
  Award,
  Download,
  Printer,
  Search,
  Filter,
  ArrowUpDown,
  Settings,
  Edit2,
  Save,
  CheckCircle2,
  Sliders,
  History,
  X,
  User,
} from 'lucide-react';

export const GradebookModule: React.FC = () => {
  const {
    grades,
    classes,
    updateGradeRecord,
    gradeRule,
    setGradeRule,
    showToast,
    setSelectedStudentId,
    setActiveTab,
  } = useApp();

  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedScoreRange, setSelectedScoreRange] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'name' | 'avg_desc' | 'avg_asc'>('name');

  // Inline editing state: { studentId: { tx1, tx2, tx3, tx4, gk, ck, teacherNote } }
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<StudentGrade>>({});

  // Formula config modal
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [tempRule, setTempRule] = useState(gradeRule);

  // Filtered and sorted grades
  const filteredGrades = useMemo(() => {
    return grades
      .filter((g) => {
        const matchClass =
          selectedClass === 'all' || g.classId === selectedClass || g.className === selectedClass;
        const matchSearch =
          g.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.className.toLowerCase().includes(searchTerm.toLowerCase());

        let matchRange = true;
        if (selectedScoreRange === 'under5') matchRange = g.avgScore < 5.0;
        else if (selectedScoreRange === '5to6.5') matchRange = g.avgScore >= 5.0 && g.avgScore < 6.5;
        else if (selectedScoreRange === '6.5to8') matchRange = g.avgScore >= 6.5 && g.avgScore < 8.0;
        else if (selectedScoreRange === '8to10') matchRange = g.avgScore >= 8.0;

        return matchClass && matchSearch && matchRange;
      })
      .sort((a, b) => {
        if (sortField === 'name') return a.studentName.localeCompare(b.studentName, 'vi');
        if (sortField === 'avg_desc') return b.avgScore - a.avgScore;
        if (sortField === 'avg_asc') return a.avgScore - b.avgScore;
        return 0;
      });
  }, [grades, selectedClass, searchTerm, selectedScoreRange, sortField]);

  const handleStartEdit = (record: StudentGrade) => {
    setEditingId(record.studentId);
    setEditValues({
      tx1: record.tx1,
      tx2: record.tx2,
      tx3: record.tx3,
      tx4: record.tx4,
      gk: record.gk,
      ck: record.ck,
      teacherNote: record.teacherNote,
    });
  };

  const handleSaveEdit = (studentId: string) => {
    updateGradeRecord(studentId, editValues);
    setEditingId(null);
    setEditValues({});
  };

  const handlePrintGradebook = () => {
    window.print();
  };

  const exportGradebookCSV = () => {
    const headers = [
      'Mã HS',
      'Họ và Tên',
      'Lớp',
      'TX1',
      'TX2',
      'TX3',
      'TX4',
      'Giữa Kỳ (GK)',
      'Cuối Kỳ (CK)',
      'Điểm TB Môn',
      'Nhận Xét Của Giáo Viên',
      'Cập Nhật Lúc',
    ];

    const rows = filteredGrades.map((g) => [
      g.studentCode,
      `"${g.studentName}"`,
      g.className,
      g.tx1 ?? '',
      g.tx2 ?? '',
      g.tx3 ?? '',
      g.tx4 ?? '',
      g.gk ?? '',
      g.ck ?? '',
      g.avgScore,
      `"${(g.teacherNote || '').replace(/"/g, '""')}"`,
      `"${g.lastUpdated}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `So_diem_dien_tu_THPT_Nguyen_Hue_${selectedClass}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Đã xuất file CSV sổ điểm điện tử.');
  };

  return (
    <div className="space-y-4 printable-content">
      {/* Official School Header for Print View */}
      <div className="hidden print:block text-center pb-4 border-b-2 border-black mb-4">
        <p className="text-sm uppercase font-bold">SỞ GIÁO DỤC VÀ ĐÀO TẠO THÀNH PHỐ HUẾ</p>
        <p className="text-base uppercase font-bold text-black">TRƯỜNG THPT NGUYỄN HUỆ</p>
        <h2 className="text-xl font-bold uppercase mt-2">BẢNG TỔNG HỢP ĐIỂM HỌC KỲ II - MÔN HÓA HỌC</h2>
        <p className="text-xs italic">
          Giáo viên giảng dạy: Thầy Tấn Thanh • Năm học: 2024 - 2025
        </p>
      </div>

      {/* Action / Title Bar */}
      <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#0B3B70] flex items-center gap-2">
            <Award className="w-6 h-6 text-[#0879D9]" />
            Sổ Điểm Điện Tử Môn Hóa Học
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quy chế đánh giá theo Thông tư 22/2021/TT-BGDĐT • Thầy Tấn Thanh
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setTempRule(gradeRule);
              setIsConfigModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors"
            title="Cấu hình hệ số & công thức tính điểm"
          >
            <Sliders className="w-3.5 h-3.5" />
            Cấu Hình Hệ Số (1-2-3)
          </button>

          <button
            onClick={handlePrintGradebook}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            In Bảng Điểm
          </button>

          <button
            onClick={exportGradebookCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0879D9] hover:bg-[#0663b3] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            Xuất Bảng Điểm CSV
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="no-print bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Class Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Lớp:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Tất cả các lớp</option>
              {classes.map((c) => (
                <option key={c.id} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Score Range Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Khoảng điểm TB:</span>
            <select
              value={selectedScoreRange}
              onChange={(e) => setSelectedScoreRange(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Tất cả mức điểm</option>
              <option value="8to10">Giỏi / Xuất sắc (≥ 8.0)</option>
              <option value="6.5to8">Khá (6.5 - 7.9)</option>
              <option value="5to6.5">Trung bình (5.0 - 6.4)</option>
              <option value="under5">Cần hỗ trợ (&lt; 5.0)</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="name">Tên học sinh (A-Z)</option>
              <option value="avg_desc">Điểm TB môn (Cao đến thấp)</option>
              <option value="avg_asc">Điểm TB môn (Thấp đến cao)</option>
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
            placeholder="Tìm theo tên học sinh, mã..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main Gradebook Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-[#0B3B70] text-white">
              <tr>
                <th rowSpan={2} className="py-2 px-2 text-center border border-blue-900 w-10 font-bold">
                  STT
                </th>
                <th rowSpan={2} className="py-2 px-2.5 text-left border border-blue-900 font-bold">
                  Mã HS
                </th>
                <th rowSpan={2} className="py-2 px-3 text-left border border-blue-900 font-bold min-w-[140px]">
                  Họ và tên
                </th>
                <th rowSpan={2} className="py-2 px-2 text-center border border-blue-900 font-bold">
                  Lớp
                </th>
                <th colSpan={4} className="py-1 px-2 text-center border border-blue-900 font-bold bg-blue-900/60">
                  Kiểm tra thường xuyên (Hệ số {gradeRule.txWeight})
                </th>
                <th rowSpan={2} className="py-2 px-2 text-center border border-blue-900 font-bold bg-blue-900/80">
                  Giữa kỳ (HS {gradeRule.gkWeight})
                </th>
                <th rowSpan={2} className="py-2 px-2 text-center border border-blue-900 font-bold bg-blue-900/80">
                  Cuối kỳ (HS {gradeRule.ckWeight})
                </th>
                <th rowSpan={2} className="py-2 px-3 text-center border border-blue-900 font-bold bg-[#0879D9] text-white">
                  ĐTB Môn
                </th>
                <th rowSpan={2} className="py-2 px-3 text-left border border-blue-900 font-bold min-w-[200px]">
                  Nhận xét của giáo viên
                </th>
                <th rowSpan={2} className="no-print py-2 px-2 text-center border border-blue-900 font-bold w-16">
                  Thao tác
                </th>
              </tr>
              <tr>
                <th className="py-1 px-1.5 text-center border border-blue-900 font-semibold text-[11px]">TX1</th>
                <th className="py-1 px-1.5 text-center border border-blue-900 font-semibold text-[11px]">TX2</th>
                <th className="py-1 px-1.5 text-center border border-blue-900 font-semibold text-[11px]">TX3</th>
                <th className="py-1 px-1.5 text-center border border-blue-900 font-semibold text-[11px]">TX4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredGrades.map((g, idx) => {
                const isEditing = editingId === g.studentId;

                return (
                  <tr key={g.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-2 px-2 text-center border border-slate-200 font-semibold text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-2.5 border border-slate-200 font-mono font-bold text-slate-700">
                      {g.studentCode}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 font-bold text-slate-900">
                      <span
                        onClick={() => {
                          setSelectedStudentId(g.studentId);
                          setActiveTab('students');
                        }}
                        className="hover:text-[#0879D9] cursor-pointer"
                        title="Xem hồ sơ học sinh"
                      >
                        {g.studentName}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center border border-slate-200 font-semibold text-slate-700">
                      {g.className}
                    </td>

                    {/* Regular scores TX1 - TX4 */}
                    {(['tx1', 'tx2', 'tx3', 'tx4'] as const).map((col) => (
                      <td key={col} className="py-1 px-1 text-center border border-slate-200 font-semibold">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.1"
                            min={0}
                            max={10}
                            value={editValues[col] ?? ''}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                [col]: e.target.value === '' ? undefined : parseFloat(e.target.value),
                              })
                            }
                            className="w-12 text-center border border-blue-400 rounded py-0.5 font-bold focus:outline-none"
                          />
                        ) : (
                          g[col] !== undefined ? String(g[col]).replace('.', ',') : '—'
                        )}
                      </td>
                    ))}

                    {/* Midterm GK */}
                    <td className="py-1 px-1 text-center border border-slate-200 font-bold text-blue-900 bg-blue-50/30">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.1"
                          min={0}
                          max={10}
                          value={editValues.gk ?? ''}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              gk: e.target.value === '' ? undefined : parseFloat(e.target.value),
                            })
                          }
                          className="w-12 text-center border border-blue-400 rounded py-0.5 font-bold focus:outline-none"
                        />
                      ) : (
                        g.gk !== undefined ? String(g.gk).replace('.', ',') : '—'
                      )}
                    </td>

                    {/* Final CK */}
                    <td className="py-1 px-1 text-center border border-slate-200 font-bold text-blue-900 bg-blue-50/30">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.1"
                          min={0}
                          max={10}
                          value={editValues.ck ?? ''}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              ck: e.target.value === '' ? undefined : parseFloat(e.target.value),
                            })
                          }
                          className="w-12 text-center border border-blue-400 rounded py-0.5 font-bold focus:outline-none"
                        />
                      ) : (
                        g.ck !== undefined ? String(g.ck).replace('.', ',') : '—'
                      )}
                    </td>

                    {/* Average Score */}
                    <td className="py-2 px-3 text-center border border-slate-200 font-bold text-sm bg-blue-100/40 text-blue-800">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded font-black ${
                          g.avgScore < 5.0
                            ? 'text-red-700 bg-red-100'
                            : g.avgScore >= 8.0
                            ? 'text-emerald-700 bg-emerald-100'
                            : 'text-blue-800'
                        }`}
                      >
                        {String(g.avgScore).replace('.', ',')}
                      </span>
                    </td>

                    {/* Teacher note */}
                    <td className="py-2 px-3 border border-slate-200 text-slate-600 italic">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues.teacherNote || ''}
                          onChange={(e) =>
                            setEditValues({ ...editValues, teacherNote: e.target.value })
                          }
                          className="w-full border border-blue-400 rounded px-1.5 py-0.5 text-xs focus:outline-none"
                          placeholder="Ghi chú đánh giá..."
                        />
                      ) : (
                        g.teacherNote || '—'
                      )}
                    </td>

                    {/* Inline Edit Buttons */}
                    <td className="no-print py-2 px-2 text-center border border-slate-200">
                      {isEditing ? (
                        <button
                          onClick={() => handleSaveEdit(g.studentId)}
                          className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-sm"
                          title="Lưu điểm vào sổ"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(g)}
                          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Chỉnh sửa điểm"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Grade summary stats */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span>
              Công thức ĐTB môn:{' '}
              <strong className="text-slate-800">
                (Tổng TX*{gradeRule.txWeight} + GK*{gradeRule.gkWeight} + CK*{gradeRule.ckWeight}) / (Số bài TX*{gradeRule.txWeight} + {gradeRule.gkWeight} + {gradeRule.ckWeight})
              </strong>
            </span>
          </div>
          <span className="text-[11px] text-slate-400 italic">
            *Điểm số được làm tròn 1 chữ số thập phân theo quy định Bộ GD&ĐT
          </span>
        </div>
      </div>

      {/* Weighting Configuration Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0B3B70] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#0879D9]" />
                Cấu Hình Trọng Số & Quy Tắc Tính Điểm
              </h3>
              <button onClick={() => setIsConfigModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 mt-4">
              <p className="text-slate-600 leading-relaxed">
                Thiết lập hệ số tính điểm trung bình môn học kỳ theo Thông tư hiện hành hoặc quy chế chuyên môn của Trường THPT Nguyễn Huệ:
              </p>

              <div className="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Hệ số Kiểm tra thường xuyên (TX1, TX2, TX3, TX4):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={tempRule.txWeight}
                    onChange={(e) => setTempRule({ ...tempRule, txWeight: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Hệ số Kiểm tra Giữa kỳ (GK):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={tempRule.gkWeight}
                    onChange={(e) => setTempRule({ ...tempRule, gkWeight: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Hệ số Kiểm tra Cuối kỳ (CK):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={tempRule.ckWeight}
                    onChange={(e) => setTempRule({ ...tempRule, ckWeight: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGradeRule(tempRule);
                    setIsConfigModalOpen(false);
                    showToast('success', 'Đã cập nhật quy tắc tính điểm sổ điểm.');
                  }}
                  className="px-4 py-1.5 bg-[#0879D9] hover:bg-[#0663b3] text-white rounded font-bold shadow-sm"
                >
                  Áp Dụng Quy Tắc Mới
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
