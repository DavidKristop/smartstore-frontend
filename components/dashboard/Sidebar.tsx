"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Cloud,
  Home,
  MessageSquare,
  Settings,
  Users,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  userRole?: "user" | "admin";
}

export const Sidebar = ({ userRole = "user" }: SidebarProps) => {
  const pathname = usePathname();

  const userMenuItems = [
    {
      label: "Dashboard",
      href: "/user/dashboard",
      icon: Home,
    },
    {
      label: "My Documents",
      href: "/user/documents",
      icon: BookOpen,
    },
    {
      label: "Cloud Storage",
      href: "/user/storage",
      icon: Cloud,
    },
    {
      label: "AI Chatbot",
      href: "/user/chatbot",
      icon: MessageSquare,
    },
    {
      label: "Settings",
      href: "/user/settings",
      icon: Settings,
    },
  ];

  const adminMenuItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: Home,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      label: "Documents",
      href: "/admin/documents",
      icon: BookOpen,
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const menuItems = userRole === "admin" ? adminMenuItems : userMenuItems;

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="background-light900_dark300 light-border-2 sticky left-0 top-0 h-screen w-64 border-r p-6 flex flex-col">
      {/* Logo */}
      <Link href={userRole === "admin" ? "/admin/dashboard" : "/user/dashboard"}>
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <span className="text-sm font-bold text-white">AS</span>
          </div>
          <span className="paragraph-semibold text-dark200_light800">
            AI Study Hub
          </span>
        </div>
      </Link>

      {/* Menu Items */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                active
                  ? "background-dark400_light700 text-light-900"
                  : "text-dark300_light700 hover:background-light800_dark400"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="paragraph-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-500 transition-all duration-200 hover:background-light800_dark400">
        <LogOut className="h-5 w-5" />
        <span className="paragraph-medium">Logout</span>
      </button>
    </aside>
  );
};
