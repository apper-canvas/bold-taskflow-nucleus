import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { subcategoryService } from "@/services/api/subcategoryService";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import RecurringConfig from "@/components/molecules/RecurringConfig";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";

const TaskForm = ({ task, categories, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);

// Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    categoryId: "",
    subcategoryId: "",
    urgency: "medium",
    isRecurring: false,
    frequency: "daily",
    selectedDays: [],
    recurringTime: "09:00"
  });

  // Load subcategories when category changes
  useEffect(() => {
    const loadSubcategories = async () => {
      if (formData.categoryId) {
        setSubcategoriesLoading(true);
        try {
          const subcategoriesData = await subcategoryService.getByCategoryId(formData.categoryId);
          setSubcategories(subcategoriesData);
        } catch (error) {
          console.error('Error loading subcategories:', error);
          setSubcategories([]);
        } finally {
          setSubcategoriesLoading(false);
        }
      } else {
        setSubcategories([]);
        setFormData(prev => ({ ...prev, subcategoryId: "" }));
      }
    };
    
    loadSubcategories();
  }, [formData.categoryId]);

// Load task data for editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
        priority: task.priority || "medium",
        categoryId: task.categoryId?.toString() || "",
        subcategoryId: task.subcategoryId?.toString() || "",
        urgency: task.urgency || "medium",
        isRecurring: task.isRecurring || false,
        frequency: task.frequency || "daily",
        selectedDays: task.selectedDays || [],
        recurringTime: task.recurringTime || "09:00"
      });
    }
  }, [task]);
const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };
  const handleRecurringToggle = () => {
    setFormData(prev => ({ ...prev, isRecurring: !prev.isRecurring }));
    if (errors.isRecurring) {
      setErrors(prev => ({ ...prev, isRecurring: "" }));
    }
  };

  const handleFrequencyChange = (frequency) => {
    setFormData(prev => ({ 
      ...prev, 
      frequency,
      selectedDays: frequency === "daily" || frequency === "monthly" ? [] : prev.selectedDays
    }));
    if (errors.frequency) {
      setErrors(prev => ({ ...prev, frequency: "" }));
    }
  };

  const handleDaysChange = (selectedDays) => {
    setFormData(prev => ({ ...prev, selectedDays }));
    if (errors.selectedDays) {
      setErrors(prev => ({ ...prev, selectedDays: "" }));
    }
  };

  const handleTimeChange = (recurringTime) => {
    setFormData(prev => ({ ...prev, recurringTime }));
    if (errors.recurringTime) {
      setErrors(prev => ({ ...prev, recurringTime: "" }));
    }
  };
const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category";
    }
    
    if (formData.categoryId && !formData.subcategoryId) {
      newErrors.subcategoryId = "Please select a subcategory";
    }

    // Validate recurring configuration
    if (formData.isRecurring) {
      if ((formData.frequency === "weekly" || formData.frequency === "custom") && formData.selectedDays.length === 0) {
        newErrors.selectedDays = "Please select at least one day";
      }
      if (!formData.recurringTime) {
        newErrors.recurringTime = "Please select a time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const taskData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      title: formData.title.trim(),
      description: formData.description.trim()
    };

    onSubmit(taskData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
<h2 className="text-xl font-semibold text-gray-900">
              {task?.Id ? "Edit Task" : (task?.title ? `Create from Template: ${task.title}` : "Create New Task")}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="p-2"
            >
              <ApperIcon name="X" size={18} />
            </Button>
          </div>
<form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Task Title"
              required
              value={formData.title}
              onChange={handleChange("title")}
              placeholder="Enter task title..."
              error={errors.title}
            />

            <FormField
              label="Description"
              type="textarea"
              value={formData.description}
              onChange={handleChange("description")}
              placeholder="Add task description..."
              rows={3}
            />

            <FormField
              label="Category"
              type="select"
              required
              value={formData.categoryId}
              onChange={handleChange("categoryId")}
              error={errors.categoryId}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.Id} value={category.Id}>
                  {category.name}
                </option>
              ))}
            </FormField>

            {formData.categoryId && (
              <FormField
                label="Subcategory"
                type="select"
                required
                value={formData.subcategoryId}
                onChange={handleChange("subcategoryId")}
                error={errors.subcategoryId}
              >
                <option value="">Select a subcategory</option>
                {subcategories.map(subcategory => (
                  <option key={subcategory.Id} value={subcategory.Id}>
                    {subcategory.name}
                  </option>
                ))}
              </FormField>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Priority"
                type="select"
                value={formData.priority}
                onChange={handleChange("priority")}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </FormField>

              <FormField
                label="Urgency"
                type="select"
                value={formData.urgency}
                onChange={handleChange("urgency")}
              >
                <option value="low">Low Urgency</option>
                <option value="medium">Medium Urgency</option>
                <option value="high">High Urgency</option>
                <option value="critical">Critical</option>
              </FormField>
            </div>

            <FormField
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={handleChange("dueDate")}
/>

            <RecurringConfig
              isRecurring={formData.isRecurring}
              frequency={formData.frequency}
              selectedDays={formData.selectedDays}
              recurringTime={formData.recurringTime}
              onToggleRecurring={handleRecurringToggle}
              onFrequencyChange={handleFrequencyChange}
              onDaysChange={handleDaysChange}
              onTimeChange={handleTimeChange}
              errors={errors}
            />
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
              >
                <ApperIcon name={task ? "Save" : "Plus"} size={16} className="mr-2" />
                {task ? "Save Changes" : "Create Task"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TaskForm;