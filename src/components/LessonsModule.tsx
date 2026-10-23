import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LessonMaterial } from '../types';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  FileText,
  Video,
  Download,
  Share2,
  Trash2,
  Edit2,
  Eye,
  Star,
  ExternalLink,
  X,
  Atom,
  GraduationCap,
} from 'lucide-react';

export const LessonsModule: React.FC = () => {
  const { lessons, classes, addLesson, updateLesson, deleteLesson, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonMaterial | null>(null);
  const [viewingLesson, setViewingLesson] = useState<LessonMaterial | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Hóa học',
    grade: 11 as 10 | 11 | 12,
    chapter: 'Chương 1: Hóa học hữu cơ',
    description: '',
    fileType: 'pdf' as 'pdf' | 'docx' | 'pptx' | 'video' | 'text',
    fileUrl: '',
    videoUrl: '',
    textContent: '',
    classIds: ['class-11a1'],
    classNames: ['11A1'],
    isFeatured: true,
    author: 'Thầy Tấn Thanh',
  });

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      subject: 'Hóa học',
      grade: 11,
      chapter: 'Chương 1: Este - Lipit',
      description: '',
      fileType: 'pdf',
      fileUrl: '',
      videoUrl: '',
      textContent: '',
      classIds: ['class-11a1'],
      classNames: ['11A1'],
      isFeatured: false,
      author: 'Thầy Tấn Thanh',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (lesson: LessonMaterial) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      subject: lesson.subject,
      grade: lesson.grade,
      chapter: lesson.chapter,
      description: lesson.description,
      fileType: lesson.fileType,
      fileUrl: lesson.fileUrl || '',
      videoUrl: lesson.videoUrl || '',
      textContent: lesson.textContent || '',
      classIds: lesson.classIds,
      classNames: lesson.classNames,
      isFeatured: lesson.isFeatured,
      author: lesson.author,
    });
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('error', 'Vui lòng nhập tiêu đề bài giảng.');
      return;
    }

    const resolvedClassNames = classes
      .filter((c) => formData.classIds.includes(c.id))
      .map((c) => c.code);

    if (editingLesson) {
      updateLesson(editingLesson.id, {
        ...formData,
        classNames: resolvedClassNames.length > 0 ? resolvedClassNames : ['Toàn trường'],
      });
      setEditingLesson(null);
    } else {
      addLesson({
        ...formData,
        classNames: resolvedClassNames.length > 0 ? resolvedClassNames : ['Toàn trường'],
      });
      setIsAddModalOpen(false);
    }
  };

  const filteredLessons = lessons.filter((l) => {
    const matchGrade = selectedGrade === 'all' || l.grade === selectedGrade;
    const matchSubject = selectedSubject === 'all' || l.subject === selectedSubject;
    const matchType = selectedType === 'all' || l.fileType === selectedType;
    const matchSearch =
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.chapter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchGrade && matchSubject && matchType && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#0B3B70] flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#0879D9]" />
            Kho Học Liệu & Bài Giảng Điện Tử
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý giáo án, tài liệu số, bài giảng video và tài liệu phát tay cho học sinh
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0879D9] hover:bg-[#0663b3] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Tạo Bài Giảng Mới
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Grade */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Khối:</span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value === 'all' ? 'all' : Number(e.target.value) as any)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Tất cả khối</option>
              <option value="10">Khối 10</option>
              <option value="11">Khối 11</option>
              <option value="12">Khối 12</option>
            </select>
          </div>

          {/* Subject */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Môn:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Tất cả môn</option>
              <option value="Hóa học">Hóa học</option>
              <option value="Ngữ văn">Ngữ văn</option>
            </select>
          </div>

          {/* Type */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Định dạng:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Tất cả định dạng</option>
              <option value="pdf">Tài liệu PDF</option>
              <option value="video">Video bài giảng</option>
              <option value="docx">Văn bản DOCX</option>
              <option value="text">Bài đọc trực tuyến</option>
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
            placeholder="Tìm theo bài học, chương, từ khóa..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Lesson Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-4 flex flex-col justify-between group"
          >
            <div>
              {/* Card Header with Badges */}
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                      lesson.fileType === 'pdf'
                        ? 'bg-red-50 text-red-600 border-red-200'
                        : lesson.fileType === 'video'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : 'bg-blue-50 text-blue-600 border-blue-200'
                    }`}
                  >
                    {lesson.fileType}
                  </span>
                  <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {lesson.subject} {lesson.grade}
                  </span>
                </div>

                {lesson.isFeatured && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    Nổi bật
                  </span>
                )}
              </div>

              {/* Title & Chapter */}
              <h3 className="font-bold text-sm text-[#0B3B70] mt-3 group-hover:text-[#0879D9] transition-colors leading-snug">
                {lesson.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">{lesson.chapter}</p>

              {/* Description */}
              <p className="text-xs text-slate-600 my-2.5 line-clamp-3 leading-relaxed">
                {lesson.description}
              </p>

              {/* Class tags & stats */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span>Giao cho: <strong>{lesson.classNames.join(', ')}</strong></span>
                <span className="font-sans text-[10px]">{lesson.updatedAt}</span>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4 text-xs">
              <button
                onClick={() => setViewingLesson(lesson)}
                className="flex items-center gap-1 text-[#0879D9] hover:underline font-bold"
              >
                <Eye className="w-3.5 h-3.5" /> Mở xem bài giảng
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(lesson)}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Sửa nội dung"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(lesson.id)}
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Xóa bài giảng"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Lesson Modal */}
      {(isAddModalOpen || editingLesson) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0B3B70] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#0879D9]" />
                {editingLesson ? 'Chỉnh Sửa Bài Giảng / Học Liệu' : 'Tạo Bài Giảng / Học Liệu Mới'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingLesson(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tiêu đề bài giảng: *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none text-xs"
                  placeholder="Ví dụ: Bài 3: Este - Lipit (Hóa học 11)"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Môn học:</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Hóa học">Hóa học</option>
                    <option value="Ngữ văn">Ngữ văn</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Khối lớp:</label>
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
                  <label className="block font-semibold text-slate-700 mb-1">Định dạng file:</label>
                  <select
                    value={formData.fileType}
                    onChange={(e) => setFormData({ ...formData, fileType: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="pdf">PDF (Tài liệu)</option>
                    <option value="video">Video bài giảng</option>
                    <option value="docx">Word (.docx)</option>
                    <option value="pptx">PowerPoint (.pptx)</option>
                    <option value="text">Văn bản trực tuyến</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chương / Chuyên đề:</label>
                <input
                  type="text"
                  value={formData.chapter}
                  onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="Chương 1: Hóa học hữu cơ"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô tả tóm tắt:</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="Nội dung chính của tài liệu hoặc video..."
                />
              </div>

              {formData.fileType === 'video' ? (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Đường dẫn Video (YouTube / Drive):</label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Đường dẫn tệp tài liệu (PDF / DOCX):</label>
                  <input
                    type="text"
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="https://thptnguyenhue.edu.vn/materials/tai_lieu.pdf"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nội dung bài viết trực tuyến (tùy chọn):</label>
                <textarea
                  rows={4}
                  value={formData.textContent}
                  onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono text-[11px]"
                  placeholder="Học sinh có thể đọc trực tiếp nội dung bài giảng tại đây mà không cần tải file..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="featuredCheck" className="font-semibold text-slate-700">
                  Đánh dấu là tài liệu nổi bật (hiển thị trang chủ)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingLesson(null);
                  }}
                  className="px-3.5 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0879D9] hover:bg-[#0663b3] text-white rounded-lg font-bold shadow-sm"
                >
                  {editingLesson ? 'Lưu Bài Giảng' : 'Xuất Bản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Lesson Modal */}
      {viewingLesson && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 animate-in fade-in">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-[#0879D9] uppercase tracking-wider block">
                  {viewingLesson.subject} {viewingLesson.grade} • {viewingLesson.chapter}
                </span>
                <h3 className="text-lg font-bold text-[#0B3B70] mt-1">{viewingLesson.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tác giả: {viewingLesson.author} • Cập nhật: {viewingLesson.updatedAt}
                </p>
              </div>
              <button onClick={() => setViewingLesson(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-1">Mô tả tóm tắt:</h4>
                <p className="text-slate-600 leading-relaxed">{viewingLesson.description}</p>
              </div>

              {viewingLesson.textContent && (
                <div className="p-3.5 bg-blue-50/50 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-[#0B3B70] mb-2">Nội dung bài học:</h4>
                  <div className="text-slate-700 leading-relaxed whitespace-pre-wrap font-serif text-[13px]">
                    {viewingLesson.textContent}
                  </div>
                </div>
              )}

              {viewingLesson.fileType === 'video' && (
                <div className="bg-slate-900 text-white p-6 rounded-lg text-center space-y-2">
                  <Video className="w-10 h-10 text-emerald-400 mx-auto animate-pulse" />
                  <p className="font-bold text-sm">Trình chiếu Video Bài giảng</p>
                  <p className="text-slate-400 text-xs">
                    Video mô phỏng 3D tương tác theo bài giảng môn {viewingLesson.subject}
                  </p>
                  <a
                    href={viewingLesson.videoUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#0879D9] hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold mt-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Mở liên kết Video trực tiếp
                  </a>
                </div>
              )}

              {viewingLesson.fileType !== 'video' && viewingLesson.fileUrl && (
                <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-bold text-slate-800">{viewingLesson.title}.{viewingLesson.fileType}</p>
                      <span className="text-[10px] text-slate-500">Tài liệu học tập trường THPT Nguyễn Huệ</span>
                    </div>
                  </div>
                  <a
                    href={viewingLesson.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#0879D9] hover:bg-blue-600 text-white rounded font-bold text-xs flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Tải về
                  </a>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => setViewingLesson(null)}
                className="px-4 py-1.5 bg-[#0B3B70] text-white rounded-lg text-xs font-bold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5 text-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Xác nhận xóa bài giảng</h3>
            <p className="text-slate-600">
              Bạn có chắc muốn xóa bài giảng này khỏi kho học liệu?
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
                  deleteLesson(deleteConfirmId);
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
    </div>
  );
};
