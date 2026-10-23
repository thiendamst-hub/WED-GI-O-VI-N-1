import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // Set CORS headers if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, toolType, options } = req.body || {};

    if (!prompt && !toolType) {
      return res.status(400).json({ error: 'Nội dung yêu cầu không được để trống.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        text: `[CHẾ ĐỘ NỘI BỘ HỆ THỐNG HUỆ LEARNING - VERCEL]\n\n` +
          `Dưới đây là kết quả tạo tự động cho môn Hóa học THPT theo chuẩn GDPT 2018:\n\n` +
          `1. MỤC TIÊU BÀI DẠY:\n- Kiến thức: Nắm vững cấu trúc, tính chất hóa học và ứng dụng thực tiễn.\n- Năng lực: Rèn luyện kỹ năng quan sát thí nghiệm, tư duy logic và giải quyết vấn đề.\n- Phẩm chất: Tính cẩn thận, an toàn phòng thí nghiệm và niềm say mê khoa học.\n\n` +
          `2. NỘI DUNG ĐỀ XUẤT:\n- Câu hỏi Nhận biết: Nêu công thức tổng quát và đồng đẳng.\n- Câu hỏi Thông hiểu: So sánh nhiệt độ sôi và tính tan.\n- Câu hỏi Vận dụng: Tính hiệu suất phản ứng xà phòng hóa.\n- Câu hỏi Vận dụng cao: Biện luận xác định công thức cấu tạo hỗn hợp este đa chức.\n\n` +
          `*(Lưu ý: Để gọi trực tiếp mô hình Gemini live trên Vercel, vui lòng cấu hình biến môi trường GEMINI_API_KEY trong Project Settings > Environment Variables của Vercel)*`,
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `Bạn là Trợ lý AI sư phạm cao cấp dành riêng cho giáo viên Trường THPT Nguyễn Huệ (đặc biệt hỗ trợ thầy Tấn Thanh - Giáo viên Hóa học).
Quy tắc phản hồi:
- Sử dụng tiếng Việt chuẩn mực sư phạm, rõ ràng, sư phạm, nhiệt tình và thực tế.
- Bám sát Chương trình Giáo dục phổ thông 2018 của Bộ Giáo dục và Đào tạo Việt Nam.
- Đối với môn Hóa học: Sử dụng danh pháp IUPAC chuẩn, cân bằng phương trình phản ứng hóa học chính xác, trình bày công thức rõ ràng.
- Đối với ma trận đề kiểm tra: Phân bổ đúng 4 cấp độ nhận thức: Nhận biết (40%), Thông hiểu (30%), Vận dụng (20%), Vận dụng cao (10%).
- Luôn phân biệt nội dung tạo bởi AI mang tính tham khảo chuyên môn, giáo viên sẽ là người quyết định cuối cùng. Không tự ý kết luận học lực học sinh một cách tiêu cực.`;

    let finalPrompt = prompt;
    if (toolType === 'lesson_plan') {
      finalPrompt = `Hãy soạn kế hoạch bài dạy (giáo án) theo định hướng Công văn 5512/BGDĐT cho chủ đề sau:
${prompt}
Thông tin bổ sung: Khối lớp: ${options?.grade || 'THPT'}, Môn học: ${options?.subject || 'Hóa học'}, Số tiết: ${options?.periods || '1'}.
Gồm 4 hoạt động:
1. Hoạt động Khởi động (Mục tiêu, Nội dung, Sản phẩm, Tổ chức thực hiện).
2. Hoạt động Hình thành kiến thức mới.
3. Hoạt động Luyện tập.
4. Hoạt động Vận dụng, mở rộng.`;
    } else if (toolType === 'quiz_generator') {
      finalPrompt = `Hãy tạo một bộ câu hỏi kiểm tra trắc nghiệm 4 lựa chọn (A, B, C, D) có đáp án và lời giải chi tiết cho chủ đề:
${prompt}
Số lượng câu hỏi: ${options?.count || 5}.
Khối lớp: ${options?.grade || '11'}.
Môn: ${options?.subject || 'Hóa học'}.
Mức độ: ${options?.level || 'Tổng hợp (Nhận biết đến Vận dụng cao)'}.
Định dạng đầu ra:
Câu 1: [Nội dung câu hỏi]
A. ...
B. ...
C. ...
D. ...
Đáp án đúng: [A/B/C/D]
Giải thích chi tiết: [Lời giải thích ngắn gọn, xúc tích]`;
    } else if (toolType === 'feedback_generator') {
      finalPrompt = `Dựa trên kết quả học tập sau đây của học sinh:
${prompt}
Hãy tạo lời nhận xét sư phạm mang tính khích lệ, chỉ ra điểm mạnh, điểm cần khắc phục và lộ trình ôn tập cụ thể cho học sinh.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: finalPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error('Lỗi khi gọi Gemini API trên Vercel:', error);
    return res.status(500).json({
      error: 'Không thể kết nối đến AI Trợ lý: ' + (error?.message || 'Lỗi không xác định'),
    });
  }
}
