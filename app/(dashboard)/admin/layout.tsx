"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar userRole="admin" />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header title="Admin Dashboard" />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto background-light850_dark100 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
