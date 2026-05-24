// Utility functions for calculating statistics from mock data
import { MOCK_DOCUMENTS, MOCK_CHAT_LOGS } from "./mockData";

/**
 * Calculate total number of approved documents
 */
export const getTotalDocuments = (): number => {
  return MOCK_DOCUMENTS.filter((doc) => doc.status === "APPROVED").length;
};

/**
 * Calculate total cloud storage used (sum of all document sizes in MB)
 */
export const getTotalStorageUsed = (): number => {
  return MOCK_DOCUMENTS.reduce((sum, doc) => sum + doc.sizeInMB, 0);
};

/**
 * Get maximum cloud storage (in GB)
 */
export const getMaxCloudStorage = (): number => {
  return 50; // 50 GB total
};

/**
 * Calculate available storage (GB)
 */
export const getAvailableStorage = (): number => {
  const usedMB = getTotalStorageUsed();
  const usedGB = usedMB / 1024;
  return getMaxCloudStorage() - usedGB;
};

/**
 * Get unique subjects from documents
 */
export const getSubjectCount = (): number => {
  const subjects = new Set(MOCK_DOCUMENTS.map((doc) => doc.subject));
  return subjects.size;
};

/**
 * Get total AI chatbot interactions
 */
export const getTotalChatbotInteractions = (): number => {
  return MOCK_CHAT_LOGS.length;
};

/**
 * Get chatbot interactions this month
 */
export const getChatbotInteractionsThisMonth = (): number => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return MOCK_CHAT_LOGS.filter((chat) => {
    const chatDate = new Date(chat.timestamp);
    return (
      chatDate.getMonth() === currentMonth &&
      chatDate.getFullYear() === currentYear
    );
  }).length;
};

/**
 * Get documents by subject
 */
export const getDocumentsBySubject = (subject: string) => {
  return MOCK_DOCUMENTS.filter(
    (doc) => doc.subject === subject && doc.status === "APPROVED"
  );
};

/**
 * Get all unique subjects
 */
export const getAllSubjects = (): string[] => {
  return [...new Set(MOCK_DOCUMENTS.map((doc) => doc.subject))];
};

/**
 * Get documents pending review (PENDING status)
 */
export const getPendingDocuments = () => {
  return MOCK_DOCUMENTS.filter((doc) => doc.status === "PENDING");
};

/**
 * Get rejected documents
 */
export const getRejectedDocuments = () => {
  return MOCK_DOCUMENTS.filter((doc) => doc.status === "REJECTED");
};

/**
 * Format storage size to readable format (MB or GB)
 */
export const formatStorageSize = (sizeInMB: number): string => {
  if (sizeInMB >= 1024) {
    return `${(sizeInMB / 1024).toFixed(1)} GB`;
  }
  return `${sizeInMB.toFixed(1)} MB`;
};

/**
 * Get latest documents (sorted by date)
 */
export const getLatestDocuments = (limit: number = 10) => {
  return MOCK_DOCUMENTS.filter((doc) => doc.status === "APPROVED")
    .sort(
      (a, b) =>
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    )
    .slice(0, limit);
};

/**
 * Get storage trend (mock percentage change)
 */
export const getStorageTrend = (): {
  value: number;
  isPositive: boolean;
} => {
  // Simulate 8% decrease in storage usage trend
  return { value: 8, isPositive: false };
};

/**
 * Get document upload trend (mock percentage change)
 */
export const getDocumentTrend = (): {
  value: number;
  isPositive: boolean;
} => {
  // Simulate 12% increase in documents uploaded
  return { value: 12, isPositive: true };
};

/**
 * Get subject count trend
 */
export const getSubjectTrend = (): {
  value: number;
  isPositive: boolean;
} => {
  return { value: 2, isPositive: true };
};

/**
 * Get chatbot usage trend
 */
export const getChatbotTrend = (): {
  value: number;
  isPositive: boolean;
} => {
  return { value: 45, isPositive: true };
};
