"use client";

import {
  Users,
  FileText,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DocumentTable } from "@/components/dashboard/DocumentTable";
import { Button } from "@/components/ui/button";
import {
  getTotalUsers,
  getActiveUsers,
  getTotalPlatformDocuments,
  getTotalPlatformStorage,
  getSystemUptime,
  getMonthlyGrowth,
  formatStorageSize,
  getPendingDocumentsForReview,
  getUserGrowthTrend,
  getDocumentGrowthTrend,
  getActivityTrend,
  getGrowthRateTrend,
} from "./adminStatistics";
import {
  MOCK_DOCUMENTS,
  MOCK_SYSTEM_ALERTS,
  MOCK_SYSTEM_STATUS,
} from "./mockData";

export default function AdminDashboard() {
  // Calculate statistics from mock data
  const totalUsers = getTotalUsers();
  const totalDocuments = getTotalPlatformDocuments();
  const totalStorageMB = getTotalPlatformStorage();
  const systemUptime = getSystemUptime();
  const monthlyGrowth = getMonthlyGrowth();

  // Get documents for table
  const recentDocuments = MOCK_DOCUMENTS.slice(0, 4).map((doc) => ({
    id: doc.id,
    name: doc.title,
    subject: doc.subject,
    size: formatStorageSize(doc.sizeInMB),
    uploadedDate: new Date(doc.uploadDate).toLocaleDateString("vi-VN"),
    type: doc.type,
  }));
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="background-light800_dark400 light-border-2 rounded-2xl border p-6">
        <h1 className="h2-bold text-dark200_light800 mb-2">
          Admin Overview 🎛️
        </h1>
        <p className="paragraph-regular text-dark400_light700">
          Monitor system performance and manage platform resources.
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={totalUsers}
          description="Active users this month"
          icon={Users}
          trend={getUserGrowthTrend()}
          iconBgColor="bg-blue-500/20"
        />
        <StatsCard
          title="Documents in System"
          value={totalDocuments}
          description="Total study materials"
          icon={FileText}
          trend={getDocumentGrowthTrend()}
          iconBgColor="bg-purple-500/20"
        />
        <StatsCard
          title="System Activity"
          value={`${systemUptime}%`}
          description="Uptime today"
          icon={Activity}
          trend={getActivityTrend()}
          iconBgColor="bg-green-500/20"
        />
        <StatsCard
          title="Growth Rate"
          value={`${monthlyGrowth}%`}
          description="Month over month"
          icon={TrendingUp}
          trend={getGrowthRateTrend()}
          iconBgColor="bg-orange-500/20"
        />
      </div>

      {/* System Status Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Status Box 1 */}
        <div className="background-light800_dark400 light-border-2 rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="h3-bold text-dark200_light800">System Status</h3>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-light700_dark500">
              <span className="paragraph-regular text-dark400_light700">
                API Server
              </span>
              <span className="paragraph-semibold text-green-500">
                {MOCK_SYSTEM_STATUS.apiServer === "healthy"
                  ? "Healthy"
                  : "Warning"}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-light700_dark500">
              <span className="paragraph-regular text-dark400_light700">
                Database
              </span>
              <span className="paragraph-semibold text-green-500">
                {MOCK_SYSTEM_STATUS.database === "healthy"
                  ? "Healthy"
                  : "Warning"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="paragraph-regular text-dark400_light700">
                Cloud Storage
              </span>
              <span className="paragraph-semibold text-green-500">
                {MOCK_SYSTEM_STATUS.cloudStorage === "healthy"
                  ? "Healthy"
                  : "Warning"}
              </span>
            </div>
          </div>
        </div>

        {/* Status Box 2 */}
        <div className="background-light800_dark400 light-border-2 rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="h3-bold text-dark200_light800">Recent Alerts</h3>
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="space-y-3">
            {MOCK_SYSTEM_ALERTS.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 pb-2 border-b border-light700_dark500 last:border-b-0"
              >
                <div
                  className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                    alert.type === "success"
                      ? "bg-green-500"
                      : alert.type === "warning"
                        ? "bg-yellow-500"
                        : alert.type === "error"
                          ? "bg-red-500"
                          : "bg-blue-500"
                  }`}
                />
                <div>
                  <p className="paragraph-regular text-dark200_light800">
                    {alert.title}
                  </p>
                  <p className="text-xs text-dark400_light700">
                    {new Date(alert.timestamp).toLocaleTimeString("vi-VN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Documents Management Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="h3-bold text-dark200_light800">
              Platform Documents
            </h2>
            <p className="paragraph-regular text-dark400_light700 mt-1">
              All study materials on the platform
            </p>
          </div>
          <Button className="primary-gradient paragraph-medium rounded-lg px-4 py-2 text-light-900">
            Add Document
          </Button>
        </div>

        <DocumentTable documents={recentDocuments} isAdmin={true} />
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <button className="background-light800_dark400 light-border-2 rounded-xl border p-4 text-center transition-all duration-200 hover:shadow-lg">
          <Users className="mx-auto mb-3 h-8 w-8 text-blue-500" />
          <h3 className="paragraph-semibold text-dark200_light800">
            Manage Users
          </h3>
          <p className="text-xs text-dark400_light700 mt-1">
            View and manage users
          </p>
        </button>

        <button className="background-light800_dark400 light-border-2 rounded-xl border p-4 text-center transition-all duration-200 hover:shadow-lg">
          <FileText className="mx-auto mb-3 h-8 w-8 text-purple-500" />
          <h3 className="paragraph-semibold text-dark200_light800">
            Verify Content
          </h3>
          <p className="text-xs text-dark400_light700 mt-1">
            Review uploaded content
          </p>
        </button>

        <button className="background-light800_dark400 light-border-2 rounded-xl border p-4 text-center transition-all duration-200 hover:shadow-lg">
          <Activity className="mx-auto mb-3 h-8 w-8 text-green-500" />
          <h3 className="paragraph-semibold text-dark200_light800">
            View Analytics
          </h3>
          <p className="text-xs text-dark400_light700 mt-1">
            System performance stats
          </p>
        </button>

        <button className="background-light800_dark400 light-border-2 rounded-xl border p-4 text-center transition-all duration-200 hover:shadow-lg">
          <TrendingUp className="mx-auto mb-3 h-8 w-8 text-orange-500" />
          <h3 className="paragraph-semibold text-dark200_light800">
            Reports
          </h3>
          <p className="text-xs text-dark400_light700 mt-1">
            Generate platform reports
          </p>
        </button>
      </div>
    </div>
  );
}
