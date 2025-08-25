import React from "react";
import TaskStats from "@/components/molecules/TaskStats";
import ApperIcon from "@/components/ApperIcon";

const TaskStatsSection = ({ tasks = [], className }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Tasks due today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const tasksDueToday = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    return dueDate >= today && dueDate < tomorrow;
  }).length;

  // Overdue tasks
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    return dueDate < today;
  }).length;

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Overview</h2>
        <p className="text-gray-600">Your task completion progress</p>
      </div>
      
      <div className="space-y-4">
        <TaskStats
          title="Total Tasks"
          value={totalTasks}
          subtitle={`${activeTasks} active tasks`}
          color="primary"
        />
        
        <TaskStats
          title="Completed"
          value={completedTasks}
          subtitle={`${completionRate}% completion rate`}
          color="success"
        />
        
        {tasksDueToday > 0 && (
          <TaskStats
            title="Due Today"
            value={tasksDueToday}
            subtitle="Tasks to complete today"
            color="warning"
          />
        )}
        
        {overdueTasks > 0 && (
          <TaskStats
            title="Overdue"
            value={overdueTasks}
            subtitle="Tasks past due date"
            color="accent"
          />
        )}
      </div>

      {totalTasks > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/10">
          <div className="flex items-center mb-2">
            <ApperIcon name="TrendingUp" size={16} className="text-primary mr-2" />
            <span className="text-sm font-medium text-gray-700">Progress</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {completionRate}% of tasks completed
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskStatsSection;