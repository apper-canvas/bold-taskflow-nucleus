import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Checkbox from "@/components/atoms/Checkbox";
import Button from "@/components/atoms/Button";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import CategoryChip from "@/components/molecules/CategoryChip";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TaskCard = ({
  task,
  category,
  onToggleComplete,
  onEdit,
  onDelete,
  className,
  selectedTaskIds = [],
  isSelectMode = false,
  onToggleBulkSelect
}) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const priorityColors = {
    high: "#FF6B6B",
    medium: "#FFE66D",
    low: "#4ECDC4"
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "bg-white rounded-lg border border-gray-100 p-4 shadow-sm transition-all duration-200",
        "hover:shadow-md hover:border-gray-200",
        task.completed && "opacity-75",
        className
      )}
      style={{
        borderLeftColor: priorityColors[task.priority],
        borderLeftWidth: "4px"
      }}
    >
<div className="flex items-start space-x-3">
        <div className="flex-shrink-0 pt-1">
          {isSelectMode ? (
            <Checkbox
              checked={selectedTaskIds.includes(task.Id)}
              onChange={() => onToggleBulkSelect(task.Id)}
            />
          ) : (
            <Checkbox
              checked={task.completed}
              onChange={() => onToggleComplete(task.Id)}
            />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-2">
              <h3 className={cn(
                "font-medium text-gray-900 mb-1",
                task.completed && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={cn(
                  "text-sm text-gray-600 mb-2",
                  task.completed && "line-through"
                )}>
                  {task.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-2">
                {category && (
                  <CategoryChip
                    category={category}
                    className="text-xs px-2 py-1"
                  />
                )}
                
                <PriorityBadge priority={task.priority} />
                
                {task.dueDate && (
                  <div className={cn(
                    "flex items-center text-xs",
                    isOverdue ? "text-red-600" : "text-gray-500"
                  )}>
                    <ApperIcon name="Calendar" size={12} className="mr-1" />
                    {format(new Date(task.dueDate), "MMM d")}
                    {isOverdue && (
                      <span className="ml-1 text-red-500 font-medium">(Overdue)</span>
                    )}
</div>
                )}
                
                {task.isRecurring && (
                  <div className="flex items-center text-xs text-primary bg-primary/10 px-2 py-1 rounded-md">
                    <ApperIcon name="RotateCcw" size={12} className="mr-1" />
                    {task.frequency.charAt(0).toUpperCase() + task.frequency.slice(1)}
                    {task.recurringTime && ` at ${task.recurringTime}`}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="p-1 h-8 w-8"
              >
                <ApperIcon name="Edit2" size={14} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.Id)}
                className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;