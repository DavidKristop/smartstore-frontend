"use client";

import { BookOpen, Cloud, MessageSquare, FileText } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DocumentTable } from "@/components/dashboard/DocumentTable";
import { Button } from "@/components/ui/button";
import {
  getTotalDocuments,
  getTotalStorageUsed,
  getMaxCloudStorage,
  getSubjectCount,
  getChatbotInteractionsThisMonth,
  getLatestDocuments,
  formatStorageSize,
  getStorageTrend,
  getDocumentTrend,
  getSubjectTrend,
  getChatbotTrend,
} from "./userStatistics";
import { MOCK_DOCUMENTS, MOCK_USERS } from "./mockData";

export default function UserDashboard() {
  // Calculate statistics from mock data
  const totalDocuments = getTotalDocuments();
  const totalStorageUsedMB = getTotalStorageUsed();
  const maxStorageGB = getMaxCloudStorage();
  const usedStorageGB = totalStorageUsedMB / 1024;
  const subjectCount = getSubjectCount();
  const chatbotInteractions = getChatbotInteractionsThisMonth();

  // Get latest documents for the table
  const latestDocuments = getLatestDocuments(4);

  // Transform documents for display
  const displayDocuments = latestDocuments.map((doc) => ({
    id: doc.id,
    name: doc.title,
    subject: doc.subject,
    size: formatStorageSize(doc.sizeInMB),
    uploadedDate: new Date(doc.uploadDate).toLocaleDateString("vi-VN"),
    type: doc.type,
  }));

  const handleDownload = (id: string) => {
    console.log("Download document:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete document:", id);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="background-light800_dark400 light-border-2 rounded-2xl border p-6">
        <h1 className="h2-bold text-dark200_light800 mb-2">
          Welcome Back, {MOCK_USERS[0].name}!
        </h1>
        <p className="paragraph-regular text-dark400_light700">
          Here's your learning progress and study materials overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Documents Uploaded"
          value={totalDocuments}
          description="Total study materials"
          icon={FileText}
          trend={getDocumentTrend()}
          iconBgColor="bg-blue-500/20"
        />
        <StatsCard
          title="Cloud Storage"
          value={`${usedStorageGB.toFixed(1)} GB`}
          description={`of ${maxStorageGB} GB used`}
          icon={Cloud}
          trend={getStorageTrend()}
          iconBgColor="bg-purple-500/20"
        />
        <StatsCard
          title="Study Subjects"
          value={subjectCount}
          description="Active courses"
          icon={BookOpen}
          trend={getSubjectTrend()}
          iconBgColor="bg-green-500/20"
        />
        <StatsCard
          title="AI Chatbot Usage"
          value={chatbotInteractions}
          description="Interactions this month"
          icon={MessageSquare}
          trend={getChatbotTrend()}
          iconBgColor="bg-orange-500/20"
        />
      </div>

      {/* Documents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="h3-bold text-dark200_light800">Recent Documents</h2>
            <p className="paragraph-regular text-dark400_light700 mt-1">
              Manage your study materials
            </p>
          </div>
          <Button className="primary-gradient paragraph-medium rounded-lg px-4 py-2 text-light-900">
            Upload Document
          </Button>
        </div>

        <DocumentTable
          documents={displayDocuments}
          onDownload={handleDownload}
          onDelete={handleDelete}
          isAdmin={false}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="background-light800_dark400 light-border-2 rounded-xl border p-4 text-center transition-all duration-200 hover:shadow-lg cursor-pointer">
          <Cloud className="mx-auto mb-3 h-8 w-8 text-blue-500" />
          <h3 className="paragraph-semibold text-dark200_light800">
            Cloud Storage
          </h3>
          <p className="text-xs text-dark400_light700 mt-1">
            Manage your storage
          </p>
        </div>

        <div className="background-light800_dark400 light-border-2 rounded-xl border p-4 text-center transition-all duration-200 hover:shadow-lg cursor-pointer">
          <MessageSquare className="mx-auto mb-3 h-8 w-8 text-purple-500" />
          <h3 className="paragraph-semibold text-dark200_light800">
            Ask AI Helper
          </h3>
          <p className="text-xs text-dark400_light700 mt-1">
            Get instant answers
          </p>
        </div>

        <div className="background-light800_dark400 light-border-2 rounded-xl border p-4 text-center transition-all duration-200 hover:shadow-lg cursor-pointer">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-green-500" />
          <h3 className="paragraph-semibold text-dark200_light800">
            Browse Materials
          </h3>
          <p className="text-xs text-dark400_light700 mt-1">
            Explore more resources
          </p>
        </div>
      </div>
    </div>
  );
}
