import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  Award,
  PlayCircle,
  Clock,
  Calendar,
  CheckCircle2,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const StudentPortalModule: React.FC = () => {
  const {
    students,
    lessons,
    assignments,
    grades,
    submitAssignment,
    showToast,
    setActiveTab,
  } = useApp();

  // Simulated logged-in student: Nguyễn Văn A (10A1)
  const currentStudent = students[0] || {
    id: 'std-101',
    code: 'HS001',
    name: 'Nguyễn Văn A',
    className: '10A1',
    classId: 'class-10a1',
    avgScore: 5.2,
    teacherNote: 'Thường quên làm bài tập về nhà phần Cấu hình electron. Cần phụ đạo thêm.',
  };

  // Student's personal grade record
  const studentGrade = grades.find((g) => g.studentId === currentStudent.id) || {
    tx1: 5.5,
    tx2: 5.0,
    tx3: 6.0,
    tx4: 4.5,
    gk: 5.0,
    ck: 5.5,
    avgScore: 5.2,
    teacherNote: 'Lực học trung bình, cần chú ý nộp bài đúng hạn',
  };

  // Lessons assigned to 10A1
  const assignedLessons = lessons.filter(
    (l) => l.classNames.includes('10A1') || l.classNames.includes('Toàn trường')
  );

  // Assignments assigned to 10A1
  const assignedExams = assignments.filter((a) => a.classNames.includes('10A1'));

  // Active test state
  const [takingTestId, setTakingTestId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const activeExam = assignments.find((a) => a.id === takingTestId);

  const handleStartExam = (asgId: string) => {
    setTakingTestId(asgId);
    setAnswers({});
  };

  const handleSubmit = () => {
    if (!takingTestId || !activeExam) return;
    submitAssignment(takingTestId, answers, currentStudent.id);
    setTakingTestId(null);
  };

  return (
    <div className="space-y-4">
      {/* Student Welcome Card */}
      <div className="bg-gradient-to-r from-[#0B3B70] to-[#0879D9] text-white p-5 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-xl font-bold">
            A
          </div>
          <div>
            <span className="text-xs text-blue-200 uppercase font-semibold">Cổng Học Sinh THPT Nguyễn Huệ</span>
            <h2 className="text-xl font-bold mt-0.5">Xin chào em {currentStudent.name}!</h2>
            <p className="text-xs text-blue-100 mt-0.5">
              Mã học sinh: <strong>{currentStudent.code}</strong> • Lớp: <strong>{currentStudent.className}</strong> • Giáo viên bộ môn Hóa: <strong>Thầy Tấn Thanh</strong>
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 text-center">
          <span className="text-[11px] text-blue-200 block">Điểm trung bình môn Hóa:</span>
          <span className="text-2xl font-bold text-amber-300">
            {String(studentGrade.avgScore).replace('.', ',')} /10
          </span>
        </div>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Personal Transcript & Teacher Feedback */}
        <div className="lg:col-span-5 space-y-4">
          {/* Transcript */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-[#0B3B70] flex items-center gap-2 pb-2 border-b border-slate-100">
              <Award className="w-4 h-4 text-[#0879D9]" />
              Bảng Điểm Cá Nhân Môn Hóa Học
            </h3>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px]">TX1:</span>
                <strong className="text-slate-800 text-sm">{studentGrade.tx1 ?? '—'}</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px]">TX2:</span>
                <strong className="text-slate-800 text-sm">{studentGrade.tx2 ?? '—'}</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px]">TX3:</span>
                <strong className="text-slate-800 text-sm">{studentGrade.tx3 ?? '—'}</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px]">TX4:</span>
                <strong className="text-slate-800 text-sm">{studentGrade.tx4 ?? '—'}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-blue-50/60 p-2.5 rounded border border-blue-200">
                <span className="text-blue-600 block text-[11px] font-semibold">Giữa kỳ (GK - HS2):</span>
                <strong className="text-blue-900 text-base">{studentGrade.gk ?? '—'}</strong>
              </div>
              <div className="bg-blue-50/60 p-2.5 rounded border border-blue-200">
                <span className="text-blue-600 block text-[11px] font-semibold">Cuối kỳ (CK - HS3):</span>
                <strong className="text-blue-900 text-base">{studentGrade.ck ?? '—'}</strong>
              </div>
            </div>

            {/* Teacher note */}
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs">
              <span className="font-bold text-amber-800 block text-[11px] mb-1">
                Lời dặn của thầy Tấn Thanh:
              </span>
              <p className="text-slate-700 italic font-serif leading-relaxed">
                “{studentGrade.teacherNote || 'Em cần chú ý nộp bài đầy đủ và củng cố kiến thức trước giờ lên lớp.'}”
              </p>
            </div>
          </div>

          {/* Assigned Lessons */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-[#0B3B70] flex items-center gap-2 pb-2 border-b border-slate-100">
              <BookOpen className="w-4 h-4 text-[#0879D9]" />
              Bài Giảng & Học Liệu Dành Cho Lớp {currentStudent.className}
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              {assignedLessons.map((l) => (
                <div key={l.id} className="py-2.5 flex items-center justify-between group">
                  <div className="truncate pr-2">
                    <p className="font-bold text-slate-800 group-hover:text-[#0879D9] truncate">
                      {l.title}
                    </p>
                    <span className="text-[11px] text-slate-400">{l.chapter} • {l.updatedAt}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-blue-50 text-blue-700 uppercase">
                    {l.fileType}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Assigned Exams & Interactive Test Taker */}
        <div className="lg:col-span-7">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-[#0B3B70] flex items-center gap-2 pb-2 border-b border-slate-100">
              <ClipboardCheck className="w-4 h-4 text-[#0879D9]" />
              Bài Tập & Bài Kiểm Tra Cần Hoàn Thành
            </h3>

            {/* List of open tests */}
            <div className="space-y-3 text-xs">
              {assignedExams.map((asg) => {
                const submission = asg.submissions.find(
                  (s) => s.studentId === currentStudent.id || s.studentCode === currentStudent.code
                );

                return (
                  <div
                    key={asg.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{asg.title}</span>
                        {submission ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                            Đã nộp ({submission.score} / {submission.maxScore} đ)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                            Chưa nộp
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                        <span>Thời lượng: {asg.durationMinutes} phút</span>
                        <span>•</span>
                        <span>Hạn chót: {asg.dueDate}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartExam(asg.id)}
                      className="px-3.5 py-1.5 bg-[#0879D9] hover:bg-[#0663b3] text-white rounded-lg font-bold text-xs shadow-sm flex items-center gap-1.5 shrink-0"
                    >
                      <PlayCircle className="w-4 h-4" />
                      {submission ? 'Làm lại bài' : 'Làm bài ngay'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* If Student is currently taking a test */}
            {activeExam && (
              <div className="mt-4 p-4 rounded-xl border-2 border-blue-300 bg-blue-50/40 space-y-4 text-xs animate-in fade-in">
                <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                  <h4 className="font-bold text-sm text-[#0B3B70]">
                    Đang làm bài: {activeExam.title}
                  </h4>
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded">
                    Thời lượng: {activeExam.durationMinutes} phút
                  </span>
                </div>

                <div className="space-y-4">
                  {activeExam.questions.map((q, idx) => (
                    <div key={q.id} className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                      <p className="font-bold text-slate-800">
                        Câu {idx + 1}: {q.content} ({q.points} điểm)
                      </p>

                      {q.options && (
                        <div className="space-y-1.5">
                          {q.options.map((opt, oIdx) => (
                            <label
                              key={oIdx}
                              onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                              className={`flex items-center gap-2 p-2 rounded cursor-pointer border ${
                                answers[q.id] === opt
                                  ? 'bg-blue-100 border-[#0879D9] font-bold text-[#0B3B70]'
                                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`sq-${q.id}`}
                                checked={answers[q.id] === opt}
                                onChange={() => {}}
                              />
                              <span>
                                {['A', 'B', 'C', 'D'][oIdx]}. {opt}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-blue-200">
                  <button
                    onClick={() => setTakingTestId(null)}
                    className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-1.5 bg-[#0879D9] hover:bg-[#0663b3] text-white rounded font-bold shadow"
                  >
                    Nộp Bài Ngay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
