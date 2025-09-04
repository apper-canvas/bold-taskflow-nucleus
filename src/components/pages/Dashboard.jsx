import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import TaskList from "@/components/organisms/TaskList";
import TaskForm from "@/components/organisms/TaskForm";
import TaskFilters from "@/components/organisms/TaskFilters";
import TaskStatsSection from "@/components/organisms/TaskStats";
import TaskTemplateModal from "@/components/organisms/TaskTemplateModal";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import { templateService } from "@/services/api/templateService";
const Dashboard = () => {
// Data state
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter state
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Bulk selection state
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter and search logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      const matchesSearch = !searchQuery || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status filter
      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "active" && !task.completed) ||
        (statusFilter === "completed" && task.completed);

      // Category filter
      const matchesCategory = categoryFilter === "all" || 
        task.categoryId === categoryFilter;

      // Priority filter
      const matchesPriority = priorityFilter === "all" || 
        task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, categoryFilter, priorityFilter]);

const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleShowTemplates = () => {
    setShowTemplateModal(true);
  };

  const handleSelectTemplate = async (template) => {
    try {
      const taskData = templateService.applyTemplate(template);
      setEditingTask(taskData);
      setShowTaskForm(true);
      setShowTemplateModal(false);
      toast.info(`Template "${template.title}" applied!`);
    } catch (error) {
      toast.error("Failed to apply template");
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleTaskSubmit = async (taskData) => {
    try {
      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.Id, taskData);
        setTasks(prev => prev.map(task => 
          task.Id === editingTask.Id ? updatedTask : task
        ));
        toast.success("Task updated successfully!");
      } else {
        const newTask = await taskService.create(taskData);
        setTasks(prev => [newTask, ...prev]);
        toast.success("Task created successfully!");
      }
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (err) {
      toast.error("Failed to save task. Please try again.");
      console.error("Error saving task:", err);
    }
  };

const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      if (!task) return;

      const updatedTask = await taskService.update(taskId, {
        ...task,
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null
      });

      setTasks(prev => prev.map(t => 
        t.Id === taskId ? updatedTask : t
      ));

      toast.success(
        updatedTask.completed ? "Task completed! 🎉" : "Task marked as active"
      );
    } catch (err) {
      toast.error("Failed to update task status.");
      console.error("Error updating task:", err);
    }
  };

  const handleToggleBulkSelect = (taskId) => {
    setSelectedTaskIds(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
    
    if (!isSelectMode && !selectedTaskIds.includes(taskId)) {
      setIsSelectMode(true);
    }
  };

  const handleSelectAll = () => {
    setSelectedTaskIds(tasks.map(task => task.Id));
    setIsSelectMode(true);
  };

  const handleClearSelection = () => {
    setSelectedTaskIds([]);
    setIsSelectMode(false);
  };

  const handleBulkMarkComplete = async () => {
    try {
      const completedTasks = await taskService.bulkUpdate(selectedTaskIds, {
        completed: true,
        completedAt: new Date().toISOString()
      });
      
      setTasks(prev => prev.map(task => 
        completedTasks.find(ct => ct.Id === task.Id) || task
      ));
      
      toast.success(`${selectedTaskIds.length} tasks marked as completed! 🎉`);
      handleClearSelection();
    } catch (err) {
      toast.error("Failed to mark tasks as completed.");
      console.error("Error bulk completing tasks:", err);
    }
  };

  const handleBulkArchive = async () => {
    try {
      const archivedTasks = await taskService.bulkArchive(selectedTaskIds);
      
      setTasks(prev => prev.map(task => 
        archivedTasks.find(at => at.Id === task.Id) || task
      ));
      
      toast.success(`${selectedTaskIds.length} tasks archived successfully!`);
      handleClearSelection();
    } catch (err) {
      toast.error("Failed to archive tasks.");
      console.error("Error bulk archiving tasks:", err);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedTaskIds.length} tasks? This action cannot be undone.`)) {
      return;
    }

    try {
      const deletedCount = await taskService.bulkDelete(selectedTaskIds);
      
      setTasks(prev => prev.filter(task => !selectedTaskIds.includes(task.Id)));
      
      toast.success(`${deletedCount} tasks deleted successfully!`);
      handleClearSelection();
    } catch (err) {
      toast.error("Failed to delete tasks.");
      console.error("Error bulk deleting tasks:", err);
    }
  };

const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete task. Please try again.");
      console.error("Error deleting task:", err);
    }
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
<Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateTask={handleCreateTask}
        onShowTemplates={handleShowTemplates}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <TaskFilters
              categories={categories}
              activeCategory={categoryFilter}
              onCategoryChange={setCategoryFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {statusFilter === "all" && "All Tasks"}
                    {statusFilter === "active" && "Active Tasks"}
                    {statusFilter === "completed" && "Completed Tasks"}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} found
                  </p>
                </div>
              </div>

              <TaskList
                tasks={filteredTasks}
                categories={categories}
                loading={loading}
                error={error}
                onToggleComplete={handleToggleComplete}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onCreateTask={handleCreateTask}
                onRetry={loadData}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <TaskStatsSection tasks={tasks} />
          </div>
        </div>
</main>

      {/* Template Gallery Modal */}
      <TaskTemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          categories={categories}
          onSubmit={handleTaskSubmit}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Dashboard;