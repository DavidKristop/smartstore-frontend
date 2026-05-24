// Mock Data - Admin Dashboard
// This file simulates future database data for admin operations
// TODO: Replace with API calls to backend

import { User, Document, ChatLog } from "../user/mockData";

export interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalDocuments: number;
  totalStorageUsedMB: number;
  systemUptime: number; // percentage
  monthlyGrowth: number; // percentage
}

export interface SystemAlert {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  timestamp: string;
}

export interface SystemStatus {
  apiServer: "healthy" | "warning" | "error";
  database: "healthy" | "warning" | "error";
  cloudStorage: "healthy" | "warning" | "error";
  lastChecked: string;
}

// Re-export mock data from user dashboard
export { MOCK_USERS, MOCK_DOCUMENTS, MOCK_CHAT_LOGS } from "../user/mockData";
export type { User, Document, ChatLog };

// System Alerts
export const MOCK_SYSTEM_ALERTS: SystemAlert[] = [
  {
    id: "alert_001",
    type: "warning",
    title: "High Storage Usage",
    message: "Platform storage is at 78% capacity. Consider archiving old files.",
    timestamp: "2024-03-18T10:30:00",
  },
  {
    id: "alert_002",
    type: "success",
    title: "Backup Completed",
    message: "Daily backup completed successfully. 5,847 documents backed up.",
    timestamp: "2024-03-18T04:15:00",
  },
  {
    id: "alert_003",
    type: "info",
    title: "New User Registration Spike",
    message: "42 new users registered today. Highest daily registration this month.",
    timestamp: "2024-03-18T14:00:00",
  },
  {
    id: "alert_004",
    type: "warning",
    title: "Pending Document Review",
    message: "3 documents awaiting admin review. Please verify content.",
    timestamp: "2024-03-18T15:30:00",
  },
];

// System Status
export const MOCK_SYSTEM_STATUS: SystemStatus = {
  apiServer: "healthy",
  database: "healthy",
  cloudStorage: "healthy",
  lastChecked: "2024-03-18T19:58:00",
};
