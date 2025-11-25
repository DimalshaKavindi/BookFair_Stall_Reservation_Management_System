
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: LucideIcon;
  color?: "blue" | "green" | "purple" | "orange" | "red";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorClasses = {
  blue: {
    bg: "from-[#1e2875] to-[#3245a5]",
    icon: "bg-gradient-to-br from-[#4dd9e8] to-[#2ab7c9] text-white",
    text: "text-[#1e2875]",
    border: "border-[#4dd9e8]/20"
  },
  green: {
    bg: "from-green-500 to-green-600",
    icon: "bg-gradient-to-br from-green-400 to-green-500 text-white",
    text: "text-green-600",
    border: "border-green-200"
  },
  purple: {
    bg: "from-purple-500 to-purple-600",
    icon: "bg-gradient-to-br from-purple-400 to-purple-500 text-white",
    text: "text-purple-600",
    border: "border-purple-200"
  },
  orange: {
    bg: "from-orange-500 to-orange-600",
    icon: "bg-gradient-to-br from-orange-400 to-orange-500 text-white",
    text: "text-orange-600",
    border: "border-orange-200"
  },
  red: {
    bg: "from-red-500 to-red-600",
    icon: "bg-gradient-to-br from-red-400 to-red-500 text-white",
    text: "text-red-600",
    border: "border-red-200"
  }
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  
}: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <div className={`bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="mb-1 text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {Icon && (
          <div className={`${colors.icon} p-3 rounded-lg shadow-md`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      
    
    </div>
  );
}