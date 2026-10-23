import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Bot,
  Send,
  Copy,
  Check,
  BookOpen,
  ClipboardList,
  FileCheck,
  Award,
  RefreshCw,
  Sliders,
  Layers,
  ArrowRight,
  HelpCircle,
  FolderPlus,
} from 'lucide-react';

export const AiAssistantModule: React.FC = () => {
  const {
    aiChatHistory,
    addAiChatMessage,
    clearAiChat,
    addLesson,
    addAssignment,
    showToast,
  } = useApp();

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quick preset configurations
  const [selectedTool, setSelectedTool] = useState<
    | 'lesson_plan'
    | 'quiz_generator'
    | 'matrix_exam'
    | 'feedback_generator'
    | 'diff_exercises'
    | 'review_plan'
    | 'chat'
  >('quiz_generator');

  const [options, setOptions] = useState({
    subject: 'Hóa học',
    grade: '11',
    topic: 'Este - Lipit và Chất béo',
    level: 'Tổng hợp (Nhận biết, Thông hiểu, Vận dụng)',
    count: 5,
    periods: 2,
    outputFormat: 'Văn bản đầy đủ kèm đáp án & giải thích chi tiết',
  });

  const toolPresets = [
    {
      id: 'quiz_generator',
      name: 'Tạo câu hỏi trắc nghiệm',
      desc: 'Tạo 4 phương án A-B-C-D theo 4 mức độ nhận thức',
      icon: ClipboardList,
      defaultPrompt: 'Tạo 5 câu trắc nghiệm Hóa học 11 về tính chất hóa học của Este và phản ứng xà phòng hóa có đáp án và lời giải chi tiết.',
    },
    {
      id: 'lesson_plan',
      name: 'Soạn giáo án CV 5512',
      desc: 'Kế hoạch bài dạy 4 hoạt động chuẩn Bộ GD&ĐT',
      icon: BookOpen,
      defaultPrompt: 'Soạn kế hoạch bài dạy môn Hóa học 10 bài "Cấu tạo vỏ nguyên tử - Các orbital nguyên tử" theo Công văn 5512/BGDĐT.',
    },
    {
      id: 'matrix_exam',
      name: 'Ma trận & Đề kiểm tra',
      desc: 'Thiết lập khung ma trận kiểm tra định kỳ',
      icon: Layers,
      defaultPrompt: 'Lập bảng ma trận đề kiểm tra 1 tiết Hóa học 11 chương Este - Lipit (40% NB, 30% TH, 20% VD, 10% VDC).',
    },
    {
      id: 'feedback_generator',
      name: 'Soạn nhận xét học sinh',
      desc: 'Gợi ý lời nhận xét sư phạm tích cực, khích lệ',
      icon: Award,
      defaultPrompt: 'Học sinh kiểm tra đạt 4.8 điểm, yếu phần viết đồng phân Este nhưng tích cực xây dựng bài. Hãy viết nhận xét sư phạm và lời khuyên ôn tập.',
    },
    {
      id: 'diff_exercises',
      name: 'Bài tập phân hóa năng lực',
      desc: 'Thiết kế bài tập cho học sinh giỏi và học sinh yếu',
      icon: Sliders,
      defaultPrompt: 'Thiết kế hệ thống bài tập phân hóa 3 cấp độ (Cơ bản - Nâng cao - Vận dụng cao) cho chủ đề Kim loại kiềm Hóa học 12.',
    },
    {
      id: 'review_plan',
      name: 'Kế hoạch ôn tập củng cố',
      desc: 'Đề cương ôn tập trọng tâm trước kỳ thi',
      icon: FileCheck,
      defaultPrompt: 'Lập đề cương ôn tập trọng tâm môn Hóa học 10 chuẩn bị cho kỳ thi học kỳ II.',
    },
  ];

  const handleSelectPreset = (tool: typeof selectedTool, defaultText: string) => {
    setSelectedTool(tool);
    setInputPrompt(defaultText);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    addAiChatMessage('user', textToSend, selectedTool);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          toolType: selectedTool,
          options,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.text) {
          addAiChatMessage('ai', data.text, selectedTool);
          return;
        }
      }

      let errorMsg = 'Lỗi máy chủ';
      try {
        const data = await response.json();
        if (data.error) errorMsg = data.error;
      } catch {}

      addAiChatMessage(
        'ai',
        `[KẾT QUẢ ĐỀ XUẤT SƯ PHẠM NỘI BỘ - THPT NGUYỄN HUỆ]\n\n` +
        `Dưới đây là nội dung chuẩn bị cho chủ đề "${options.topic}" (${options.subject} ${options.grade}):\n\n` +
        `1. Mục tiêu bài dạy:\n- Kiến thức: Nắm vững các khái niệm trọng tâm, cấu trúc và tính chất đặc trưng theo chuẩn GDPT 2018.\n- Kỹ năng: Rèn luyện kỹ năng phân tích, giải toán hóa học và quan sát thí nghiệm.\n\n` +
        `2. Nội dung biên soạn chi tiết:\n- Cấp độ Nhận biết & Thông hiểu: Hệ thống hóa lý thuyết cốt lõi.\n- Cấp độ Vận dụng: Các dạng bài tập và liên hệ thực tế cuộc sống.\n\n` +
        `*(Lưu ý: Nếu triển khai trên Vercel, vui lòng thêm GEMINI_API_KEY vào mục Environment Variables trong Vercel Settings để kích hoạt live Gemini 3.8 Flash)*`
      );
    } catch (err: any) {
      addAiChatMessage(
        'ai',
        `[KẾT QUẢ ĐỀ XUẤT SƯ PHẠM NỘI BỘ - THPT NGUYỄN HUỆ]\n\n` +
        `Dưới đây là nội dung đề xuất cho chủ đề "${options.topic}" (${options.subject} ${options.grade}):\n\n` +
        `1. Mục tiêu bài dạy theo CV 5512/BGDĐT:\n- Kiến thức: Nắm vững các khái niệm trọng tâm, danh pháp IUPAC và tính chất hóa học.\n- Kỹ năng: Rèn luyện kỹ năng viết phương trình, giải bài tập và làm việc nhóm.\n\n` +
        `2. Chuỗi hoạt động dạy học:\n- Hoạt động 1: Khởi động (Tạo tình huống có vấn đề)\n- Hoạt động 2: Hình thành kiến thức mới\n- Hoạt động 3: Luyện tập củng cố\n- Hoạt động 4: Vận dụng thực tiễn\n\n` +
        `*(Hệ thống tự động chuyển sang chế độ sư phạm nội bộ khi API chưa được kết nối trực tiếp)*`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('info', 'Đã sao chép nội dung vào khay nhớ tạm.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToLessons = (text: string) => {
    addLesson({
      title: `Tài liệu AI: ${options.topic} (${options.subject} ${options.grade})`,
      subject: options.subject,
      grade: Number(options.grade) as any,
      chapter: `Chuyên đề AI hỗ trợ`,
      description: text.slice(0, 150) + '...',
      fileType: 'text',
      textContent: text,
      classIds: ['class-10a1'],
      classNames: ['10A1'],
      isFeatured: false,
      author: 'Thầy Tấn Thanh & Trợ lý AI',
    });
    showToast('success', 'Đã lưu nội dung vào Kho Bài Giảng - Tài Liệu.');
  };

  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0B3B70] to-[#0879D9] flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0B3B70] flex items-center gap-2">
              Trợ Lý Sư Phạm AI Dành Cho Giáo Viên
              <span className="text-xs bg-blue-100 text-[#0879D9] px-2 py-0.5 rounded font-normal">
                Gemini 3.8 Flash
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hỗ trợ soạn giáo án, ngân hàng câu hỏi trắc nghiệm, ma trận đề thi và kế hoạch ôn tập THPT
            </p>
          </div>
        </div>

        <button
          onClick={clearAiChat}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Làm Mới Cuộc Trò Chuyện
        </button>
      </div>

      {/* Preset Tools Toolbar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {toolPresets.map((tool) => {
          const Icon = tool.icon;
          const isSelected = selectedTool === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => handleSelectPreset(tool.id as any, tool.defaultPrompt)}
              className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                isSelected
                  ? 'bg-blue-50/80 border-[#0879D9] text-[#0B3B70] shadow-sm'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Icon
                  className={`w-4 h-4 ${
                    isSelected ? 'text-[#0879D9]' : 'text-slate-400'
                  }`}
                />
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#0879D9]"></span>}
              </div>
              <div>
                <p className="font-bold text-[12px] leading-tight">{tool.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{tool.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Control Configuration Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block font-semibold text-slate-600 mb-1">Môn học:</label>
          <select
            value={options.subject}
            onChange={(e) => setOptions({ ...options, subject: e.target.value })}
            className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium focus:outline-none"
          >
            <option value="Hóa học">Hóa học</option>
            <option value="Ngữ văn">Ngữ văn</option>
            <option value="Toán học">Toán học</option>
            <option value="Vật lí">Vật lí</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-600 mb-1">Khối lớp:</label>
          <select
            value={options.grade}
            onChange={(e) => setOptions({ ...options, grade: e.target.value })}
            className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium focus:outline-none"
          >
            <option value="10">Khối 10 (GDPT 2018)</option>
            <option value="11">Khối 11 (GDPT 2018)</option>
            <option value="12">Khối 12 (GDPT 2018)</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-600 mb-1">Mức độ nhận thức:</label>
          <select
            value={options.level}
            onChange={(e) => setOptions({ ...options, level: e.target.value })}
            className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium focus:outline-none"
          >
            <option value="Tổng hợp (Nhận biết đến VDC)">Tổng hợp (4 mức độ)</option>
            <option value="Nhận biết - Thông hiểu">Nhận biết & Thông hiểu</option>
            <option value="Vận dụng - Vận dụng cao">Vận dụng & Vận dụng cao</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-600 mb-1">Số lượng / Quy mô:</label>
          <select
            value={options.count}
            onChange={(e) => setOptions({ ...options, count: Number(e.target.value) })}
            className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium focus:outline-none"
          >
            <option value={3}>3 câu hỏi / hoạt động</option>
            <option value={5}>5 câu hỏi / hoạt động</option>
            <option value={10}>10 câu hỏi kiểm tra</option>
          </select>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {aiChatHistory.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm text-xs font-bold ${
                    isUser
                      ? 'bg-[#0B3B70] text-white'
                      : 'bg-[#0879D9] text-white'
                  }`}
                >
                  {isUser ? 'TT' : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-4 text-xs leading-relaxed shadow-sm space-y-2 ${
                    isUser
                      ? 'bg-[#0B3B70] text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none font-serif text-[13px]'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {!isUser && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-sans">
                      <span className="italic">
                        *Nội dung do AI đề xuất. Thầy Tấn Thanh có thể chỉnh sửa trước khi sử dụng.
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-green-600 font-bold">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Sao chép</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleSaveToLessons(msg.text)}
                          className="flex items-center gap-1 text-[#0879D9] hover:underline font-bold"
                          title="Lưu vào kho học liệu của giáo viên"
                        >
                          <FolderPlus className="w-3.5 h-3.5" />
                          Lưu bài giảng
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-md mr-auto items-center">
              <div className="w-8 h-8 rounded-full bg-[#0879D9] text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 text-xs text-slate-600">
                <span className="w-2 h-2 rounded-full bg-[#0879D9] animate-ping"></span>
                <span>Trợ lý AI đang tư duy và biên soạn nội dung sư phạm...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Nhập yêu cầu sư phạm (ví dụ: Tạo 5 câu trắc nghiệm Hóa 10 về phản ứng oxi hóa khử có giải thích)..."
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0879D9] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="px-5 py-2.5 bg-[#0879D9] hover:bg-[#0663b3] disabled:bg-slate-300 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-4 h-4" />
              Gửi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
