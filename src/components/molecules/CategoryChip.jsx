import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const CategoryChip = ({
  category,
  active = false,
  onClick,
  className
}) => {
  const bgColor = category.color || "#5B4FE9";
  
  return (
    <button
      onClick={() => onClick?.(category)}
      className={cn(
        "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
        "border border-transparent hover:scale-105 active:scale-95",
        active
          ? "text-white shadow-lg"
          : "text-gray-600 bg-gray-100 hover:bg-gray-200 border-gray-200",
        className
      )}
      style={{
        backgroundColor: active ? bgColor : undefined,
        boxShadow: active ? `0 4px 14px 0 ${bgColor}33` : undefined
      }}
    >
      <ApperIcon name={category.icon} size={14} className="mr-1.5" />
      {category.name}
    </button>
  );
};

export default CategoryChip;