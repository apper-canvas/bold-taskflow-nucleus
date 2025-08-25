import React from "react";
import { cn } from "@/utils/cn";

const PriorityBadge = ({ priority, className }) => {
  const variants = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200"
  };

  const labels = {
    low: "Low",
    medium: "Medium",
    high: "High"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        variants[priority],
        className
      )}
    >
      {labels[priority]}
    </span>
  );
};

export default PriorityBadge;