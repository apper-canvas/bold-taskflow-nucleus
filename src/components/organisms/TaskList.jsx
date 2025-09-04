import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import TaskCard from "@/components/organisms/TaskCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const TaskList = ({
  tasks = [],
  categories = [],
  loading = false,
  error = null,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onCreateTask,
  onRetry,
  selectedTaskIds = [],
  isSelectMode = false,
  onToggleBulkSelect
}) => {
  if (loading) {
    return <Loading rows={5} />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }

  if (tasks.length === 0) {
    return (
      <Empty
        title="No tasks found"
        description="Create your first task or adjust your filters to see tasks here."
        actionText="Create Task"
        onAction={onCreateTask}
      />
    );
  }

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.Id === categoryId);
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <motion.div
            key={task.Id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
<TaskCard
              task={task}
              category={getCategoryById(task.categoryId)}
              onToggleComplete={onToggleComplete}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              selectedTaskIds={selectedTaskIds}
              isSelectMode={isSelectMode}
              onToggleBulkSelect={onToggleBulkSelect}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;