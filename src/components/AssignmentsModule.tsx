import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Assignment, Question, StudentSubmission } from '../types';
import {
  ClipboardCheck,
  Plus,
  Search,
  Filter,
  Clock,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  PlayCircle,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  HelpCircle,
  Award,
  Sparkles,
} from 'lucide-react';

export const AssignmentsModule: React.FC = () => {
  const {
    assignments,
    classes,
    students,
    currentUser,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    gradeSubmission,
    showToast,
    setActiveTab,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAsg, setEditingAsg] = useState<Assignment | null>(null);
  const [takingTestAsg, setTakingTestAsg] = useState<Assignment | null>(null);
  const [viewingSubmissionsAsg, setViewingSubmissionsAsg] = useState<Assignment | null>(null);
  const [gradingSub, setGradingSub] = useState<StudentSubmission | null>(null);
  const [gradingScore, setGradingScore] = useState<number>(8);
  const [gradingFeedback, setGradingFeedback] = useState<string>('');

  // Interactive Test Taking State for student/demo testing
  const [testAnswers, setTestAnswers] = useState<Record<string, string | string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(15 * 60);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    subject: string;
    grade: 10 | 11 | 12;
    classIds: string[];
    classNames: string[];
    openDate: string;
    dueDate: string;
    durationMinutes: number;
    totalPoints: number;
    maxAttempts: number;
    instructions: string;
    status: 'draft' | 'published' | 'closed';
    questions: Question[];
  }>({
    title: '',
    subject: 'Hóa học',
    grade: 10,
    classIds: ['class-10a1'],
    classNames: ['10A1'],
    openDate: '2025-04-18 07:00',
    dueDate: '2025-04-28 23:59',
    durationMinutes: 15,
    totalPoints: 10,
    maxAttempts: 1,
    instructions: 'Học sinh đọc kỹ đề bài và hoàn thành trong thời gian quy định.',
    status: 'published',
    questions: [
      {
        id: `q-demo-1`,
        type: 'single_choice',
        content: 'Chất nào sau đây làm quỳ tím hóa đỏ?',
        options: ['CH3COOH', 'C2H5OH', 'C6H12O6', 'NaCl'],
        correctAnswer: 'CH3COOH',
        points: 2,
        level: 'Nhận biết',
        explanation: 'CH3COOH là axit axetic có tính axit làm quỳ tím chuyển màu đỏ.',
      },
      {
        id: `q-demo-2`,
        type: 'true_false',
        content: 'Chất béo nhẹ hơn nước và không tan trong nước.',
        options: ['Đúng', 'Sai'],
        correctAnswer: 'Đúng',
        points: 2,
        level: 'Thông hiểu',
        explanation: 'Chất béo nhẹ hơn nước và tan nhiều trong các dung môi hữu cơ.',
      },
    ],
  });

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      subject: 'Hóa học',
      grade: 10,
      classIds: ['class-10a1'],
      classNames: ['10A1'],
      openDate: '2025-04-20 07:00',
      dueDate: '2025-04-30 23:59',
      durationMinutes: 20,
      totalPoints: 10,
      maxAttempts: 1,
      instructions: 'Đề kiểm tra trắc nghiệm kết hợp tự luận ngắn.',
      status: 'published',
      questions: [
        {
          id: `q-${Date.now()}-1`,
          type: 'single_choice',
          content: 'Công thức hóa học của etyl axetat là:',
          options: ['CH3COOC2H5', 'C2H5COOCH3', 'HCOOC2H5', 'CH3COOCH3'],
          correctAnswer: 'CH3COOC2H5',
          points: 2,
          level: 'Nhận biết',
        },
      ],
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('error', 'Vui lòng nhập tên bài kiểm tra.');
      return;
    }

    const resolvedClassNames = classes
      .filter((c) => formData.classIds.includes(c.id))
      .map((c) => c.code);

    if (editingAsg) {
      updateAssignment(editingAsg.id, {
        ...formData,
        classNames: resolvedClassNames.length ? resolvedClassNames : ['10A1'],
      });
      setEditingAsg(null);
    } else {
      addAssignment({
        ...formData,
        classNames: resolvedClassNames.length ? resolvedClassNames : ['10A1'],
      });
      setIsCreateModalOpen(false);
    }
  };

  const handleAddQuestion = () => {
    const newQ: Question = {
      id: `q-${Date.now()}`,
      type: 'single_choice',
      content: 'Nhập câu hỏi mới...',
      options: ['Phương án A', 'Phương án B', 'Phương án C', 'Phương án D'],
      correctAnswer: 'Phương án A',
      points: 2,
      level: 'Nhận biết',
    };
    setFormData({ ...formData, questions: [...formData.questions, newQ] });
  };

  const handleStartTest = (asg: Assignment) => {
    setTakingTestAsg(asg);
    setTestAnswers({});
    setTimeRemaining(asg.durationMinutes * 60);
  };

  const handleSubmitTest = () => {
    if (!takingTestAsg) return;
    submitAssignment(takingTestAsg.id, testAnswers, currentUser.id);
    setTakingTestAsg(null);
  };

  const filteredAssignments = assignments.filter((a) => {
    const matchStatus = selectedStatus === 'all' || a.status === selectedStatus;
    const matchClass = selectedClass === 'all' || a.classNames.includes(selectedClass);
    const matchSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchClass && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#0B3B70] flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-[#0879D9]" />
            Quản Lý Bài Tập & Đề Kiểm Tra
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tạo đề trắc nghiệm, tự luận, phân công làm bài, chấm thi và thống kê kết quả học sinh
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('ai_assistant')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0879D9] text-xs font-bold rounded-lg border border-blue-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Tạo Đề Nhanh
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0879D9] hover:bg-[#0663b3] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Tạo Đề Kiểm Tra
          </button>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Trạng thái:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Đang mở làm bài</option>
              <option value="draft">Bản nháp</option>
              <option value="closed">Đã kết thúc</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Lớp:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Tất cả các lớp</option>
              {classes.map((c) => (
                <option key={c.id} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên bài kiểm tra..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Assignment List */}
      <div className="space-y-3">
        {filteredAssignments.map((asg) => {
          const submissionCount = asg.submissions.length;
          const questionsCount = asg.questions.length;

          return (
            <div
              key={asg.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-blue-400 transition-all"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                      asg.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : asg.status === 'draft'
                        ? 'bg-slate-100 text-slate-600 border-slate-300'
                        : 'bg-red-50 text-red-600 border-red-200'
                    }`}
                  >
                    {asg.status === 'published'
                      ? 'Đang mở'
                      : asg.status === 'draft'
                      ? 'Bản nháp'
                      : 'Đã đóng'}
                  </span>
                  <span className="text-[11px] font-bold text-[#0B3B70] bg-blue-50 px-2 py-0.5 rounded">
                    {asg.subject} {asg.grade}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Giao cho: <strong>{asg.classNames.join(', ')}</strong>
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#0B3B70] hover:text-[#0879D9] transition-colors">
                  {asg.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {asg.durationMinutes} phút
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Hạn nộp: {asg.dueDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" /> {questionsCount} câu hỏi
                  </span>
                  <span className="flex items-center gap-1 text-blue-700 font-semibold">
                    <Users className="w-3.5 h-3.5" /> Đã nộp: {submissionCount} bài
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {/* Test taking button for students or teacher preview */}
                <button
                  onClick={() => handleStartTest(asg)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0879D9] rounded-lg text-xs font-bold border border-blue-200 transition-colors"
                  title="Thử làm bài kiểm tra"
                >
                  <PlayCircle className="w-4 h-4" /> Làm bài thử
                </button>

                <button
                  onClick={() => setViewingSubmissionsAsg(asg)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#0879D9] hover:bg-[#0663b3] text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                >
                  <Award className="w-3.5 h-3.5" /> Chấm điểm ({submissionCount})
                </button>

                <button
                  onClick={() => deleteAssignment(asg.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Xóa đề kiểm tra"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Taking Test Modal */}
      {takingTestAsg && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#0879D9] uppercase tracking-wider">
                  Cổng Làm Bài Kiểm Tra Trực Tuyến
                </span>
                <h3 className="text-base font-bold text-[#0B3B70] mt-0.5">{takingTestAsg.title}</h3>
                <p className="text-xs text-slate-500">
                  Học sinh: <strong>{currentUser.name}</strong> • Thời lượng: {takingTestAsg.durationMinutes} phút
                </p>
              </div>
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-lg font-mono font-bold text-xs flex items-center gap-1 border border-amber-300">
                <Clock className="w-4 h-4 text-amber-700" />
                Thời gian còn lại: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
            </div>

            {/* Questions list */}
            <div className="mt-4 space-y-5 text-xs">
              {takingTestAsg.questions.map((q, qIndex) => (
                <div key={q.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-slate-900 text-sm">
                      Câu {qIndex + 1}: {q.content}
                    </p>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded shrink-0">
                      {q.points} điểm
                    </span>
                  </div>

                  {/* Options */}
                  {q.options && q.options.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {q.options.map((opt, optIndex) => {
                        const optLetter = ['A', 'B', 'C', 'D'][optIndex] || `${optIndex + 1}`;
                        const isSelected = testAnswers[q.id] === opt;

                        return (
                          <label
                            key={optIndex}
                            onClick={() => setTestAnswers({ ...testAnswers, [q.id]: opt })}
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition-colors ${
                              isSelected
                                ? 'bg-blue-100 border-[#0879D9] font-bold text-[#0B3B70]'
                                : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`q-${q.id}`}
                              checked={isSelected}
                              onChange={() => {}}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span>
                              <strong>{optLetter}.</strong> {opt}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'essay' && (
                    <textarea
                      rows={3}
                      value={(testAnswers[q.id] as string) || ''}
                      onChange={(e) => setTestAnswers({ ...testAnswers, [q.id]: e.target.value })}
                      placeholder="Nhập câu trả lời tự luận tại đây..."
                      className="w-full bg-white border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-5">
              <button
                onClick={() => setTakingTestAsg(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Hủy làm bài
              </button>
              <button
                onClick={handleSubmitTest}
                className="px-5 py-2 bg-[#0879D9] hover:bg-[#0663b3] text-white rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Nộp Bài Kiểm Tra
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submissions & Teacher Grading Modal */}
      {viewingSubmissionsAsg && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-5 animate-in fade-in">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0B3B70]">
                  Danh Sách Bài Nộp: {viewingSubmissionsAsg.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Tổng số bài đã nộp: {viewingSubmissionsAsg.submissions.length} bài
                </p>
              </div>
              <button
                onClick={() => setViewingSubmissionsAsg(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3 text-left">Mã HS</th>
                      <th className="py-2 px-3 text-left">Họ và tên</th>
                      <th className="py-2 px-3 text-center">Lớp</th>
                      <th className="py-2 px-3 text-center">Thời gian nộp</th>
                      <th className="py-2 px-3 text-center">Điểm số</th>
                      <th className="py-2 px-3 text-center">Trạng thái chấm</th>
                      <th className="py-2 px-3 text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viewingSubmissionsAsg.submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono font-medium text-slate-700">{sub.studentCode}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{sub.studentName}</td>
                        <td className="py-2 px-3 text-center text-slate-600">{sub.className}</td>
                        <td className="py-2 px-3 text-center text-slate-500 font-sans">{sub.submittedAt}</td>
                        <td className="py-2 px-3 text-center font-bold text-sm text-blue-700">
                          {sub.score !== undefined ? `${sub.score} / ${sub.maxScore}` : 'Chưa chấm'}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              sub.graded
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {sub.graded ? 'Đã chấm' : 'Chờ chấm'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => {
                              setGradingSub(sub);
                              setGradingScore(sub.score || 8);
                              setGradingFeedback(sub.teacherFeedback || '');
                            }}
                            className="bg-[#0879D9] hover:bg-[#0663b3] text-white px-2.5 py-1 rounded text-[11px] font-bold"
                          >
                            Chấm bài
                          </button>
                        </td>
                      </tr>
                    ))}
                    {viewingSubmissionsAsg.submissions.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-slate-400">
                          Chưa có học sinh nào nộp bài kiểm tra này.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => setViewingSubmissionsAsg(null)}
                className="px-4 py-1.5 bg-[#0B3B70] text-white rounded-lg text-xs font-bold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grade Single Submission Dialog */}
      {gradingSub && viewingSubmissionsAsg && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 text-xs animate-in zoom-in-95">
            <h3 className="font-bold text-sm text-[#0B3B70] border-b border-slate-100 pb-2">
              Chấm Điểm Bài Nộp: {gradingSub.studentName} ({gradingSub.studentCode})
            </h3>

            <div className="space-y-3 mt-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Điểm số (Thang 10):</label>
                <input
                  type="number"
                  step="0.25"
                  min={0}
                  max={10}
                  value={gradingScore}
                  onChange={(e) => setGradingScore(parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-bold text-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nhận xét của thầy Tấn Thanh:</label>
                <textarea
                  rows={3}
                  value={gradingFeedback}
                  onChange={(e) => setGradingFeedback(e.target.value)}
                  placeholder="Khen ngợi điểm mạnh, nhắc nhở lỗi sai..."
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingSub(null)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    gradeSubmission(viewingSubmissionsAsg.id, gradingSub.id, gradingScore, gradingFeedback);
                    setGradingSub(null);
                  }}
                  className="px-4 py-1.5 bg-[#0879D9] text-white rounded font-bold shadow-sm"
                >
                  Lưu Điểm & Phản Hồi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Exam Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0B3B70] flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-[#0879D9]" />
                Tạo Đề Kiểm Tra Mới
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssignment} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên bài kiểm tra: *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Kiểm tra 15 phút: Hóa học 10 - Chương 3"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Môn học:</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Thời lượng (phút):</label>
                  <input
                    type="number"
                    min={5}
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Thang điểm:</label>
                  <input
                    type="number"
                    value={formData.totalPoints}
                    onChange={(e) => setFormData({ ...formData, totalPoints: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Thời gian mở đề:</label>
                  <input
                    type="text"
                    value={formData.openDate}
                    onChange={(e) => setFormData({ ...formData, openDate: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hạn đóng nộp bài:</label>
                  <input
                    type="text"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Questions Section */}
              <div className="border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-800 text-xs">
                    Danh Sách Câu Hỏi ({formData.questions.length} câu)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="text-[#0879D9] hover:underline font-bold text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm câu hỏi
                  </button>
                </div>

                <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                  {formData.questions.map((q, qIdx) => (
                    <div key={q.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">Câu {qIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              questions: formData.questions.filter((_, i) => i !== qIdx),
                            });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={q.content}
                        onChange={(e) => {
                          const updated = [...formData.questions];
                          updated[qIdx].content = e.target.value;
                          setFormData({ ...formData, questions: updated });
                        }}
                        className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                        placeholder="Nội dung câu hỏi..."
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 text-slate-600 rounded-lg font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0879D9] hover:bg-[#0663b3] text-white rounded-lg font-bold shadow-sm"
                >
                  Xuất Bản Đề
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
