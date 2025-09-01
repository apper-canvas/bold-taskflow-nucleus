import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return a copy to prevent direct mutations
    return this.tasks.map(task => ({ ...task }));
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const task = this.tasks.find(task => task.Id === parseInt(id));
    return task ? { ...task } : null;
  }

  async create(taskData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Find the highest existing Id and add 1
    const maxId = this.tasks.reduce((max, task) => 
      Math.max(max, task.Id), 0
    );
    
const newTask = {
      Id: maxId + 1,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      isRecurring: taskData.isRecurring || false,
      frequency: taskData.frequency || "daily",
      selectedDays: taskData.selectedDays || [],
      recurringTime: taskData.recurringTime || "09:00"
    };
    
    this.tasks.unshift(newTask);
    return { ...newTask };
  }

  async update(id, taskData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    const updatedTask = {
...this.tasks[index],
      ...taskData,
      Id: parseInt(id), // Ensure Id remains an integer
      isRecurring: taskData.isRecurring !== undefined ? taskData.isRecurring : this.tasks[index].isRecurring,
      frequency: taskData.frequency || this.tasks[index].frequency,
      selectedDays: taskData.selectedDays !== undefined ? taskData.selectedDays : this.tasks[index].selectedDays,
      recurringTime: taskData.recurringTime || this.tasks[index].recurringTime
    };
    
    this.tasks[index] = updatedTask;
    return { ...updatedTask };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    this.tasks.splice(index, 1);
    return true;
  }

  // Additional utility methods for task management
  async getByCategory(categoryId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.tasks
      .filter(task => task.categoryId === categoryId)
      .map(task => ({ ...task }));
  }

  async getByStatus(completed) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.tasks
      .filter(task => task.completed === completed)
      .map(task => ({ ...task }));
  }

  async getByPriority(priority) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.tasks
      .filter(task => task.priority === priority)
      .map(task => ({ ...task }));
  }
}

export const taskService = new TaskService();