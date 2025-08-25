import React from "react";
import CategoryChip from "@/components/molecules/CategoryChip";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const TaskFilters = ({
  categories = [],
  activeCategory,
  onCategoryChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange
}) => {
  const statusOptions = [
    { value: "all", label: "All Tasks", icon: "List" },
    { value: "active", label: "Active", icon: "Circle" },
    { value: "completed", label: "Completed", icon: "CheckCircle2" }
  ];

  const priorityOptions = [
    { value: "all", label: "All Priority" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Status</h3>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={statusFilter === option.value ? "primary" : "ghost"}
              size="sm"
              onClick={() => onStatusFilterChange(option.value)}
              className="text-xs"
            >
              <ApperIcon name={option.icon} size={14} className="mr-1" />
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          <CategoryChip
            category={{ Id: "all", name: "All Categories", icon: "Grid3X3" }}
            active={activeCategory === "all"}
            onClick={() => onCategoryChange("all")}
          />
          {categories.map((category) => (
            <CategoryChip
              key={category.Id}
              category={category}
              active={activeCategory === category.Id}
              onClick={() => onCategoryChange(category.Id)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Priority</h3>
        <div className="flex flex-wrap gap-2">
          {priorityOptions.map((option) => (
            <Button
              key={option.value}
              variant={priorityFilter === option.value ? "accent" : "ghost"}
              size="sm"
              onClick={() => onPriorityFilterChange(option.value)}
              className="text-xs"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;