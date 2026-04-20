import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: number;
  icon: LucideIcon;
  color: "blue" | "green" | "red" | "purple";
  trend?: string;
}

const colorMap = {
  blue: { bg: "bg-blue-50", icon: "bg-blue-600", text: "text-blue-600", badge: "bg-blue-100 text-blue-700" },
  green: { bg: "bg-emerald-50", icon: "bg-emerald-600", text: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700" },
  red: { bg: "bg-red-50", icon: "bg-red-600", text: "text-red-600", badge: "bg-red-100 text-red-700" },
  purple: { bg: "bg-violet-50", icon: "bg-violet-600", text: "text-violet-600", badge: "bg-violet-100 text-violet-700" },
};

export default function StatsCard({ title, value, icon: Icon, color, trend }: Props) {
  const colors = colorMap[color];
  return (
    <div className="card p-5 animate-fade-in hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <p className={`text-3xl font-display font-bold mt-1 ${colors.text}`}>{value}</p>
          {trend && (
            <p className="text-xs text-slate-400 mt-1">{trend}</p>
          )}
        </div>
        <div className={`w-11 h-11 ${colors.icon} rounded-xl flex items-center justify-center shadow-sm`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}
