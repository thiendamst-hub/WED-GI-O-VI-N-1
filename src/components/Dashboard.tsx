import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  FileCheck2,
  Clock,
  TrendingUp,
  ChevronRight,
  BookOpen,
  Calendar,
  Sparkles,
  Bot,
  FileText,
  Video,
  ArrowUpRight,
  GraduationCap,
  FlaskConical,
  Atom,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    stats,
    setActiveTab,
    notifications,
    schedules,
    lessons,
    setSelectedStudentId,
  } = useApp();

  const [activeChartFilter, setActiveChartFilter] = useState<'all' | '10' | '11' | '12'>('all');

  return (
    <div className="space-y-4">
      {/* 1. Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#EAF4FF] via-[#F4F9FF] to-[#E2F0FD] border border-blue-200/80 p-5 shadow-sm">
        {/* Subtle decorative background chemistry lattice */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full text-blue-800" fill="currentColor">
            <polygon points="50,15 90,40 90,85 50,110 10,85 10,40" stroke="currentColor" strokeWidth="2" fill="none" />
            <polygon points="130,15 170,40 170,85 130,110 90,85 90,40" stroke="currentColor" strokeWidth="2" fill="none" />
            <polygon points="90,85 130,110 130,155 90,180 50,155 50,110" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* School Building Image */}
          <div className="relative w-full md:w-72 h-36 rounded-lg overflow-hidden border-2 border-white shadow-md shrink-0 group">
            <img
              src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=500&auto=format&fit=crop&q=80"
              alt="Trường THPT Nguyễn Huệ"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
              <span className="text-white text-xs font-semibold drop-shadow">
                Khuôn viên Trường THPT Nguyễn Huệ
              </span>
            </div>
          </div>

          {/* Teacher Welcome Speech */}
          <div className="flex-1 text-center md:text-left space-y-1.5">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0B3B70] tracking-tight">
              Chào mừng thầy Tấn Thanh!
            </h2>
            <p className="text-sm font-semibold text-slate-700 flex items-center justify-center md:justify-start gap-2">
              <span>Giáo viên môn Hóa học – Trường THPT Nguyễn Huệ</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0879D9]"></span>
              <span className="text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Năm học 2024 - 2025</span>
            </p>
            <p className="text-sm italic text-slate-600 max-w-xl font-serif pt-1 border-t border-blue-200/60">
              “Dạy học không chỉ là truyền đạt kiến thức, mà còn là khơi dậy tiềm năng trong mỗi học sinh.”
            </p>
          </div>

          {/* Education & Chemistry 3D Graphic */}
          <div className="hidden lg:flex items-center gap-4 shrink-0 pr-4">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
              {/* Chemistry Flask & Atom Composition */}
              <div className="relative bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl shadow-lg border border-blue-200 flex flex-col items-center">
                <div className="flex items-center gap-2 text-[#0879D9]">
                  <FlaskConical className="w-8 h-8 text-[#0B3B70] animate-bounce" />
                  <Atom className="w-7 h-7 text-[#0879D9] animate-spin" style={{ animationDuration: '8s' }} />
                </div>
                <span className="text-[10px] font-bold text-[#0B3B70] uppercase mt-1 tracking-wider">
                  Hóa Học 4.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Four Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Tổng số học sinh */}
        <div
          onClick={() => setActiveTab('students')}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/80 hover:shadow-md hover:border-blue-400 cursor-pointer transition-all flex items-center gap-4 group"
        >
          <div className="w-14 h-14 rounded-full bg-[#EAF4FF] flex items-center justify-center text-[#0879D9] group-hover:bg-[#0879D9] group-hover:text-white transition-colors shrink-0 shadow-inner">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Tổng số học sinh</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{stats.totalStudents}</span>
              <span className="text-xs text-slate-500 font-normal">(5 lớp)</span>
            </div>
            <span className="text-[11px] text-[#0879D9] group-hover:underline flex items-center gap-0.5 mt-0.5">
              Xem danh sách <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 2: Đã nộp bài */}
        <div
          onClick={() => setActiveTab('assignments')}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/80 hover:shadow-md hover:border-emerald-400 cursor-pointer transition-all flex items-center gap-4 group"
        >
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0 shadow-inner">
            <FileCheck2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Đã nộp bài</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{stats.submittedCount}</span>
              <span className="text-xs font-semibold text-emerald-600">({stats.submissionRate}%)</span>
            </div>
            <span className="text-[11px] text-emerald-600 group-hover:underline flex items-center gap-0.5 mt-0.5">
              Xem bài kiểm tra <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 3: Chưa nộp bài */}
        <div
          onClick={() => setActiveTab('assignments')}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/80 hover:shadow-md hover:border-amber-400 cursor-pointer transition-all flex items-center gap-4 group"
        >
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0 shadow-inner">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Chưa nộp bài</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{stats.unsubmittedCount}</span>
              <span className="text-xs font-semibold text-amber-600">({100 - stats.submissionRate}%)</span>
            </div>
            <span className="text-[11px] text-amber-600 group-hover:underline flex items-center gap-0.5 mt-0.5">
              Nhắc nhở học sinh <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 4: Điểm trung bình */}
        <div
          onClick={() => setActiveTab('gradebook')}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/80 hover:shadow-md hover:border-purple-400 cursor-pointer transition-all flex items-center gap-4 group"
        >
          <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0 shadow-inner">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Điểm trung bình</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">{String(stats.avgScore).replace('.', ',')}</span>
              <span className="text-xs text-slate-500 font-medium">/10</span>
            </div>
            <span className="text-[11px] text-purple-600 group-hover:underline flex items-center gap-0.5 mt-0.5">
              Mở sổ điểm điện tử <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Charts & Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 3.1. Bar Chart: Thống kê kết quả học tập (7 ngày gần đây) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-[#0B3B70] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#0879D9]"></span>
                Thống kê kết quả học tập (7 ngày gần đây)
              </h3>
            </div>
            {/* Chart Legend */}
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-3 h-3 rounded bg-[#0879D9]"></span> Đạt
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-3 h-3 rounded bg-[#F97316]"></span> Chưa đạt
              </span>
            </div>
          </div>

          {/* SVG Interactive Dual Bar Chart */}
          <div className="py-4">
            <div className="relative h-44 flex items-end justify-between px-2 pt-6">
              {/* Background horizontal grid lines */}
              <div className="absolute inset-x-0 top-0 border-b border-dashed border-slate-200 flex justify-end text-[10px] text-slate-400 pr-1">25</div>
              <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-slate-200 flex justify-end text-[10px] text-slate-400 pr-1">20</div>
              <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-slate-200 flex justify-end text-[10px] text-slate-400 pr-1">15</div>
              <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-slate-200 flex justify-end text-[10px] text-slate-400 pr-1">10</div>
              <div className="absolute inset-x-0 bottom-0 border-b border-slate-300 flex justify-end text-[10px] text-slate-400 pr-1">0</div>

              {/* Bars for 10A1, 10A2, 11A1, 11A2, 12A1 matching reference image exact values */}
              {[
                { name: '10A1', pass: 18, fail: 4 },
                { name: '10A2', pass: 16, fail: 6 },
                { name: '11A1', pass: 20, fail: 3 },
                { name: '11A2', pass: 14, fail: 5 },
                { name: '12A1', pass: 12, fail: 8 },
              ].map((item) => {
                const maxVal = 25;
                const passHeight = (item.pass / maxVal) * 100;
                const failHeight = (item.fail / maxVal) * 100;

                return (
                  <div key={item.name} className="flex flex-col items-center gap-1.5 z-10 w-14 group">
                    <div className="flex items-end gap-1 h-36">
                      {/* Pass Bar */}
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-600 mb-0.5 group-hover:text-[#0879D9]">
                          {item.pass}
                        </span>
                        <div
                          style={{ height: `${passHeight}%` }}
                          className="w-4 bg-[#0879D9] hover:bg-blue-600 rounded-t transition-all shadow-sm"
                          title={`${item.name} - Đạt: ${item.pass} học sinh`}
                        ></div>
                      </div>

                      {/* Fail Bar */}
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-600 mb-0.5 group-hover:text-[#F97316]">
                          {item.fail}
                        </span>
                        <div
                          style={{ height: `${failHeight}%` }}
                          className="w-4 bg-[#F97316] hover:bg-orange-600 rounded-t transition-all shadow-sm"
                          title={`${item.name} - Chưa đạt: ${item.fail} học sinh`}
                        ></div>
                      </div>
                    </div>
                    {/* Class label */}
                    <span className="text-xs font-bold text-slate-700">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 text-center border-t border-slate-100 pt-2">
            Đạt chuẩn: Điểm kiểm tra ≥ 5.0 | Cần hỗ trợ: Điểm &lt; 5.0
          </div>
        </div>

        {/* 3.2. Donut Chart: Tỉ lệ hoàn thành bài tập */}
        <div className="lg:col-span-3 bg-white rounded-xl p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-[#0B3B70] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-teal-500"></span>
              Tỉ lệ hoàn thành bài tập
            </h3>
          </div>

          {/* SVG Donut */}
          <div className="py-2 flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#F97316"
                  strokeWidth="15"
                />
                {/* 80% circle (dasharray: 2 * PI * 38 * 0.8 ≈ 191, circumference ≈ 238.76) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#06B6D4"
                  strokeWidth="15"
                  strokeDasharray="191 239"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-[#0B3B70] leading-none">80%</span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">Hoàn thành</span>
              </div>
            </div>

            {/* Legend with exact numbers */}
            <div className="mt-4 space-y-1.5 w-full px-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]"></span> Đã nộp
                </span>
                <span className="font-bold text-slate-800">96 (80%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]"></span> Chưa nộp
                </span>
                <span className="font-bold text-slate-800">24 (20%)</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-2 text-center">
            <button
              onClick={() => setActiveTab('assignments')}
              className="text-xs text-[#0879D9] hover:underline font-medium"
            >
              Quản lý chi tiết bài tập & đề thi
            </button>
          </div>
        </div>

        {/* 3.3. Right Column: Notifications & Teaching Schedule */}
        <div className="lg:col-span-4 space-y-4">
          {/* Box 1: Thông báo mới */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#0B3B70] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Thông báo mới
              </h3>
              <button
                onClick={() => setActiveTab('system_admin')}
                className="text-xs text-[#0879D9] hover:underline font-medium"
              >
                Xem tất cả
              </button>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {notifications.slice(0, 4).map((n) => (
                <div
                  key={n.id}
                  onClick={() => n.linkTab && setActiveTab(n.linkTab as any)}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer px-1 rounded transition-colors group"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0879D9] shrink-0"></span>
                    <span className="truncate group-hover:text-[#0879D9] font-medium text-slate-700">
                      {n.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0 font-sans">{n.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Box 2: Lịch dạy & công việc */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#0B3B70] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0879D9]" />
                Lịch dạy & công việc
              </h3>
              <button
                onClick={() => setActiveTab('schedule')}
                className="text-xs text-[#0879D9] hover:underline font-medium"
              >
                Xem tất cả
              </button>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {schedules.slice(0, 4).map((sch) => (
                <div
                  key={sch.id}
                  onClick={() => setActiveTab('schedule')}
                  className="py-2 flex items-center gap-3 hover:bg-slate-50 cursor-pointer px-1 rounded transition-colors"
                >
                  {/* Date badge */}
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200/80 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-[#0B3B70] leading-none">{sch.dayDisplay}</span>
                    <span className="text-[9px] text-blue-600 uppercase font-semibold leading-none mt-0.5">{sch.monthDisplay}</span>
                  </div>
                  <div className="flex-1 truncate">
                    <p className="font-semibold text-slate-800 truncate">{sch.title}</p>
                    <p className="text-[11px] text-slate-500 flex items-center justify-between mt-0.5">
                      <span>{sch.classNames.join(', ')}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{sch.time}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Students Needing Support, Recent Materials & AI Assistant Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 4.1. Left Table: Danh sách học sinh cần hỗ trợ */}
        <div className="lg:col-span-5 bg-white rounded-xl p-4 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-[#0B3B70] flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              Danh sách học sinh cần hỗ trợ
            </h3>
            <button
              onClick={() => setActiveTab('students')}
              className="text-xs text-[#0879D9] hover:underline font-medium"
            >
              Xem tất cả
            </button>
          </div>

          <div className="overflow-x-auto mt-2">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/70">
                  <th className="py-2 px-2 text-center w-10">STT</th>
                  <th className="py-2 px-2 text-left">Họ và tên</th>
                  <th className="py-2 px-2 text-center">Lớp</th>
                  <th className="py-2 px-2 text-center">Tình trạng</th>
                  <th className="py-2 px-2 text-center">Điểm TB</th>
                  <th className="py-2 px-2 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.studentsNeedSupport.slice(0, 5).map((s, idx) => (
                  <tr key={s.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-2.5 px-2 text-center font-semibold text-slate-500">{idx + 1}</td>
                    <td className="py-2.5 px-2 font-bold text-slate-800">{s.name}</td>
                    <td className="py-2.5 px-2 text-center text-slate-600 font-semibold">{s.className}</td>
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.statusText.includes('Chưa nộp bài')
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : s.statusText.includes('Điểm thấp')
                            ? 'bg-red-100 text-red-700 border border-red-300'
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                        }`}
                      >
                        {s.statusText}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-700">
                      {String(s.avgScore).replace('.', ',')}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <button
                        onClick={() => {
                          setSelectedStudentId(s.id);
                          setActiveTab('students');
                        }}
                        className="bg-[#0879D9] hover:bg-[#0661b0] text-white px-2.5 py-1 rounded text-[11px] font-medium transition-colors"
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4.2. Center: Khóa học / Bài giảng mới */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-[#0B3B70] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#0879D9]" />
              Khóa học / Bài giảng mới
            </h3>
            <button
              onClick={() => setActiveTab('lessons')}
              className="text-xs text-[#0879D9] hover:underline font-medium"
            >
              Xem tất cả
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-1">
            {lessons.slice(0, 4).map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => setActiveTab('lessons')}
                className="py-2.5 flex items-center gap-3 hover:bg-slate-50 cursor-pointer px-1 rounded transition-colors group"
              >
                {/* Lesson Thumbnail */}
                <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center text-white shrink-0 shadow-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-transparent"></div>
                  {lesson.fileType === 'video' ? (
                    <Video className="w-5 h-5 text-emerald-300" />
                  ) : (
                    <Atom className="w-5 h-5 text-blue-200" />
                  )}
                </div>

                <div className="flex-1 truncate">
                  <p className="text-xs font-bold text-slate-800 truncate group-hover:text-[#0879D9]">
                    {lesson.title}
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{lesson.subject} {lesson.grade}</span>
                    <span>•</span>
                    <span className="font-sans text-[10px] text-slate-400">{lesson.updatedAt}</span>
                  </p>
                </div>

                {/* Badge Type */}
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${
                    lesson.fileType === 'pdf'
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : lesson.fileType === 'video'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      : 'bg-blue-50 text-blue-600 border-blue-200'
                  }`}
                >
                  {lesson.fileType}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4.3. Right: Trợ lý AI */}
        <div className="lg:col-span-3 bg-gradient-to-b from-[#EBF5FF] to-white rounded-xl p-4 shadow-sm border border-blue-200/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-blue-200/50">
              <div className="p-1.5 bg-[#0879D9] text-white rounded-lg shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#0B3B70]">Trợ lý AI</h3>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Hỗ trợ soạn giáo án, tạo đề, gợi ý bài tập...
                </p>
              </div>
            </div>

            {/* AI Assistant Robot Mascot Illustration */}
            <div className="my-3 flex justify-center">
              <div className="relative w-24 h-24 bg-white rounded-full p-2 shadow-inner border border-blue-200 flex items-center justify-center">
                <Bot className="w-14 h-14 text-[#0879D9] animate-pulse" />
                <span className="absolute bottom-1 right-2 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
            </div>

            {/* Capabilities Checklist */}
            <ul className="text-xs text-slate-700 space-y-1.5 px-2">
              <li className="flex items-center gap-1.5">
                <span className="text-blue-600 font-bold">✓</span> Tạo đề kiểm tra theo mức độ
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-blue-600 font-bold">✓</span> Gợi ý câu hỏi ôn tập
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-blue-600 font-bold">✓</span> Phân tích kết quả học tập
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-blue-600 font-bold">✓</span> Đề xuất nội dung bổ trợ
              </li>
            </ul>
          </div>

          <div className="pt-3">
            <button
              onClick={() => setActiveTab('ai_assistant')}
              className="w-full bg-[#0879D9] hover:bg-[#0663b3] text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2 shadow transition-all hover:scale-[1.02]"
            >
              <Bot className="w-4 h-4" />
              Bắt đầu trò chuyện
            </button>
          </div>
        </div>
      </div>

      {/* 5. Footer */}
      <footer className="pt-3 pb-2 border-t border-slate-200 text-slate-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          © 2025 - Trường THPT Nguyễn Huệ <span className="mx-2">|</span> Thiết kế bởi{' '}
          <strong className="text-slate-700">Tấn Thanh</strong>
        </p>
        <p className="italic text-slate-500">
          “Vì một thế hệ học sinh tự tin - sáng tạo - vững bước tương lai”
        </p>
      </footer>
    </div>
  );
};
