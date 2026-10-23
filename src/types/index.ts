export type UserRole = 'teacher' | 'admin' | 'student';

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  subject: string;
  school: string;
  avatar: string;
  email: string;
  role: UserRole;
}

export interface ClassItem {
  id: string;
  code: string;
  name: string;
  grade: 10 | 11 | 12;
  schoolYear: string;
  subject: string;
  room: string;
  studentCount: number;
  description: string;
  createdAt: string;
}

export interface StudentExamRecord {
  examId: string;
  examTitle: string;
  date: string;
  score: number;
  maxScore: number;
  status: 'passed' | 'failed' | 'not_submitted';
  note?: string;
}

export interface Student {
  id: string;
  code: string;
  name: string;
  classId: string;
  className: string;
  dob: string;
  gender: 'Nam' | 'Nữ';
  phone: string;
  parentPhone: string;
  email: string;
  status: 'normal' | 'support_needed' | 'excellent' | 'warning';
  statusText: string;
  avgScore: number;
  completedAssignments: number;
  pendingAssignments: number;
  teacherNote: string;
  examRecords: StudentExamRecord[];
}

export interface LessonMaterial {
  id: string;
  title: string;
  subject: string;
  grade: 10 | 11 | 12;
  chapter: string;
  description: string;
  fileType: 'pdf' | 'docx' | 'pptx' | 'video' | 'text';
  fileUrl?: string;
  videoUrl?: string;
  textContent?: string;
  classIds: string[];
  classNames: string[];
  updatedAt: string;
  isFeatured: boolean;
  author: string;
  downloadCount: number;
}

export interface Question {
  id: string;
  type: 'single_choice' | 'multi_choice' | 'true_false' | 'fill_blank' | 'essay';
  content: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  explanation?: string;
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  className: string;
  submittedAt: string;
  answers: Record<string, string | string[]>;
  score?: number;
  maxScore: number;
  graded: boolean;
  teacherFeedback?: string;
}

export interface Assignment {
  id: string;
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
  submissions: StudentSubmission[];
}

export interface GradeColumnRule {
  txWeight: number; // Điểm kiểm tra thường xuyên (hệ số 1)
  gkWeight: number; // Điểm giữa kỳ (hệ số 2)
  ckWeight: number; // Điểm cuối kỳ (hệ số 3)
}

export interface StudentGrade {
  id: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  classId: string;
  className: string;
  tx1?: number;
  tx2?: number;
  tx3?: number;
  tx4?: number;
  gk?: number;
  ck?: number;
  avgScore: number;
  teacherNote: string;
  lastUpdated: string;
  historyLogs?: { timestamp: string; note: string }[];
}

export interface ScheduleEvent {
  id: string;
  title: string;
  type: 'teaching' | 'exam' | 'grading' | 'meeting' | 'review';
  date: string; // YYYY-MM-DD or display format
  dayDisplay: string; // "18"
  monthDisplay: string; // "Th04"
  time: string; // "07:30 - 08:15"
  classNames: string[];
  location: string;
  completed: boolean;
  note?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  date: string;
  type: 'exam' | 'material' | 'reminder' | 'ai' | 'system';
  read: boolean;
  linkTab?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  toolType?: string;
}
