import React from "react";
import { cn } from "@/utils/cn";

const TaskStats = ({ title, value, subtitle, className, color = "primary" }) => {
  const colorClasses = {
    primary: "from-primary to-secondary",
    success: "from-success to-success/80",
    accent: "from-accent to-accent/80",
    warning: "from-warning to-warning/80"
  };

  return (
    <div className={cn("bg-white rounded-xl p-6 shadow-sm border border-gray-100", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={cn(
            "text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent mt-2",
            colorClasses[color]
          )}>
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskStats;