// Utility functions for admin dashboard statistics
import { MOCK_USERS, MOCK_DOCUMENTS, MOCK_CHAT_LOGS } from "./mockData";

/**
 * Calculate total number of users
 */
export const getTotalUsers = (): number => {
  return MOCK_USERS.length;
};

/**
 * Calculate total active users
 */
export const getActiveUsers = (): number => {
  return MOCK_USERS.filter((user) => user.status === "ACTIVE").length;
};

/**
 * Calculate total documents on platform
 */
export const getTotalPlatformDocuments = (): number => {
  return MOCK_DOCUMENTS.length;
};

/**
 * Calculate total storage used by all documents (MB)
 */
export const getTotalPlatformStorage = (): number => {
  return MOCK_DOCUMENTS.reduce((sum, doc) => sum + doc.sizeInMB, 0);
};

/**
 * Calculate total approved documents
 */
export const getApprovedDocuments = (): number => {
  return MOCK_DOCUMENTS.filter((doc) => doc.status === "APPROVED").length;
};

/**
 * Calculate total pending documents
 */
export const getPendingDocuments = (): number => {
  return MOCK_DOCUMENTS.filter((doc) => doc.status === "PENDING").length;
};

/**
 * Calculate total rejected documents
 */
export const getRejectedDocuments = (): number => {
  return MOCK_DOCUMENTS.filter((doc) => doc.status === "REJECTED").length;
};

/**
 * Calculate system uptime (mock percentage)
 */
export const getSystemUptime = (): number => {
  return 94; // 94% uptime
};

/**
 * Calculate month-over-month growth percentage (mock)
 */
export const getMonthlyGrowth = (): number => {
  return 23.5; // 23.5% growth
};

/**
 * Get total chatbot interactions on platform
 */
export const getTotalChatbotInteractions = (): number => {
  return MOCK_CHAT_LOGS.length;
};

/**
 * Get storage trend (percentage change)
 */
export const getStorageTrend = (): {
  value: number;
  isPositive: boolean;
} => {
  return { value: 2, isPositive: false };
};

/**
 * Get user growth trend
 */
export const getUserGrowthTrend = (): {
  value: number;
  isPositive: boolean;
} => {
  return { value: 18, isPositive: true };
};

/**
 * Get document growth trend
 */
export const getDocumentGrowthTrend = (): {
  value: number;
  isPositive: boolean;
} => {
  return { value: 24, isPositive: true };
};

/**
 * Get activity trend
 */
export const getActivityTrend = (): {
  value: number;
  isPositive: boolean;
} => {
  return { value: 2, isPositive: false };
};

/**
 * Get growth rate trend
 */
export const getGrowthRateTrend = (): {
  value: number;
  isPositive: boolean;
} => {
  return { value: 5, isPositive: true };
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
 * Get user statistics by role
 */
export const getUsersByRole = () => {
  return {
    students: MOCK_USERS.filter((u) => u.role === "STUDENT").length,
    teachers: MOCK_USERS.filter((u) => u.role === "TEACHER").length,
    admins: MOCK_USERS.filter((u) => u.role === "ADMIN").length,
  };
};

/**
 * Get documents by subject
 */
export const getDocumentsBySubject = () => {
  const subjects = new Map<string, number>();
  MOCK_DOCUMENTS.forEach((doc) => {
    subjects.set(doc.subject, (subjects.get(doc.subject) || 0) + 1);
  });
  return Object.fromEntries(subjects);
};

/**
 * Get all documents awaiting review
 */
export const getPendingDocumentsForReview = () => {
  return MOCK_DOCUMENTS.filter((doc) => doc.status === "PENDING");
};

/**
 * Get recent activities (system alerts)
 */
export const getRecentActivities = (limit: number = 5) => {
  return MOCK_CHAT_LOGS.sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, limit);
};

/**
 * Calculate platform statistics
 */
export const getPlatformStatistics = () => {
  return {
    totalUsers: getTotalUsers(),
    activeUsers: getActiveUsers(),
    totalDocuments: getTotalPlatformDocuments(),
    approvedDocuments: getApprovedDocuments(),
    pendingDocuments: getPendingDocuments(),
    rejectedDocuments: getRejectedDocuments(),
    totalStorageUsedMB: getTotalPlatformStorage(),
    systemUptime: getSystemUptime(),
    monthlyGrowth: getMonthlyGrowth(),
    totalInteractions: getTotalChatbotInteractions(),
  };
};
