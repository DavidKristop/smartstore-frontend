"use client";

import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  bgGradient?: string;
  iconBgColor?: string;
}

export const StatsCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  bgGradient = "from-blue-500/10 to-blue-600/10",
  iconBgColor = "bg-blue-500/20",
}: StatsCardProps) => {
  return (
    <div className={`background-light800_dark400 light-border-2 rounded-2xl border p-6 transition-all duration-200 hover:shadow-lg`}>
      {/* Header with Icon */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="paragraph-regular text-dark400_light700 mb-2">
            {title}
          </p>
          <p className="h3-bold text-dark200_light800">{value}</p>
        </div>

        {/* Icon */}
        <div className={`${iconBgColor} rounded-lg p-3`}>
          <Icon className="h-6 w-6 text-dark200_light800" />
        </div>
      </div>

      {/* Description and Trend */}
      <div className="flex items-end justify-between">
        {description && (
          <p className="text-xs text-dark400_light700">{description}</p>
        )}

        {trend && (
          <div
            className={`flex items-center gap-1 ${
              trend.isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            <span className="text-sm font-semibold">
              {trend.isPositive ? "+" : "-"}{trend.value}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
