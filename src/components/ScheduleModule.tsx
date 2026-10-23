import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScheduleEvent } from '../types';
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  MapPin,
  Trash2,
  Filter,
  Check,
  X,
  BookOpen,
  Award,
} from 'lucide-react';

export const ScheduleModule: React.FC = () => {
  const { schedules, addScheduleEvent, toggleScheduleEvent, deleteScheduleEvent, showToast } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'teaching' as 'teaching' | 'exam' | 'grading' | 'meeting' | 'review',
    date: '2025-04-26',
    dayDisplay: '26',
    monthDisplay: 'Th04',
    time: '08:00 - 09:30',
    classNames: '10A1, 10A2',
    location: 'Phòng thực hành Hóa',
    completed: false,
    note: '',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) {
      showToast('error', 'Vui lòng nhập tiêu đề sự kiện.');
      return;
    }

    addScheduleEvent({
      ...newEvent,
      classNames: newEvent.classNames.split(',').map((c) => c.trim()),
    });
    setIsAddModalOpen(false);
  };

  const filteredEvents = schedules.filter((s) => {
    if (filterType === 'all') return true;
    return s.type === filterType;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#0B3B70] flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-[#0879D9]" />
            Lịch Dạy & Công Việc Giảng Dạy
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kế hoạch dạy học, lịch kiểm tra 15p - 1 tiết, nhắc việc chấm bài và sinh hoạt tổ chuyên môn
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0879D9] hover:bg-[#0663b3] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Thêm Lịch Mới
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-2 flex-wrap text-xs">
        <span className="text-slate-500 font-medium">Lọc theo loại:</span>
        {[
          { id: 'all', label: 'Tất cả' },
          { id: 'teaching', label: 'Tiết dạy trên lớp' },
          { id: 'exam', label: 'Kiểm tra - Thi' },
          { id: 'grading', label: 'Chấm bài kiểm tra' },
          { id: 'review', label: 'Ôn tập & Khác' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filterType === tab.id
                ? 'bg-[#0879D9] text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline Event List */}
      <div className="space-y-3">
        {filteredEvents.map((ev) => (
          <div
            key={ev.id}
            className={`bg-white rounded-xl border p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
              ev.completed
                ? 'opacity-70 border-slate-200 bg-slate-50/60'
                : 'border-slate-200 hover:border-blue-400'
            }`}
          >
            <div className="flex items-start gap-3.5 flex-1">
              {/* Date Box */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-b from-[#0B3B70] to-[#0879D9] text-white flex flex-col items-center justify-center shrink-0 shadow-sm">
                <span className="text-lg font-bold leading-none">{ev.dayDisplay}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider mt-0.5">
                  {ev.monthDisplay}
                </span>
              </div>

              {/* Event Content */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3
                    className={`font-bold text-sm ${
                      ev.completed ? 'line-through text-slate-500' : 'text-[#0B3B70]'
                    }`}
                  >
                    {ev.title}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      ev.type === 'exam'
                        ? 'bg-amber-100 text-amber-800'
                        : ev.type === 'grading'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {ev.type === 'exam'
                      ? 'Kiểm tra'
                      : ev.type === 'grading'
                      ? 'Chấm bài'
                      : 'Giảng dạy'}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {ev.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {ev.location}
                  </span>
                  <span>
                    Lớp: <strong>{ev.classNames.join(', ')}</strong>
                  </span>
                </div>

                {ev.note && (
                  <p className="text-xs text-slate-600 italic font-serif pt-1">
                    Ghi chú: {ev.note}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={() => toggleScheduleEvent(ev.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  ev.completed
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {ev.completed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Đã hoàn thành
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 text-slate-400" /> Đánh dấu hoàn thành
                  </>
                )}
              </button>

              <button
                onClick={() => deleteScheduleEvent(ev.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                title="Xóa sự kiện"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0B3B70] flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#0879D9]" />
                Thêm Lịch Dạy / Công Việc Mới
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 mt-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tiêu đề sự kiện: *</label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Ví dụ: Kiểm tra 1 tiết Hóa học 11"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Loại sự kiện:</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="teaching">Tiết dạy học</option>
                    <option value="exam">Kiểm tra - Thi</option>
                    <option value="grading">Chấm bài thi</option>
                    <option value="meeting">Hội họp tổ bộ môn</option>
                    <option value="review">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ngày (Số & Tháng):</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="26"
                      value={newEvent.dayDisplay}
                      onChange={(e) => setNewEvent({ ...newEvent, dayDisplay: e.target.value })}
                      className="w-16 border border-slate-300 rounded px-2 py-1 text-center font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Th04"
                      value={newEvent.monthDisplay}
                      onChange={(e) => setNewEvent({ ...newEvent, monthDisplay: e.target.value })}
                      className="w-20 border border-slate-300 rounded px-2 py-1 text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Thời gian (Giờ):</label>
                  <input
                    type="text"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    placeholder="08:00 - 09:30"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Địa điểm:</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="Phòng 201 - Dãy A"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Các lớp áp dụng:</label>
                <input
                  type="text"
                  value={newEvent.classNames}
                  onChange={(e) => setNewEvent({ ...newEvent, classNames: e.target.value })}
                  placeholder="10A1, 10A2"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ghi chú chuẩn bị:</label>
                <textarea
                  rows={2}
                  value={newEvent.note}
                  onChange={(e) => setNewEvent({ ...newEvent, note: e.target.value })}
                  placeholder="Chuẩn bị dụng cụ thí nghiệm, photo đề..."
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0879D9] hover:bg-[#0663b3] text-white rounded font-bold shadow-sm"
                >
                  Lưu Vào Lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
