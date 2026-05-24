"use client";

import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <header className="background-light900_dark300 light-border-2 sticky top-0 z-40 border-b px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Title and Subtitle */}
        <div>
          <h1 className="h2-bold text-dark200_light800">{title}</h1>
          {subtitle && (
            <p className="paragraph-medium text-dark400_light700 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right: Search, Notifications, Profile */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden lg:flex">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark400_light700" />
            <Input
              type="text"
              placeholder="Search..."
              className="paragraph-regular background-light800_dark500 light-border-2 text-dark300_light700 no-focus h-10 rounded-lg border pl-10 w-64"
            />
          </div>

          {/* Notification Bell */}
          <button className="relative rounded-full p-2 transition-all duration-200 hover:background-light800_dark400">
            <Bell className="h-5 w-5 text-dark300_light700" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
            <button className="rounded-full p-2 transition-all duration-200 hover:opacity-80">
              <User className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
