import { toast } from "react-toastify";
import React from "react";

class TaskService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task_c';
  }

  // Map UI field names to database field names
  mapToDatabase(taskData) {
    return {
      title_c: taskData.title,
      description_c: taskData.description,
      due_date_c: taskData.dueDate,
      priority_c: taskData.priority,
      category_id_c: parseInt(taskData.categoryId),
      completed_c: taskData.completed,
      created_at_c: taskData.createdAt,
      completed_at_c: taskData.completedAt,
      is_recurring_c: taskData.isRecurring,
      frequency_c: taskData.frequency,
      selected_days_c: Array.isArray(taskData.selectedDays) ? taskData.selectedDays.join(',') : taskData.selectedDays,
      recurring_time_c: taskData.recurringTime
    };
  }

  // Map database field names to UI field names
  mapFromDatabase(dbTask) {
    return {
      Id: dbTask.Id,
      title: dbTask.title_c,
      description: dbTask.description_c,
      dueDate: dbTask.due_date_c,
      priority: dbTask.priority_c,
      categoryId: dbTask.category_id_c?.Id || dbTask.category_id_c,
      completed: dbTask.completed_c,
      createdAt: dbTask.created_at_c,
      completedAt: dbTask.completed_at_c,
      isRecurring: dbTask.is_recurring_c,
      frequency: dbTask.frequency_c,
      selectedDays: typeof dbTask.selected_days_c === 'string' ? 
        dbTask.selected_days_c.split(',').map(d => parseInt(d)).filter(d => !isNaN(d)) : 
        dbTask.selected_days_c || [],
      recurringTime: dbTask.recurring_time_c
    };
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "is_recurring_c"}},
          {"field": {"Name": "frequency_c"}},
          {"field": {"Name": "selected_days_c"}},
          {"field": {"Name": "recurring_time_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error('Failed to fetch tasks:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data ? response.data.map(task => this.mapFromDatabase(task)) : [];
    } catch (error) {
      console.error('Error fetching tasks:', error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "is_recurring_c"}},
          {"field": {"Name": "frequency_c"}},
          {"field": {"Name": "selected_days_c"}},
          {"field": {"Name": "recurring_time_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }

      return this.mapFromDatabase(response.data);
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(taskData) {
    try {
      const dbData = this.mapToDatabase({
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
        isRecurring: taskData.isRecurring || false,
        frequency: taskData.frequency || "daily",
        selectedDays: taskData.selectedDays || [],
        recurringTime: taskData.recurringTime || "09:00"
      });

      const params = {
        records: [dbData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error('Failed to create task:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return this.mapFromDatabase(successful[0].data);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error creating task:', error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, taskData) {
    try {
      const dbData = this.mapToDatabase({
        ...taskData,
        Id: parseInt(id)
      });

      const params = {
        records: [{
          Id: parseInt(id),
          ...dbData
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error('Failed to update task:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return this.mapFromDatabase(successful[0].data);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error updating task:', error?.response?.data?.message || error);
      return null;
    }
  }
async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error('Failed to delete task:', response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting task:', error?.response?.data?.message || error);
      return false;
    }
  }

  async bulkUpdate(taskIds, updates) {
    try {
      const records = taskIds.map(id => ({
        Id: parseInt(id),
        ...updates
      }));

      const params = { records };
      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error('Failed to bulk update tasks:', response.message);
        toast.error(response.message);
        return [];
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.map(r => this.mapFromDatabase(r.data));
      }
      
      return [];
    } catch (error) {
      console.error('Error bulk updating tasks:', error?.response?.data?.message || error);
      return [];
    }
  }

  async bulkDelete(taskIds) {
    try {
      const params = { 
        RecordIds: taskIds.map(id => parseInt(id))
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error('Failed to bulk delete tasks:', response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length;
      }
      
      return taskIds.length;
    } catch (error) {
      console.error('Error bulk deleting tasks:', error?.response?.data?.message || error);
      return 0;
    }
  }

async bulkArchive(taskIds) {
    return this.bulkUpdate(taskIds, { 
      archived: true,
      archivedAt: new Date().toISOString()
    });
  }

  // Additional utility methods for task management
  async getByCategory(categoryId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "is_recurring_c"}},
          {"field": {"Name": "frequency_c"}},
          {"field": {"Name": "selected_days_c"}},
          {"field": {"Name": "recurring_time_c"}}
        ],
        where: [{"FieldName": "category_id_c", "Operator": "EqualTo", "Values": [parseInt(categoryId)]}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error('Failed to fetch tasks by category:', response.message);
        return [];
      }

      return response.data ? response.data.map(task => this.mapFromDatabase(task)) : [];
    } catch (error) {
      console.error('Error fetching tasks by category:', error?.response?.data?.message || error);
      return [];
    }
  }

  async getByStatus(completed) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "is_recurring_c"}},
          {"field": {"Name": "frequency_c"}},
          {"field": {"Name": "selected_days_c"}},
          {"field": {"Name": "recurring_time_c"}}
        ],
        where: [{"FieldName": "completed_c", "Operator": "EqualTo", "Values": [completed]}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error('Failed to fetch tasks by status:', response.message);
        return [];
      }

      return response.data ? response.data.map(task => this.mapFromDatabase(task)) : [];
    } catch (error) {
      console.error('Error fetching tasks by status:', error?.response?.data?.message || error);
      return [];
    }
  }

  async getByPriority(priority) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "is_recurring_c"}},
          {"field": {"Name": "frequency_c"}},
          {"field": {"Name": "selected_days_c"}},
          {"field": {"Name": "recurring_time_c"}}
        ],
        where: [{"FieldName": "priority_c", "Operator": "EqualTo", "Values": [priority]}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error('Failed to fetch tasks by priority:', response.message);
        return [];
      }

      return response.data ? response.data.map(task => this.mapFromDatabase(task)) : [];
    } catch (error) {
      console.error('Error fetching tasks by priority:', error?.response?.data?.message || error);
      return [];
    }
  }
}

export const taskService = new TaskService();