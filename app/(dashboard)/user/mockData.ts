// Mock Data - User Dashboard
// This file simulates future database data
// TODO: Replace with API calls to backend

export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";
export type DocumentStatus = "APPROVED" | "PENDING" | "REJECTED" | "ARCHIVED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "ACTIVE" | "INACTIVE";
  joinDate: string;
  avatar?: string;
}

export interface Document {
  id: string;
  title: string;
  subject: string;
  sizeInMB: number;
  uploadedByUserId: string;
  status: DocumentStatus;
  uploadDate: string;
  type: "pdf" | "docx" | "pptx" | "xlsx" | "txt";
  description?: string;
}

export interface ChatLog {
  id: string;
  userId: string;
  question: string;
  response: string;
  timestamp: string;
  category?: "academic" | "general" | "technical";
}

// Sample Users (Students)
export const MOCK_USERS: User[] = [
  {
    id: "user_001",
    name: "Nguyễn Văn An",
    email: "annv@fpt.edu.vn",
    role: "STUDENT",
    status: "ACTIVE",
    joinDate: "2024-01-15",
    avatar: "👨‍🎓",
  },
  {
    id: "user_002",
    name: "Trần Thị Bình",
    email: "binhtt@fpt.edu.vn",
    role: "STUDENT",
    status: "ACTIVE",
    joinDate: "2024-02-10",
    avatar: "👩‍🎓",
  },
  {
    id: "user_003",
    name: "Phạm Minh Tuấn",
    email: "tuanpm@fpt.edu.vn",
    role: "STUDENT",
    status: "ACTIVE",
    joinDate: "2024-01-20",
    avatar: "👨‍🎓",
  },
  {
    id: "user_004",
    name: "Lê Hương Giang",
    email: "gianglh@fpt.edu.vn",
    role: "STUDENT",
    status: "ACTIVE",
    joinDate: "2024-03-05",
    avatar: "👩‍🎓",
  },
  {
    id: "user_005",
    name: "Võ Quốc Huy",
    email: "huyvq@fpt.edu.vn",
    role: "STUDENT",
    status: "INACTIVE",
    joinDate: "2024-01-10",
    avatar: "👨‍🎓",
  },
];

// Sample Documents (Study Materials)
export const MOCK_DOCUMENTS: Document[] = [
  {
    id: "doc_001",
    title: "Advanced Algorithm Notes",
    subject: "Computer Science",
    sizeInMB: 2.4,
    uploadedByUserId: "user_001",
    status: "APPROVED",
    uploadDate: "2024-03-15",
    type: "pdf",
    description: "Comprehensive notes on advanced algorithms and data structures",
  },
  {
    id: "doc_002",
    title: "Chemistry Lab Report",
    subject: "Chemistry",
    sizeInMB: 1.8,
    uploadedByUserId: "user_002",
    status: "APPROVED",
    uploadDate: "2024-03-10",
    type: "docx",
    description: "Experiment results and analysis",
  },
  {
    id: "doc_003",
    title: "Physics Presentation",
    subject: "Physics",
    sizeInMB: 5.2,
    uploadedByUserId: "user_003",
    status: "APPROVED",
    uploadDate: "2024-03-08",
    type: "pptx",
    description: "Slide presentation on quantum mechanics",
  },
  {
    id: "doc_004",
    title: "Mathematics Exercises",
    subject: "Mathematics",
    sizeInMB: 3.1,
    uploadedByUserId: "user_001",
    status: "APPROVED",
    uploadDate: "2024-03-05",
    type: "pdf",
    description: "Calculus problems and solutions",
  },
  {
    id: "doc_005",
    title: "English Literature Essay",
    subject: "English",
    sizeInMB: 0.8,
    uploadedByUserId: "user_004",
    status: "PENDING",
    uploadDate: "2024-03-18",
    type: "docx",
    description: "Analysis of modern literature",
  },
  {
    id: "doc_006",
    title: "Biology Study Guide",
    subject: "Biology",
    sizeInMB: 4.3,
    uploadedByUserId: "user_002",
    status: "APPROVED",
    uploadDate: "2024-03-12",
    type: "pdf",
    description: "Complete guide for biology exam",
  },
  {
    id: "doc_007",
    title: "History Timeline",
    subject: "History",
    sizeInMB: 2.1,
    uploadedByUserId: "user_005",
    status: "REJECTED",
    uploadDate: "2024-03-01",
    type: "docx",
    description: "Historical events and dates",
  },
  {
    id: "doc_008",
    title: "Art Design Portfolio",
    subject: "Art",
    sizeInMB: 12.5,
    uploadedByUserId: "user_003",
    status: "APPROVED",
    uploadDate: "2024-02-28",
    type: "pptx",
    description: "Collection of design works",
  },
];

// Sample Chat Logs (AI Chatbot Interactions)
export const MOCK_CHAT_LOGS: ChatLog[] = [
  {
    id: "chat_001",
    userId: "user_001",
    question: "What is the time complexity of QuickSort?",
    response:
      "QuickSort has an average time complexity of O(n log n) and worst-case of O(n²). It's efficient for most practical cases.",
    timestamp: "2024-03-18T14:30:00",
    category: "academic",
  },
  {
    id: "chat_002",
    userId: "user_002",
    question: "How do I balance a chemical equation?",
    response:
      "To balance a chemical equation: 1) Count atoms on both sides, 2) Use coefficients to make them equal, 3) Verify the balance.",
    timestamp: "2024-03-18T15:45:00",
    category: "academic",
  },
  {
    id: "chat_003",
    userId: "user_001",
    question: "Explain Newton's Second Law",
    response:
      "F = ma: Force equals mass times acceleration. This fundamental law describes how objects move when forces are applied.",
    timestamp: "2024-03-18T16:10:00",
    category: "academic",
  },
  {
    id: "chat_004",
    userId: "user_003",
    question: "What is photosynthesis?",
    response:
      "Photosynthesis is the process by which plants convert light energy into chemical energy, producing glucose and oxygen.",
    timestamp: "2024-03-18T16:50:00",
    category: "academic",
  },
  {
    id: "chat_005",
    userId: "user_004",
    question: "Can you help with essay structure?",
    response:
      "Good essay structure: Introduction (thesis), body paragraphs (evidence + analysis), conclusion (summary + reflection).",
    timestamp: "2024-03-18T17:20:00",
    category: "academic",
  },
  {
    id: "chat_006",
    userId: "user_002",
    question: "What are mitochondria?",
    response:
      "Mitochondria are the powerhouse of the cell, responsible for generating ATP energy through cellular respiration.",
    timestamp: "2024-03-18T17:55:00",
    category: "academic",
  },
  {
    id: "chat_007",
    userId: "user_001",
    question: "How to debug Python code?",
    response:
      "Use print statements, pdb debugger, or IDE debuggers. Set breakpoints and inspect variables to find issues.",
    timestamp: "2024-03-18T18:30:00",
    category: "technical",
  },
  {
    id: "chat_008",
    userId: "user_003",
    question: "When is the next exam?",
    response:
      "I don't have access to your exam schedule. Please check with your instructor or the school portal.",
    timestamp: "2024-03-18T19:00:00",
    category: "general",
  },
];
